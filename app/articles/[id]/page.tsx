"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ArticleDetail from "@/components/article-detail"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading article...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 mb-4">Error: {error}</p>
            <div className="space-x-2">
              <Button onClick={() => fetchArticle(params.id as string)}>
                Retry
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Article not found</p>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <ArticleDetail article={article} />
    </div>
  )
}