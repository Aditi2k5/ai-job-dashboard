import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, ExternalLink, TrendingDown, TrendingUp, Users, Briefcase, Loader2, Building, Globe, FileText, BarChart3, Settings } from "lucide-react"
import { useState, useEffect } from "react"

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

export default function ArticleAnalysis() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/articles')
      
      if (!response.ok) {
        throw new Error('Failed to fetch articles')
      }
      
      const data = await response.json()
      setArticles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching articles:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`
    }
    return num.toLocaleString()
  }

  // Improved function to clean up JSON-like strings and extract readable values
  const cleanDisplayText = (text?: string) => {
    if (!text) return "N/A"
    
    // Remove JSON-like brackets and quotes
    let cleaned = text.replace(/[{}"']/g, '').trim()
    
    // If it contains colons, try to extract meaningful values
    if (cleaned.includes(':')) {
      const parts = cleaned.split(',').map(part => part.trim())
      const meaningfulParts = parts
        .filter(part => !part.includes(':') || part.split(':')[1]?.trim())
        .map(part => {
          if (part.includes(':')) {
            const [key, value] = part.split(':')
            return value?.trim() || part
          }
          return part
        })
        .filter(part => part && part !== 'null' && part !== 'undefined')
      
      return meaningfulParts.length > 0 ? meaningfulParts[0] : cleaned
    }
    
    return cleaned || "N/A"
  }

  const extractNumericAmount = (costSavings?: string) => {
    if (!costSavings) return "N/A"
    
    // Clean the string first
    const cleaned = cleanDisplayText(costSavings)
    
    // Extract numeric values with common currency symbols and units
    const match = cleaned.match(/[\$€£¥]?(\d+(?:\.\d+)?)\s*([kmb]illion|[kmb]|million|thousand)?/i)
    if (match) {
      const [, amount, unit] = match
      const numAmount = parseFloat(amount)
      
      if (!unit) return `$${numAmount}`
      
      const unitLower = unit.toLowerCase()
      if (unitLower.includes('b') || unitLower.includes('billion')) {
        return `$${numAmount}B`
      } else if (unitLower.includes('m') || unitLower.includes('million')) {
        return `$${numAmount}M`
      } else if (unitLower.includes('k') || unitLower.includes('thousand')) {
        return `$${numAmount}K`
      }
      
      return `$${numAmount}`
    }
    
    return cleaned
  }

  const getSkillsAtRiskCount = (article: Article) => {
    return article.insights.skillsReplaced?.length || 0
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "positive": return "text-emerald-700 bg-emerald-100 border-emerald-300 dark:text-emerald-300 dark:bg-emerald-900/50 dark:border-emerald-600"
      case "negative": return "text-red-700 bg-red-100 border-red-300 dark:text-red-300 dark:bg-red-900/50 dark:border-red-600"
      default: return "text-blue-700 bg-blue-100 border-blue-300 dark:text-blue-300 dark:bg-blue-900/50 dark:border-blue-600"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "positive": return <TrendingUp className="h-4 w-4" />
      case "negative": return <TrendingDown className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  const totalJobsAffected = articles.reduce((sum, article) => sum + getSkillsAtRiskCount(article), 0)
  const totalCompanies = articles.reduce((sum, article) => sum + article.insights.companiesInvolved, 0)
  const uniqueCategories = new Set(articles.map(a => a.category)).size
  const uniqueRegions = new Set(articles.flatMap(a => a.insights.geographicSpread)).size

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">Loading articles...</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Analyzing AI impact data</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Error loading articles</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{error}</p>
          <Button onClick={fetchArticles} className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section with Tabs */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200/50 dark:border-slate-700/50">
        <div className="relative z-10 p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              AI Impact Analysis Dashboard
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Comprehensive analysis of AI's impact on jobs and industries
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-1 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-600"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Quick Links to Original Articles */}
          {articles.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Quick access to source articles:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {articles.slice(0, 3).map((article) => (
                  <Button
                    key={article.id}
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-sm"
                  >
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate max-w-32">{article.source}</span>
                    </a>
                  </Button>
                ))}
                {articles.length > 3 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-sm text-slate-600 dark:text-slate-400"
                  >
                    +{articles.length - 3} more
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-200/20 dark:from-blue-400/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border border-blue-200/50 dark:border-blue-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div className="text-right">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Articles Analyzed</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{articles.length}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Across {uniqueCategories} categories
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border border-purple-200/50 dark:border-purple-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <div className="text-right">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Skills at Risk</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {formatNumber(totalJobsAffected)}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Total skills affected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 border border-emerald-200/50 dark:border-emerald-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Building className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              <div className="text-right">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Organizations</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                  {formatNumber(totalCompanies)}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Organizations analyzed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border border-orange-200/50 dark:border-orange-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Globe className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              <div className="text-right">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Global Reach</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{uniqueRegions}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Regions covered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Articles List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Recent Analysis</h2>
        
        {articles.map((article) => (
          <Card key={article.id} className="border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="px-3 py-1 text-sm font-medium border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {article.category}
                    </Badge>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getTrendColor(article.insights.trend)}`}>
                      {getTrendIcon(article.insights.trend)}
                      <span className="capitalize">{article.insights.trend}</span>
                    </div>
                  </div>
                  
                  {/* Enhanced Article Title */}
                  <div className="group">
                    <CardTitle className="text-xl leading-tight text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline decoration-2 underline-offset-2 flex items-start gap-2"
                      >
                        <span className="flex-1">{article.title}</span>
                        <ExternalLink className="h-4 w-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                      </a>
                    </CardTitle>
                  </div>
                  
                  {/* Improved source and date visibility */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{article.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{new Date(article.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-4 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300" asChild>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{article.summary}</p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">Impact Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Skills at Risk</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {formatNumber(getSkillsAtRiskCount(article))}
                      </p>
                    </div>
                    <div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Companies</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {formatNumber(article.insights.companiesInvolved)}
                      </p>
                    </div>
                    <div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-lg p-4 col-span-2 border border-slate-200/50 dark:border-slate-700/50">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Timeframe</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {cleanDisplayText(article.insights.timeframe)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">Sectors Impacted</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.insights.sectors.map((sector, index) => (
                      <div key={sector} className="flex items-center gap-2 px-3 py-2 bg-blue-50/80 dark:bg-blue-950/50 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{cleanDisplayText(sector)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {(article.insights.skillsReplaced?.length || article.insights.skillsCreated?.length) && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">Skills Transformation</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {article.insights.skillsReplaced && article.insights.skillsReplaced.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <h5 className="font-medium text-red-600 dark:text-red-400">Skills at Risk</h5>
                        </div>
                        <div className="space-y-2">
                          {article.insights.skillsReplaced.slice(0, 3).map((skill, index) => (
                            <div key={skill} className="px-3 py-2 bg-red-50/80 dark:bg-red-950/50 rounded-lg border border-red-200/50 dark:border-red-800/50">
                              <span className="text-sm font-medium text-red-700 dark:text-red-300">{cleanDisplayText(skill)}</span>
                            </div>
                          ))}
                          {article.insights.skillsReplaced.length > 3 && (
                            <div className="px-3 py-2 bg-red-50/80 dark:bg-red-950/50 rounded-lg border border-red-200/50 dark:border-red-800/50">
                              <span className="text-sm text-red-600 dark:text-red-400">
                                +{article.insights.skillsReplaced.length - 3} more skills
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {article.insights.skillsCreated && article.insights.skillsCreated.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                          <h5 className="font-medium text-emerald-600 dark:text-emerald-400">Emerging Skills</h5>
                        </div>
                        <div className="space-y-2">
                          {article.insights.skillsCreated.slice(0, 3).map((skill, index) => (
                            <div key={skill} className="px-3 py-2 bg-emerald-50/80 dark:bg-emerald-950/50 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{cleanDisplayText(skill)}</span>
                            </div>
                          ))}
                          {article.insights.skillsCreated.length > 3 && (
                            <div className="px-3 py-2 bg-emerald-50/80 dark:bg-emerald-950/50 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
                              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                                +{article.insights.skillsCreated.length - 3} more skills
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {article.insights.geographicSpread && article.insights.geographicSpread.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">Geographic Impact</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.insights.geographicSpread.slice(0, 6).map((region, index) => (
                      <div key={region} className="flex items-center gap-2 px-3 py-2 bg-slate-50/80 dark:bg-slate-800/80 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        <Globe className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cleanDisplayText(region)}</span>
                      </div>
                    ))}
                    {article.insights.geographicSpread.length > 6 && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-100/80 dark:bg-slate-700/80 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          +{article.insights.geographicSpread.length - 6} more regions
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {articles.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200/50 dark:border-slate-700/50">
            <Briefcase className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No Articles Found</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            There are currently no articles available for analysis.
          </p>
          <Button onClick={fetchArticles} variant="outline" className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800">
            Refresh Data
          </Button>
        </div>
      )}
    </div>
  )
}