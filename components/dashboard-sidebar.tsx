"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Calendar, TrendingUp, TrendingDown, Users, Home, Loader2, AlertCircle } from "lucide-react"
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
  const isHome = pathname === "/"
  const [articles, setArticles] = useState<SidebarArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      
      // Transform data for sidebar display
      const sidebarArticles = data.map((article: any) => ({
        id: article.id,
        title: article.title,
        date: new Date(article.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
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

  return (
    <Sidebar className="w-64 border-r bg-sidebar">
      <SidebarHeader className="border-b px-4 py-4 bg-sidebar">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Future of Jobs</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-0 bg-sidebar">


        <div className="px-4 py-4 border-t">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Article Analysis
          </h3>
        </div>

        <SidebarMenu className="px-2">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="ml-3 text-sm text-muted-foreground">Loading articles...</span>
            </div>
          ) : error ? (
            <div className="px-3 py-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-sm text-red-500 mb-3">Error loading articles</p>
              <button 
                onClick={fetchArticles}
                className="text-sm text-blue-500 hover:text-blue-700 underline"
              >
                Retry
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className="px-3 py-6 text-center">
              <p className="text-sm text-muted-foreground">No articles found</p>
            </div>
          ) : (
            articles.map((article) => (
              <SidebarMenuItem key={article.id}>
                <SidebarMenuButton 
                  asChild 
                  className="h-auto p-3 mb-2"
                  isActive={pathname === `/articles/${article.id}`}
                >
                  <Link href={`/articles/${article.id}`}>
                    <div className="flex flex-col gap-2 w-full min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm leading-relaxed line-clamp-2 text-left">
                            {article.title}
                          </h3>
                        </div>
                        <div className="flex-shrink-0">
                          {article.trend === "positive" && (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          )}
                          {article.trend === "negative" && (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                          {article.trend === "neutral" && (
                            <Users className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{article.date}</span>
                      </div>
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