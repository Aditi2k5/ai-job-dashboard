import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../lib/db';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const connection = await pool.getConnection();
    
    // Limit to 12 articles for the sidebar (you can adjust this number)
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
      ORDER BY id DESC
      LIMIT 12
    `);

    connection.release();

    // Transform database data to match component interface
    const articles = (rows as any[]).map((row, index) => {
      // Parse JSON fields safely
      const parseJsonField = (field: string) => {
        try {
          return field ? JSON.parse(field) : [];
        } catch {
          return field ? field.split(',').map((item: string) => item.trim()) : [];
        }
      };

      const skillsRemaining = parseJsonField(row.skills_remaining);
      const skillsAutomated = parseJsonField(row.skills_automated);
      const affectedIndustries = parseJsonField(row.affected_industry);
      const fundingDataRaw = parseJsonField(row.funding_data);

      // Parse funding data properly
      const parsedFundingData = parseFundingData(fundingDataRaw);

      // Determine trend based on jobs data
      const jobsAtRisk = parseInt(row.jobs_at_risk) || 0;
      const newAiJobs = parseInt(row.new_ai_jobs) || 0;
      const jobsReplaced = parseInt(row.jobs_replaced) || 0;
      
      let trend: "positive" | "negative" | "neutral" = "neutral";
      if (newAiJobs > jobsReplaced) {
        trend = "positive";
      } else if (jobsReplaced > newAiJobs) {
        trend = "negative";
      }

      // Calculate impact score (1-10 scale)
      const impactScore = Math.min(10, Math.max(1, Math.round((jobsAtRisk + jobsReplaced) / 1000)));

      // Clean title by removing surrounding quotes
      const cleanTitle = row.title 
        ? row.title.replace(/^["']|["']$/g, '').trim()
        : 'Untitled Article';

      return {
        id: row.id,
        title: cleanTitle,
        source: "Future of Jobs Database",
        date: new Date().toISOString().split('T')[0], // You might want to add a date field to your DB
        category: affectedIndustries[0] || "Technology",
        url: row.url || "#",
        summary: row.summary || "This is a summary of the article.",
        fullContent: row.detailed_analysis || `This analysis examines the impact of AI and automation on ${affectedIndustries.join(", ")} sectors. 
        
        The study reveals that ${newAiJobs.toLocaleString()} new AI-related positions are expected to be created, while ${jobsReplaced.toLocaleString()} traditional roles may be replaced entirely.
        
        Key skills remaining relevant include: ${skillsRemaining.join(", ")}. 
        Skills being automated include: ${skillsAutomated.join(", ")}.
        
        The transformation is expected to significantly impact ${affectedIndustries.join(", ")} industries, with funding data showing ${parsedFundingData || "significant investment"} in automation technologies.`,
        insights: {
          jobsAffected: jobsAtRisk,
          companiesInvolved: Math.max(1, Math.floor(jobsAtRisk / 100)), // Estimate based on jobs
          timeframe: "2024-2026",
          sectors: affectedIndustries,
          skillsReplaced: skillsAutomated.length > 0 ? skillsAutomated : undefined,
          skillsCreated: newAiJobs > 0 ? skillsRemaining : undefined,
          trend: trend,
          impactScore: impactScore,
          geographicSpread: ["North America", "Europe", "Asia-Pacific"], // You might want to add this to your DB
          costSavings: parsedFundingData,
          jobCreationRatio: newAiJobs > 0 ? Math.round((newAiJobs / Math.max(1, jobsReplaced)) * 10) / 10 : undefined
        }
      };
    });

    res.status(200).json(articles);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
  }
}