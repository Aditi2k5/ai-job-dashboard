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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let connection;
  
  try {
    const articleId = parseInt(params.id)
    
    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: 'Invalid article ID' },
        { status: 400 }
      )
    }

    // Create database connection
    connection = await mysql.createConnection(dbConfig)
    
    // Query to fetch specific article by ID
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
      WHERE id = ?
    `, [articleId])
    
    const articles = rows as any[]
    
    if (articles.length === 0) {
      await connection.end()
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    const row = articles[0]
    
    // Transform the data to match your component interface
    const article = {
      id: row.id,
      title: row.title,
      source: extractSourceFromUrl(row.url),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      category: row.affected_industry || 'Technology',
      url: row.url,
      summary: generateSummary(row),
      fullContent: generateFullContent(row),
      insights: {
        jobsAffected: parseInt(row.jobs_at_risk) || 0,
        companiesInvolved: calculateCompaniesInvolved(row),
        timeframe: '2024-2025',
        sectors: row.affected_industry ? [row.affected_industry] : ['Technology'],
        skillsReplaced: row.skills_automated ? 
          row.skills_automated.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        skillsCreated: row.skills_remaining ? 
          row.skills_remaining.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        trend: determineTrend(row.jobs_at_risk, row.new_ai_jobs),
        impactScore: calculateImpactScore(row.jobs_at_risk, row.new_ai_jobs),
        geographicSpread: ['Global', 'North America', 'Europe'], // You can expand this based on your data
        costSavings: row.funding_data || undefined,
        jobCreationRatio: calculateJobRatio(row.jobs_replaced, row.new_ai_jobs)
      }
    }
    
    await connection.end()
    
    return NextResponse.json(article)
    
  } catch (error) {
    console.error('Database error:', error)
    
    if (connection) {
      await connection.end()
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch article from database' },
      { status: 500 }
    )
  }
}

// Helper function to extract source from URL
function extractSourceFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.replace('www.', '')
    return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1)
  } catch {
    return 'Tech Analysis'
  }
}

// Helper function to generate summary
function generateSummary(row: any): string {
  const jobsAtRisk = parseInt(row.jobs_at_risk) || 0
  const newAiJobs = parseInt(row.new_ai_jobs) || 0
  const jobsReplaced = parseInt(row.jobs_replaced) || 0
  const industry = row.affected_industry || 'various industries'
  
  return `This analysis examines the impact of AI and automation on ${industry}. 
    The study reveals that ${jobsAtRisk.toLocaleString()} jobs are at risk of being affected, 
    with ${jobsReplaced.toLocaleString()} positions potentially being replaced. 
    However, the technological advancement is also expected to create ${newAiJobs.toLocaleString()} 
    new AI-related positions, indicating a shift in the job market rather than a net loss.`
}

// Helper function to generate full content
function generateFullContent(row: any): string {
  const jobsAtRisk = parseInt(row.jobs_at_risk) || 0
  const newAiJobs = parseInt(row.new_ai_jobs) || 0
  const jobsReplaced = parseInt(row.jobs_replaced) || 0
  const industry = row.affected_industry || 'technology sector'
  const skillsAutomated = row.skills_automated ? row.skills_automated.split(',').map((s: string) => s.trim()) : []
  const skillsRemaining = row.skills_remaining ? row.skills_remaining.split(',').map((s: string) => s.trim()) : []
  
  return `The ${industry} is experiencing significant transformation due to artificial intelligence and automation technologies. 
    Our comprehensive analysis indicates that ${jobsAtRisk.toLocaleString()} positions are currently at risk of being impacted by these technological changes.

    Key findings from this analysis include:

    Job Displacement: Approximately ${jobsReplaced.toLocaleString()} traditional roles may be replaced by automated systems. 
    The skills most affected include: ${skillsAutomated.join(', ')}.

    Job Creation: Despite the displacement, ${newAiJobs.toLocaleString()} new positions are expected to emerge, 
    particularly in areas requiring human oversight of AI systems, creative problem-solving, and technical expertise.

    Skills Evolution: The workforce will need to adapt by developing new competencies. 
    Skills that remain valuable include: ${skillsRemaining.join(', ')}.

    Economic Impact: The transition represents both challenges and opportunities for the ${industry}. 
    ${row.funding_data ? `Investment in this transition is estimated at ${row.funding_data}.` : 'Significant investment will be required to manage this transition effectively.'}

    This transformation requires proactive planning from both employers and workers to ensure a smooth transition 
    and to maximize the benefits of technological advancement while minimizing negative impacts on employment.`
}

// Helper function to calculate companies involved (you can enhance this based on your data)
function calculateCompaniesInvolved(row: any): number {
  // This is a placeholder - you might want to add a companies field to your database
  const jobsAtRisk = parseInt(row.jobs_at_risk) || 0
  if (jobsAtRisk > 50000) return Math.floor(Math.random() * 500) + 100
  if (jobsAtRisk > 10000) return Math.floor(Math.random() * 100) + 50
  if (jobsAtRisk > 1000) return Math.floor(Math.random() * 50) + 10
  return Math.floor(Math.random() * 10) + 1
}

// Helper function to determine trend based on job data
function determineTrend(jobsAtRisk: number, newAiJobs: number): "positive" | "negative" | "neutral" {
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
  
  // Scale impact based on total jobs affected
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