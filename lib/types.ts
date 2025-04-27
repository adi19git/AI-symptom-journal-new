export type Symptom = {
  id: string
  type: string
  intensity: number
  date: string
  timestamp: number
  duration: string
  durationUnit: "minutes" | "hours" | "days"
  triggers: string
  notes: string
}

export type SymptomSummary = {
  total: number
  avgIntensity: number
  prevAvgIntensity: number
  mostCommon: string
  mostCommonCount: number
  symptomFreeDays: number
  prevSymptomFreeDays: number
}

export type AIInsight = {
  id: string
  title: string
  description: string
  type: "pattern" | "correlation" | "improvement" | "warning"
}

export type AIMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

