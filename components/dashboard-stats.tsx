import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Calendar, TrendingDown, TrendingUp } from "lucide-react"
import type { SymptomSummary } from "@/lib/types"

interface DashboardStatsProps {
  data: SymptomSummary
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const intensityDiff = data.avgIntensity - data.prevAvgIntensity
  const symptomFreeDiff = data.symptomFreeDays - data.prevSymptomFreeDays

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardDescription>
            <div className="flex items-center text-purple-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span>This Week</span>
            </div>
          </CardDescription>
          <CardTitle className="text-2xl">{data.total}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">Total symptoms logged</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardDescription>
            <div className="flex items-center text-blue-600">
              <Activity className="h-4 w-4 mr-1" />
              <span>Average Intensity</span>
            </div>
          </CardDescription>
          <CardTitle className="text-2xl">{data.avgIntensity.toFixed(1)}</CardTitle>
        </CardHeader>
        <CardContent>
          {intensityDiff !== 0 && (
            <div className={`flex items-center text-sm ${intensityDiff > 0 ? "text-red-500" : "text-green-500"}`}>
              {intensityDiff > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span>{Math.abs(intensityDiff).toFixed(1)} from last week</span>
            </div>
          )}
          {intensityDiff === 0 && (
            <div className="text-sm text-slate-500">
              <span>Same as last week</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardDescription>
            <div className="flex items-center text-emerald-600">
              <Activity className="h-4 w-4 mr-1" />
              <span>Most Common</span>
            </div>
          </CardDescription>
          <CardTitle className="text-2xl">{data.mostCommon}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            {data.mostCommonCount > 0
              ? `${data.mostCommonCount} occurrences this week`
              : "No symptoms logged this week"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardDescription>
            <div className="flex items-center text-amber-600">
              <Activity className="h-4 w-4 mr-1" />
              <span>Symptom-Free Days</span>
            </div>
          </CardDescription>
          <CardTitle className="text-2xl">{data.symptomFreeDays}</CardTitle>
        </CardHeader>
        <CardContent>
          {symptomFreeDiff !== 0 && (
            <div className={`flex items-center text-sm ${symptomFreeDiff > 0 ? "text-green-500" : "text-red-500"}`}>
              {symptomFreeDiff > 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{Math.abs(symptomFreeDiff)} from last week</span>
            </div>
          )}
          {symptomFreeDiff === 0 && (
            <div className="text-sm text-slate-500">
              <span>Same as last week</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

