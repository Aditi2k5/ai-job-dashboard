"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ArticleDetail from "@/components/article-detail"
import { Loader2, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {LayoutWrapper} from "@/components/layout-wrapper"

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

export default function ArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string)
    }
  }, [params.id])

  const fetchArticle = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/articles/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Article not found')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setArticle(data)
    } catch (err) {
      console.error('Error fetching article:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch article')
    } finally {
      setLoading(false)
    }
  }

  const LoadingState = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md border-0 shadow-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
              <div className="absolute inset-0 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 animate-pulse opacity-20"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Loading Article
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Please wait while we fetch the article details...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const ErrorState = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-lg border-0 shadow-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="absolute inset-0 w-16 h-16 bg-red-500/10 rounded-full animate-ping"></div>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">
                {error === 'Article not found' ? 'Article Not Found' : 'Something Went Wrong'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                {error === 'Article not found' 
                  ? 'The article you are looking for does not exist or may have been removed.'
                  : `We encountered an error while loading the article: ${error}`
                }
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <Button 
                onClick={() => fetchArticle(params.id as string)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Try Again
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const NotFoundState = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-lg border-0 shadow-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-slate-500 dark:text-slate-400" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Article Not Available
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                The article you requested could not be found. It may have been moved or deleted.
              </p>
            </div>
            
            <Button variant="outline" asChild className="w-full max-w-xs">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const ArticleContent = () => (
    <div className="space-y-6">
      {/* Enhanced Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 -mx-6 px-6 py-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            asChild 
            className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <span>Article</span>
              <span>•</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchArticle(params.id as string)}
              disabled={loading}
              className="bg-white/80 dark:bg-slate-800/80"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Article Detail Component */}
      {article && <ArticleDetail article={article} />}
    </div>
  )

  const content = () => {
    if (loading) return <LoadingState />
    if (error) return <ErrorState />
    if (!article) return <NotFoundState />
    return <ArticleContent />
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {content()}
        </div>
      </div>
    </LayoutWrapper>
  )
}