import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Database connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.DB_PORT || '3306'),
}

export async function GET(request: NextRequest) {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection(dbConfig)
    
    // Query to fetch articles with necessary fields for sidebar
    const [rows] = await connection.execute(`
      SELECT 
        id, 
        title, 
        url,
        jobs_at_risk,
        jobs_replaced,
        new_ai_jobs,
        skills_remaining,
        skills_automated,
        affected_industry,
        funding_data
      FROM future_of_jobs 
      ORDER BY id DESC
    `)
    
    // Transform the data to match your component interface
    const articles = (rows as any[]).map(row => ({
      id: row.id,
      title: row.title,
      source: 'Tech Analysis', // You can extract this from URL or add a source column
      date: new Date().toISOString(), // Add a date column to your table if needed
      category: row.affected_industry || 'Technology',
      url: row.url,
      summary: `Analysis of ${row.jobs_at_risk || 0} jobs at risk with ${row.new_ai_jobs || 0} new AI positions`,
      fullContent: `This article analyzes the impact on ${row.affected_industry || 'various industries'} with ${row.jobs_replaced || 0} jobs being replaced and ${row.new_ai_jobs || 0} new opportunities created.`,
      insights: {
        jobsAffected: parseInt(row.jobs_at_risk) || 0,
        companiesInvolved: 1, // You can calculate this or add to your schema
        timeframe: '2024-2025',
        sectors: row.affected_industry ? [row.affected_industry] : ['Technology'],
        skillsReplaced: row.skills_automated ? row.skills_automated.split(',').map((s: string) => s.trim()) : [],
        skillsCreated: row.skills_remaining ? row.skills_remaining.split(',').map((s: string) => s.trim()) : [],
        trend: determinesTrend(row.jobs_at_risk, row.new_ai_jobs),
        impactScore: calculateImpactScore(row.jobs_at_risk, row.new_ai_jobs),
        geographicSpread: ['Global'], // Add geographic data to your schema if needed
        costSavings: row.funding_data || undefined,
        jobCreationRatio: calculateJobRatio(row.jobs_replaced, row.new_ai_jobs)
      }
    }))
    
    await connection.end()
    
    return NextResponse.json(articles)
    
  } catch (error) {
    console.error('Database error:', error)
    
    if (connection) {
      await connection.end()
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch articles from database' },
      { status: 500 }
    )
  }
}

// Helper function to determine trend based on job data
function determinesTrend(jobsAtRisk: number, newAiJobs: number): "positive" | "negative" | "neutral" {
  const jobsAtRiskNum = parseInt(String(jobsAtRisk)) || 0
  const newAiJobsNum = parseInt(String(newAiJobs)) || 0
  
  if (newAiJobsNum > jobsAtRiskNum) {
    return "positive"
  } else if (jobsAtRiskNum > newAiJobsNum * 1.5) {
    return "negative"
  } else {
    return "neutral"
  }
}

// Helper function to calculate impact score (1-10)
function calculateImpactScore(jobsAtRisk: number, newAiJobs: number): number {
  const jobsAtRiskNum = parseInt(String(jobsAtRisk)) || 0
  const newAiJobsNum = parseInt(String(newAiJobs)) || 0
  const totalImpact = jobsAtRiskNum + newAiJobsNum
  
  // Scale impact based on total jobs affected (this is a simple example)
  if (totalImpact > 100000) return 10
  if (totalImpact > 50000) return 8
  if (totalImpact > 10000) return 6
  if (totalImpact > 1000) return 4
  if (totalImpact > 100) return 2
  return 1
}

// Helper function to calculate job creation ratio
function calculateJobRatio(jobsReplaced: number, newAiJobs: number): number {
  const replacedNum = parseInt(String(jobsReplaced)) || 0
  const newNum = parseInt(String(newAiJobs)) || 0
  
  if (replacedNum === 0) return newNum > 0 ? newNum : 0
  return Math.round((newNum / replacedNum) * 10) / 10
}