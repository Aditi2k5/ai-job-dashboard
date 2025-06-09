import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, ExternalLink, TrendingDown, TrendingUp, Users, Building, Globe, DollarSign, ArrowRight, Clock, Target } from "lucide-react"
import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface Article {
  id: number
  title: string
  source: string
  date: string
  category: string
  url: string
  summary: string
  fullContent: string
  insights: {
    jobsAffected: number
    companiesInvolved: number
    timeframe: string
    sectors: string[]
    skillsReplaced?: string[]
    skillsCreated?: string[]
    trend: "positive" | "negative" | "neutral"
    impactScore: number
    geographicSpread: string[]
    costSavings?: string
    jobCreationRatio?: number
  }
}

export default function ArticleDetail({ article }: { article: Article }) {
  const skillsComparisonChartRef = useRef<HTMLCanvasElement>(null)
  const skillsComparisonChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    // Skills Comparison Chart
    if (skillsComparisonChartRef.current) {
      const ctx = skillsComparisonChartRef.current.getContext("2d")
      if (ctx) {
        if (skillsComparisonChartInstance.current) {
          skillsComparisonChartInstance.current.destroy()
        }

        const skillsReplaced = article.insights.skillsReplaced?.length || 0
        const skillsCreated = article.insights.skillsCreated?.length || 0

        skillsComparisonChartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Skills Replaced", "New Skills Created"],
            datasets: [
              {
                data: [skillsReplaced, skillsCreated],
                backgroundColor: [
                  "rgba(239, 68, 68, 0.8)",
                  "rgba(34, 197, 94, 0.8)"
                ],
                borderColor: [
                  "rgba(239, 68, 68, 1)",
                  "rgba(34, 197, 94, 1)"
                ],
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  font: {
                    size: 12,
                    weight: 500
                  },
                  color: "#64748b"
                }
              },
            },
            cutout: '60%',
          },
        })
      }
    }

    return () => {
      if (skillsComparisonChartInstance.current) skillsComparisonChartInstance.current.destroy()
    }
  }, [article])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "positive": return "text-emerald-700 bg-emerald-50/80 border-emerald-200/60 dark:text-emerald-300 dark:bg-emerald-950/60 dark:border-emerald-800/60 backdrop-blur-sm"
      case "negative": return "text-red-700 bg-red-50/80 border-red-200/60 dark:text-red-300 dark:bg-red-950/60 dark:border-red-800/60 backdrop-blur-sm"
      default: return "text-blue-700 bg-blue-50/80 border-blue-200/60 dark:text-blue-300 dark:bg-blue-950/60 dark:border-blue-800/60 backdrop-blur-sm"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "positive": return <TrendingUp className="h-4 w-4" />
      case "negative": return <TrendingDown className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  // Enhanced function to clean and extract data from potentially messy JSON strings
  const cleanDataString = (data: string | undefined) => {
    if (!data) return "N/A"
    
    try {
      let cleaned = data
        .replace(/[{}"']/g, '')
        .replace(/\\/g, '')
        .replace(/:\s*/g, ': ')
        .replace(/,\s*/g, ', ')
        .trim()
      
      if (cleaned.includes(':')) {
        const pairs = cleaned.split(',').map(pair => pair.trim())
        const values = pairs.map(pair => {
          const parts = pair.split(':')
          return parts.length > 1 ? parts[1].trim() : pair
        }).filter(value => value && value !== 'null' && value !== 'undefined')
        
        if (values.length > 0) {
          return values.join(', ')
        }
      }
      
      return cleaned || "N/A"
    } catch (e) {
      return data.replace(/[{}"']/g, '').trim() || "N/A"
    }
  }

  const extractCostImpact = (costSavings?: string) => {
    if (!costSavings) return "N/A"
    
    const dollarMatches = costSavings.match(/\$[\d.,]+[BMKk]?/g)
    if (dollarMatches && dollarMatches.length > 0) {
      return dollarMatches[0]
    }
    
    const percentMatch = costSavings.match(/(\d+(?:\.\d+)?)%/)
    if (percentMatch) {
      return `${percentMatch[1]}%`
    }
    
    const numericMatch = costSavings.match(/(\d+(?:\.\d+)?)\s*([BMK]illion|[BMK]|million|billion|thousand)/i)
    if (numericMatch) {
      const [, amount, unit] = numericMatch
      const unitLower = unit.toLowerCase()
      if (unitLower.includes('b') || unitLower.includes('billion')) {
        return `$${amount}B`
      } else if (unitLower.includes('m') || unitLower.includes('million')) {
        return `$${amount}M`
      } else if (unitLower.includes('k') || unitLower.includes('thousand')) {
        return `$${amount}K`
      }
    }
    
    return cleanDataString(costSavings)
  }

  const getSkillsAtRiskCount = () => {
    return article.insights.skillsReplaced?.length || 0
  }

  const cleanArrayData = (arr: string[]) => {
    return arr.map(item => cleanDataString(item)).filter(item => item !== "N/A")
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Enhanced Article Header with transparent background */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <CardContent className="p-8 lg:p-12">
          <div className="relative z-10">
            {/* Header Tags */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border font-semibold ${getTrendColor(article.insights.trend)}`}>
                <span className="text-sm capitalize">{article.insights.trend} Impact</span>
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight text-slate-900 dark:text-slate-100 mb-6">
              {article.title}
            </h1>
            
            {/* Metadata */}
            <div className="flex items-center gap-6 text-slate-700 dark:text-slate-300 mb-8 flex-wrap">
              <div className="flex items-center gap-3 bg-white/90 dark:bg-slate-800/90 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-semibold text-sm">{article.source}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/90 dark:bg-slate-800/90 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                <CalendarDays className="h-4 w-4" />
                <span className="font-medium text-sm">{new Date(article.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
            
            {/* Source Link */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Source Article</p>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline break-all transition-colors"
                  >
                    {article.url}
                  </a>
                </div>
                <Button variant="outline" size="sm" asChild className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/20 dark:from-blue-400/10 via-purple-200/10 dark:via-purple-400/5 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        </CardContent>
      </Card>

      {/* Transparent Key Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-blue-50/60 dark:bg-blue-950/60 backdrop-blur-sm border border-blue-200/40 dark:border-blue-800/40 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between h-full">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100/80 dark:bg-blue-800/80 backdrop-blur-sm rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Skills at Risk</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {getSkillsAtRiskCount()}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Skills affected by automation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-purple-50/60 dark:bg-purple-950/60 backdrop-blur-sm border border-purple-200/40 dark:border-purple-800/40 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between h-full">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100/80 dark:bg-purple-800/80 backdrop-blur-sm rounded-lg">
                    <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Organizations</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {formatNumber(article.insights.companiesInvolved)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400">Companies in study</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-emerald-50/60 dark:bg-emerald-950/60 backdrop-blur-sm border border-emerald-200/40 dark:border-emerald-800/40 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between h-full">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-100/80 dark:bg-emerald-800/80 backdrop-blur-sm rounded-lg">
                    <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Global Reach</p>
                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                      {article.insights.geographicSpread.length}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Regions affected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-orange-50/60 dark:bg-orange-950/60 backdrop-blur-sm border border-orange-200/40 dark:border-orange-800/40 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between h-full">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-100/80 dark:bg-orange-800/80 backdrop-blur-sm rounded-lg">
                    <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                      {article.insights.costSavings ? "Cost Impact" : "Job Ratio"}
                    </p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {article.insights.costSavings ? extractCostImpact(article.insights.costSavings) : `${article.insights.jobCreationRatio || 0}:1`}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {article.insights.costSavings ? "Investment impact" : "New jobs created"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid with transparent cards */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Executive Summary */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {cleanDataString(article.summary)}
              </p>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                Detailed Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {cleanDataString(article.fullContent).split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Geographic Impact */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                Geographic Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                {cleanArrayData(article.insights.geographicSpread).map((region, index) => (
                  <div key={region} className="flex items-center gap-3 p-4 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                    <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{region}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sectors Impact */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Sectors Impacted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {cleanArrayData(article.insights.sectors).map((sector, index) => (
                    <div key={sector} className="px-4 py-2 bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{sector}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Skills Comparison Chart */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                Skills Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64 flex items-center justify-center">
                <canvas ref={skillsComparisonChartRef}></canvas>
              </div>
            </CardContent>
          </Card>

          {/* Skills Transformation */}
          {(article.insights.skillsReplaced?.length || article.insights.skillsCreated?.length) && (
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="pb-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                  Skills Transformation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-6">
                {article.insights.skillsReplaced && article.insights.skillsReplaced.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <h3 className="font-semibold text-red-600 dark:text-red-400">Skills at Risk</h3>
                    </div>
                    <div className="space-y-3">
                      {article.insights.skillsReplaced.map((skill, index) => (
                        <div key={`${skill}-${index}`} className="p-3 bg-red-50/80 dark:bg-red-950/80 backdrop-blur-sm rounded-lg border border-red-200/60 dark:border-red-800/60">
                          <span className="text-sm font-medium text-red-700 dark:text-red-300">{cleanDataString(skill)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {article.insights.skillsReplaced?.length && article.insights.skillsCreated?.length && (
                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  </div>
                )}

                {article.insights.skillsCreated && article.insights.skillsCreated.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">Emerging Skills</h3>
                    </div>
                    <div className="space-y-3">
                      {article.insights.skillsCreated.map((skill, index) => (
                        <div key={`${skill}-${index}`} className="p-3 bg-emerald-50/80 dark:bg-emerald-950/80 backdrop-blur-sm rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
                          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{cleanDataString(skill)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-3 p-4 bg-cyan-50/80 dark:bg-cyan-950/80 backdrop-blur-sm rounded-lg border border-cyan-200/60 dark:border-cyan-800/60">
                <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <span className="font-semibold text-cyan-700 dark:text-cyan-300">
                  {cleanDataString(article.insights.timeframe)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}