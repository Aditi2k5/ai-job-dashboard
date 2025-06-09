"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { TrendingUp, TrendingDown, Loader2, AlertCircle, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

interface SidebarArticle {
  id: number
  title: string
  date: string
  category: string
  trend: "positive" | "negative" | "neutral"
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const [articles, setArticles] = useState<SidebarArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isMobile } = useSidebar()

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/articles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Transform data for sidebar display - limit to first 12 articles
      const sidebarArticles = data.slice(0, 12).map((article: any) => ({
        id: article.id,
        title: article.title?.replace(/^["']|["']$/g, '') || 'Untitled Article',
        date: new Date(article.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: '2-digit'
        }),
        category: article.category,
        trend: article.insights.trend
      }))
      
      setArticles(sidebarArticles)
    } catch (err) {
      console.error('Error fetching articles for sidebar:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch articles')
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "positive":
        return <TrendingUp className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
      case "negative":
        return <TrendingDown className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
      default:
        return <FileText className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
    }
  }

  return (
    <Sidebar 
      className="w-64 border-r border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
      side="left"
    >
      <SidebarHeader className="border-b border-slate-200/50 dark:border-slate-700/50 px-3 py-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
          <h2 className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Recent Articles
          </h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div className="px-3 py-2 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {articles.length} articles found
          </p>
        </div>

        <SidebarMenu className="p-1">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin text-slate-600 dark:text-slate-400" />
              <span className="ml-2 text-xs text-slate-600 dark:text-slate-400">Loading...</span>
            </div>
          ) : error ? (
            <div className="px-2 py-8 text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-xs text-red-500 mb-2">Failed to load</p>
              <button 
                onClick={fetchArticles}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Retry
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className="px-2 py-8 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400">No articles found</p>
            </div>
          ) : (
            articles.map((article) => (
              <SidebarMenuItem key={article.id}>
                <SidebarMenuButton 
                  asChild 
                  className={`h-auto mb-1 p-2 hover:bg-white/80 hover:dark:bg-slate-800/80 hover:backdrop-blur-sm transition-colors ${
                    pathname === `/articles/${article.id}` 
                      ? 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-l-2 border-blue-500 shadow-sm' 
                      : ''
                  }`}
                >
                  <Link href={`/articles/${article.id}`}>
                    <div className="flex flex-col gap-1.5 w-full min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {article.date}
                        </span>
                        <div className="flex-shrink-0">
                          {getTrendIcon(article.trend)}
                        </div>
                      </div>
                      <h3 className="font-medium text-xs leading-relaxed line-clamp-3 text-left text-slate-900 dark:text-slate-100">
                        {article.title}
                      </h3>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}