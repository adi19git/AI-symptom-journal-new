"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, BookOpen, MessageSquare, Home } from "lucide-react"
import DashboardStats from "@/components/dashboard-stats"
import SymptomTimeline from "@/components/symptom-timeline"
import AIInsights from "@/components/ai-insights"
import RecentSymptoms from "@/components/recent-symptoms"
import AIChat from "@/components/ChatBot"
import { getSymptoms } from "@/lib/storage"
import type { Symptom } from "@/lib/types"
import { calculateSymptomSummary } from "@/lib/ai-service"

export default function Dashboard() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [activeTab, setActiveTab] = useState("dashboard")
  const [summaryData, setSummaryData] = useState({
    total: 0,
    avgIntensity: 0,
    prevAvgIntensity: 0,
    mostCommon: "",
    mostCommonCount: 0,
    symptomFreeDays: 0,
    prevSymptomFreeDays: 0,
  })

  useEffect(() => {
    // Load symptoms from storage
    const loadedSymptoms = getSymptoms()
    setSymptoms(loadedSymptoms)

    // Calculate summary data
    setSummaryData(calculateSymptomSummary(loadedSymptoms))

    // Set up a refresh interval to check for new data
    const interval = setInterval(() => {
      const refreshedSymptoms = getSymptoms()
      if (JSON.stringify(refreshedSymptoms) !== JSON.stringify(symptoms)) {
        setSymptoms(refreshedSymptoms)
        setSummaryData(calculateSymptomSummary(refreshedSymptoms))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Symptom Journal
              </h1>
              <p className="text-slate-600 mt-1">AI-powered health tracking for chronic conditions</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/add-symptom">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Log Symptom
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 h-auto p-1 bg-muted/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-white rounded-md py-2 px-4">
              <BookOpen className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="assistant" className="data-[state=active]:bg-white rounded-md py-2 px-4">
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 mt-6">
            <DashboardStats data={summaryData} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <SymptomTimeline symptoms={symptoms} />
              </div>
              <div>
                <AIInsights symptoms={symptoms} />
              </div>
            </div>

            <RecentSymptoms symptoms={symptoms} />
          </TabsContent>

          <TabsContent value="assistant" className="mt-6">
            <AIChat symptoms={symptoms} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

