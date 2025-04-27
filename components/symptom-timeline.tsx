"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { Symptom } from "@/lib/types"

interface SymptomTimelineProps {
  symptoms: Symptom[]
}

export default function SymptomTimeline({ symptoms }: SymptomTimelineProps) {
  const [timeframe, setTimeframe] = useState<"week" | "month">("week")
  const [chartData, setChartData] = useState<any[]>([])
  const [symptomTypes, setSymptomTypes] = useState<string[]>([])

  // Process symptoms data for the chart
  useEffect(() => {
    if (symptoms.length === 0) {
      setChartData([])
      setSymptomTypes([])
      return
    }

    // Get unique symptom types
    const types = Array.from(new Set(symptoms.map((s) => s.type)))
    setSymptomTypes(types)

    // Determine date range
    const now = new Date()
    const startDate =
      timeframe === "week"
        ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Create date map
    const dateMap: Record<string, Record<string, number>> = {}

    // Initialize dates
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      dateMap[dateKey] = {}
      types.forEach((type) => {
        dateMap[dateKey][type] = 0
      })
    }

    // Fill in symptom data
    const filteredSymptoms = symptoms.filter((s) => new Date(s.timestamp) >= startDate)

    filteredSymptoms.forEach((symptom) => {
      const date = new Date(symptom.timestamp)
      const dateKey = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

      if (dateMap[dateKey]) {
        if (!dateMap[dateKey][symptom.type]) {
          dateMap[dateKey][symptom.type] = 0
        }

        // Average intensity if multiple of same type on same day
        const existingCount = dateMap[dateKey][`${symptom.type}Count`] || 0
        const existingTotal = dateMap[dateKey][symptom.type] * existingCount || 0

        dateMap[dateKey][`${symptom.type}Count`] = existingCount + 1
        dateMap[dateKey][symptom.type] = (existingTotal + symptom.intensity) / (existingCount + 1)
      }
    })

    // Convert to chart data
    const data = Object.entries(dateMap).map(([date, values]) => {
      return {
        date,
        ...Object.fromEntries(Object.entries(values).filter(([key]) => !key.endsWith("Count"))),
      }
    })

    setChartData(data)
  }, [symptoms, timeframe])

  // Create chart config
  const chartConfig = symptomTypes.reduce(
    (config, type) => {
      config[type] = {
        label: type,
        color: getColorForSymptomType(type),
      }
      return config
    },
    {} as Record<string, { label: string; color: string }>,
  )

  function getColorForSymptomType(type: string): string {
    const colorMap: Record<string, string> = {
      Headache: "hsl(259, 77%, 64%)",
      Pain: "hsl(0, 84%, 60%)",
      Fatigue: "hsl(201, 96%, 64%)",
      Nausea: "hsl(150, 60%, 54%)",
      Dizziness: "hsl(35, 92%, 65%)",
      Fever: "hsl(340, 82%, 52%)",
      Cough: "hsl(220, 83%, 65%)",
    }

    return colorMap[type] || "hsl(200, 70%, 50%)"
  }

  return (
    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Symptom Timeline</CardTitle>
          <CardDescription>Track your symptoms over time</CardDescription>
        </div>
        <Select defaultValue="week" onValueChange={(value) => setTimeframe(value as "week" | "month")}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={5} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} tickMargin={5} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {symptomTypes.map((type) => (
                    <Line
                      key={type}
                      type="monotone"
                      dataKey={type}
                      stroke={`var(--color-${type})`}
                      strokeWidth={2}
                      dot={{ fill: `var(--color-${type})` }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No symptom data available for this time period
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

