import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Database connection configuration
const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQL_PORT || '3306'),
}

// Helper function to parse funding data and extract numeric values with units
function parseFundingData(fundingData: string | any[]): string | undefined {
  if (!fundingData) return undefined;
  
  let dataString = '';
  
  // Handle array or string input
  if (Array.isArray(fundingData)) {
    dataString = fundingData.join(' ');
  } else {
    dataString = String(fundingData);
  }
  
  // Remove extra whitespace and normalize
  dataString = dataString.trim().toLowerCase();
  
  if (!dataString) return undefined;
  
  // Patterns to match various funding formats
  const patterns = [
    // $1.5B, $1.5 billion, $1.5b
    /\$?(\d+(?:\.\d+)?)\s*(?:billion|b\b)/gi,
    // $1.5M, $1.5 million, $1.5m  
    /\$?(\d+(?:\.\d+)?)\s*(?:million|m\b)/gi,
    // Just numbers with B/M
    /(\d+(?:\.\d+)?)\s*([bm])\b/gi,
    // Numbers followed by billion/million words
    /(\d+(?:\.\d+)?)\s*(billion|million)/gi
  ];
  
  const matches = [];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(dataString)) !== null) {
      const value = parseFloat(match[1]);
      const unit = match[2] ? match[2].toLowerCase() : '';
      
      if (unit.startsWith('b') || unit === 'billion') {
        matches.push(`$${value}B`);
      } else if (unit.startsWith('m') || unit === 'million') {
        matches.push(`$${value}M`);
      }
    }
  }
  
  // If no structured matches found, try to extract any numbers and guess context
  if (matches.length === 0) {
    const numberMatch = dataString.match(/\$?(\d+(?:\.\d+)?)/);
    if (numberMatch) {
      const value = parseFloat(numberMatch[1]);
      // If the original string contains billion/million context, use it
      if (dataString.includes('billion') || dataString.includes('b')) {
        matches.push(`$${value}B`);
      } else if (dataString.includes('million') || dataString.includes('m')) {
        matches.push(`$${value}M`);
      } else if (value > 1000) {
        // Assume large numbers are millions
        matches.push(`$${value}M`);
      } else {
        matches.push(`$${value}K`);
      }
    }
  }
  
  return matches.length > 0 ? matches[0] : undefined;
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
        funding_data,
        detailed_analysis,
        summary
      FROM jobs_tracker
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
    
    // Parse funding data properly
    const parsedFundingData = parseFundingData(row.funding_data);
    
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
      summary: row.summary,
      fullContent: row.detailed_analysis,
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
        costSavings: parsedFundingData,
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