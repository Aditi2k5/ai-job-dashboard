import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, ExternalLink } from "lucide-react"

export function NewsSection() {
  const articles = [
    {
      title: "AI Replaces 30% of Customer Service Roles at Major Tech Companies",
      source: "Tech Insider",
      date: "May 15, 2023",
      category: "Layoffs",
      url: "#",
    },
    {
      title: "New Study Shows AI Creating More Jobs Than It Eliminates in Healthcare",
      source: "Health Tech Today",
      date: "June 2, 2023",
      category: "Job Creation",
      url: "#",
    },
    {
      title: "Prompt Engineering: The Hottest New Career Path in 2023",
      source: "Career Trends",
      date: "June 10, 2023",
      category: "Emerging Jobs",
      url: "#",
    },
    {
      title: "Financial Sector Sees 45% Reduction in Analyst Positions Due to AI",
      source: "Finance Weekly",
      date: "June 18, 2023",
      category: "Automation",
      url: "#",
    },
    {
      title: "Government Launches $2B Initiative for AI Workforce Retraining",
      source: "Policy News",
      date: "June 22, 2023",
      category: "Policy",
      url: "#",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest AI Job News</CardTitle>
        <CardDescription>Recent articles about AI's impact on employment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {articles.map((article, index) => (
            <div key={index} className="flex flex-col space-y-2 border-b pb-4 last:border-0">
              <div className="flex items-start justify-between">
                <a href={article.url} className="font-medium hover:underline">
                  {article.title}
                </a>
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>{article.source}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    <span>{article.date}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
