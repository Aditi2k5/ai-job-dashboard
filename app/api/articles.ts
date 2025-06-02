import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const connection = await pool.getConnection();
    
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
      const fundingData = parseJsonField(row.funding_data);

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

      return {
        id: row.id,
        title: row.title || `Article ${row.id}`,
        source: "Future of Jobs Database",
        date: new Date().toISOString().split('T')[0], // You might want to add a date field to your DB
        category: affectedIndustries[0] || "Technology",
        url: row.url || "#",
        summary: `Analysis of ${jobsAtRisk.toLocaleString()} jobs at risk and ${newAiJobs.toLocaleString()} new AI jobs created in ${affectedIndustries.join(", ")}.`,
        fullContent: `This analysis examines the impact of AI and automation on ${affectedIndustries.join(", ")} sectors. 
        
        The study reveals that ${jobsAtRisk.toLocaleString()} jobs are at risk of automation, while ${newAiJobs.toLocaleString()} new AI-related positions are expected to be created. ${jobsReplaced.toLocaleString()} traditional roles may be replaced entirely.
        
        Key skills remaining relevant include: ${skillsRemaining.join(", ")}. 
        Skills being automated include: ${skillsAutomated.join(", ")}.
        
        The transformation is expected to significantly impact ${affectedIndustries.join(", ")} industries, with funding data showing ${fundingData.length > 0 ? fundingData.join(", ") : "significant investment"} in automation technologies.`,
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
          costSavings: fundingData.length > 0 ? fundingData[0] : undefined,
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