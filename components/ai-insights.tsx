"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Info, AlertTriangle, TrendingUp } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import type { Symptom, AIInsight } from "@/lib/types"
import { generateAIInsights } from "@/lib/ai-service"

interface AIInsightsProps {
  symptoms: Symptom[]
}

export default function AIInsights({ symptoms }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateInsights = async () => {
      setLoading(true)
      try {
        // Add a slight delay to simulate AI processing
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const newInsights = generateAIInsights(symptoms)
        setInsights(newInsights)
      } catch (error) {
        console.error("Error generating insights:", error)
      } finally {
        setLoading(false)
      }
    }

    generateInsights()
  }, [symptoms])

  const getIconForInsightType = (type: string) => {
    switch (type) {
      case "pattern":
        return <Info className="h-4 w-4" />
      case "correlation":
        return <Brain className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "improvement":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500/90 to-blue-500/90 text-white backdrop-blur-sm h-full">
      <CardHeader>
        <div className="flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          <CardTitle>AI Insights</CardTitle>
        </div>
        <CardDescription className="text-purple-100">Patterns detected in your symptoms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="w-full h-16 bg-white/20" />
            <Skeleton className="w-full h-16 bg-white/20" />
            <Skeleton className="w-full h-16 bg-white/20" />
          </>
        ) : (
          insights.map((insight) => (
            <Alert key={insight.id} className="bg-white/20 border-0 text-white">
              {getIconForInsightType(insight.type)}
              <AlertTitle className="font-medium">{insight.title}</AlertTitle>
              <AlertDescription className="text-purple-100">{insight.description}</AlertDescription>
            </Alert>
          ))
        )}

        <div className="text-xs text-purple-100 pt-2">
          Based on your {symptoms.length > 0 ? "symptom data" : "historical patterns"}
        </div>
      </CardContent>
    </Card>
  )
}

