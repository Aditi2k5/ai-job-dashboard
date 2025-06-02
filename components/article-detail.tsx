import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, ExternalLink, TrendingDown, TrendingUp, Users, Building, Globe, DollarSign, ArrowRight } from "lucide-react"
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
          type: "bar",
          data: {
            labels: ["Skills Replaced", "New Skills Created"],
            datasets: [
              {
                label: "Number of Skills",
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
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Number of Skills",
                  color: "#64748b",
                  font: {
                    size: 12,
                    weight: 500
                  }
                },
                grid: {
                  color: "rgba(100, 116, 139, 0.1)",
                },
                ticks: {
                  color: "#64748b",
                  font: {
                    size: 11
                  }
                }
              },
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#64748b",
                  font: {
                    size: 11
                  }
                }
              }
            },
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
      case "positive": return "text-emerald-700 bg-emerald-100 border-emerald-300 dark:text-emerald-300 dark:bg-emerald-900/70 dark:border-emerald-600"
      case "negative": return "text-red-700 bg-red-100 border-red-300 dark:text-red-300 dark:bg-red-900/70 dark:border-red-600"
      default: return "text-blue-700 bg-blue-100 border-blue-300 dark:text-blue-300 dark:bg-blue-900/70 dark:border-blue-600"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "positive": return <TrendingUp className="h-4 w-4" />
      case "negative": return <TrendingDown className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  // Enhanced function to clean and extract data from potentially messy JSON strings
  const cleanDataString = (data: string | undefined) => {
    if (!data) return "N/A"
    
    try {
      // Remove common JSON artifacts and clean the string
      let cleaned = data
        .replace(/[{}"']/g, '') // Remove JSON brackets and quotes
        .replace(/\\/g, '') // Remove escape characters
        .replace(/:\s*/g, ': ') // Normalize spacing around colons
        .replace(/,\s*/g, ', ') // Normalize spacing around commas
        .trim()
      
      // If it looks like key-value pairs, extract just the values
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

  // Function to extract and format cost impact
  const extractCostImpact = (costSavings?: string) => {
    if (!costSavings) return "N/A"
    
    // First try to extract dollar amounts
    const dollarMatches = costSavings.match(/\$[\d.,]+[BMKk]?/g)
    if (dollarMatches && dollarMatches.length > 0) {
      return dollarMatches[0]
    }
    
    // Try to extract percentage
    const percentMatch = costSavings.match(/(\d+(?:\.\d+)?)%/)
    if (percentMatch) {
      return `${percentMatch[1]}%`
    }
    
    // Try to extract other numeric values with units
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
    
    // Clean and return the original string
    return cleanDataString(costSavings)
  }

  // Function to get skills at risk count for jobs affected
  const getSkillsAtRiskCount = () => {
    return article.insights.skillsReplaced?.length || 0
  }

  // Clean array data (sectors, geographic spread, etc.)
  const cleanArrayData = (arr: string[]) => {
    return arr.map(item => cleanDataString(item)).filter(item => item !== "N/A")
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Article Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-slate-200/60 dark:border-slate-700/60 shadow-lg">
        <div className="relative z-10 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-4 flex-1">
              {/* Enhanced Tags Section */}
              <div className="flex items-center gap-3 flex-wrap">
                <Badge 
                  variant="outline" 
                  className="px-4 py-2 text-sm font-semibold bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  {article.category}
                </Badge>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold shadow-sm ${getTrendColor(article.insights.trend)}`}>
                  {getTrendIcon(article.insights.trend)}
                  <span className="text-sm capitalize">{article.insights.trend} Impact</span>
                </div>
              </div>
              
              {/* Article Title */}
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100 pr-4">
                {article.title}
              </h1>
              
              {/* Enhanced Metadata Section */}
              <div className="flex items-center gap-6 text-slate-700 dark:text-slate-300 flex-wrap">
                <div className="flex items-center gap-3 bg-white/60 dark:bg-slate-800/60 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50">
                  <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                  <span className="font-semibold text-sm">{article.source}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/60 dark:bg-slate-800/60 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50">
                  <CalendarDays className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <span className="font-medium text-sm">{new Date(article.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
              
              {/* Enhanced URL Display */}
              <div className="bg-slate-100/80 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Source Article:</p>
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline break-all transition-colors"
                    >
                      {article.url}
                    </a>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/80 dark:bg-slate-700/80 border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0" 
                    asChild
                  >
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Background Decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-200/30 dark:from-blue-400/20 via-purple-200/20 dark:via-purple-400/10 to-transparent rounded-full -translate-y-40 translate-x-40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-200/20 dark:from-emerald-400/10 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/70 dark:to-blue-900/70 border border-blue-200/50 dark:border-blue-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div className="text-right">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Skills at Risk</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {getSkillsAtRiskCount()}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Skills affected
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/70 dark:to-purple-900/70 border border-purple-200/50 dark:border-purple-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Building className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <div className="text-right">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Organizations</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {formatNumber(article.insights.companiesInvolved)}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Organizations studied
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/70 dark:to-emerald-900/70 border border-emerald-200/50 dark:border-emerald-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Globe className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              <div className="text-right">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Geographic Reach</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                  {article.insights.geographicSpread.length}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Regions affected
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/70 dark:to-orange-900/70 border border-orange-200/50 dark:border-orange-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              <div className="text-right">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  {article.insights.costSavings ? "Cost Impact" : "Job Creation Ratio"}
                </p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 break-words">
                  {article.insights.costSavings ? extractCostImpact(article.insights.costSavings) : `${article.insights.jobCreationRatio || 0}:1`}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {article.insights.costSavings ? "Investment/Savings" : "New jobs per eliminated"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Section */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Summary */}
          <Card className="border-0 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {cleanDataString(article.summary)}
              </p>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card className="border-0 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {cleanDataString(article.fullContent).split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed text-sm text-slate-700 dark:text-slate-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Geographic Impact */}
          <Card className="border-0 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Geographic Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {cleanArrayData(article.insights.geographicSpread).map((region, index) => (
                  <div key={region} className="flex items-center gap-3 p-3 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{region}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Sectors Impact */}
          <Card className="border-0 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Sectors Impacted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {cleanArrayData(article.insights.sectors).map((sector, index) => (
                  <div key={sector} className="flex items-center gap-2 px-4 py-2 bg-blue-50/80 dark:bg-blue-950/50 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{sector}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Analysis Sidebar */}
        <div className="space-y-8">
          {/* Skills Comparison Chart */}
          <Card className="border-0 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Skills Impact Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <canvas ref={skillsComparisonChartRef}></canvas>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Skills Analysis */}
          {(article.insights.skillsReplaced?.length || article.insights.skillsCreated?.length) && (
            <Card className="border-0 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Skills Transformation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {article.insights.skillsReplaced && article.insights.skillsReplaced.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-red-600 dark:text-red-400">Skills at Risk</h3>
                    </div>
                    <div className="space-y-2">
                      {article.insights.skillsReplaced.map((skill, index) => (
                        <div key={`${skill}-${index}`} className="flex items-center gap-2 p-3 bg-red-50/80 dark:bg-red-950/50 rounded-lg border border-red-200/50 dark:border-red-800/50">
                          <span className="text-sm font-medium text-red-700 dark:text-red-300 leading-tight">{cleanDataString(skill)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {article.insights.skillsReplaced?.length && article.insights.skillsCreated?.length && (
                  <div className="flex items-center justify-center py-2">
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  </div>
                )}

                {article.insights.skillsCreated && article.insights.skillsCreated.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <h3 className="text-base font-semibold text-emerald-600 dark:text-emerald-400">Emerging Skills</h3>
                    </div>
                    <div className="space-y-2">
                      {article.insights.skillsCreated.map((skill, index) => (
                        <div key={`${skill}-${index}`} className="flex items-center gap-2 p-3 bg-emerald-50/80 dark:bg-emerald-950/50 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300 leading-tight">{cleanDataString(skill)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Enhanced Timeframe Card */}
          <Card className="border-0 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Implementation Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <CalendarDays className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span className="text-base font-semibold text-slate-700 dark:text-slate-300">
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