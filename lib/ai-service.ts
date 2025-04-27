"use client"

import type { Symptom, SymptomSummary, AIInsight } from "./types"
import { v4 as uuidv4 } from "uuid"

// This simulates AI processing but would be connected to a real AI service in production
export async function analyzeSymptoms(query: string, symptoms: Symptom[]): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const lowerQuery = query.toLowerCase()

  // Sample responses based on common queries
  if (lowerQuery.includes("headache") || lowerQuery.includes("head pain")) {
    return `Based on your symptom history, your headaches tend to occur more frequently in the afternoons and are often correlated with reported stress triggers. The average intensity is ${calculateAverageIntensity(symptoms, "Headache").toFixed(1)}/10, which is ${calculateAverageIntensity(symptoms, "Headache") > 5 ? "concerning" : "moderate"}. I recommend discussing this pattern with your healthcare provider.`
  }

  if (lowerQuery.includes("pattern") || lowerQuery.includes("trend")) {
    return `I've analyzed your symptom data and noticed several patterns: 1) Your symptoms tend to worsen toward the end of the work week, 2) There's a correlation between reported stress and symptom intensity, and 3) Your symptoms are generally less severe on weekends, suggesting lifestyle factors may be contributing.`
  }

  if (lowerQuery.includes("trigger") || lowerQuery.includes("cause")) {
    return `The most common triggers in your symptom logs are: stress (mentioned 7 times), lack of sleep (5 times), and caffeine (3 times). Have you considered keeping a food and activity journal alongside your symptom tracking to identify additional potential triggers?`
  }

  if (lowerQuery.includes("improve") || lowerQuery.includes("better") || lowerQuery.includes("help")) {
    return `Based on your data, your symptoms tend to improve with: 1) Consistent sleep schedules, 2) Stress management techniques, and 3) Staying hydrated. You might want to try implementing a regular relaxation practice before bedtime, as your symptoms are often worse following nights of poor sleep.`
  }

  // Default response
  return `I've analyzed your symptom history and noticed that you've logged ${symptoms.length} symptoms over time. The most frequent type is ${getMostFrequentSymptom(symptoms)}, with an average intensity of ${calculateOverallAverageIntensity(symptoms).toFixed(1)}/10. Is there a specific aspect of your symptoms you'd like me to analyze further?`
}

export function generateAIInsights(symptoms: Symptom[]): AIInsight[] {
  if (symptoms.length === 0) {
    return [
      {
        id: uuidv4(),
        title: "No Data Yet",
        description: "Start logging your symptoms to receive AI insights.",
        type: "pattern",
      },
    ]
  }

  // Generate real insights based on actual symptom data
  const insights: AIInsight[] = []

  // Pattern detection
  const symptomTypes = symptoms.map((s) => s.type)
  const uniqueTypes = Array.from(new Set(symptomTypes))

  if (uniqueTypes.length > 0) {
    const mostFrequent = getMostFrequentSymptom(symptoms)
    insights.push({
      id: uuidv4(),
      title: `${mostFrequent} Pattern`,
      description: `Your ${mostFrequent.toLowerCase()} symptoms tend to occur most frequently on ${getMostFrequentDay(symptoms)} and are often preceded by ${getMostCommonTrigger(symptoms)}.`,
      type: "pattern",
    })
  }

  // Intensity analysis
  const avgIntensity = calculateOverallAverageIntensity(symptoms)
  if (avgIntensity > 6) {
    insights.push({
      id: uuidv4(),
      title: "High Intensity Warning",
      description: `Your symptoms have an average intensity of ${avgIntensity.toFixed(1)}/10, which is concerning. Consider consulting a healthcare provider.`,
      type: "warning",
    })
  } else {
    insights.push({
      id: uuidv4(),
      title: "Intensity Trend",
      description: `Your symptom intensity has ${getIntensityTrend(symptoms)} over the past week, averaging ${avgIntensity.toFixed(1)}/10.`,
      type: "improvement",
    })
  }

  // Trigger correlation
  insights.push({
    id: uuidv4(),
    title: "Trigger Correlation",
    description: `${getMostCommonTrigger(symptoms)} appears in ${getPercentageWithTrigger(symptoms, getMostCommonTrigger(symptoms))}% of your symptom logs, suggesting a potential correlation.`,
    type: "correlation",
  })

  return insights
}

// Helper functions for AI analysis
function getMostFrequentSymptom(symptoms: Symptom[]): string {
  if (symptoms.length === 0) return "None"

  const typeCounts = symptoms.reduce(
    (acc, symptom) => {
      acc[symptom.type] = (acc[symptom.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0]
}

function calculateAverageIntensity(symptoms: Symptom[], type: string): number {
  const typeSymptoms = symptoms.filter((s) => s.type === type)
  if (typeSymptoms.length === 0) return 0

  return typeSymptoms.reduce((sum, s) => sum + s.intensity, 0) / typeSymptoms.length
}

function calculateOverallAverageIntensity(symptoms: Symptom[]): number {
  if (symptoms.length === 0) return 0
  return symptoms.reduce((sum, s) => sum + s.intensity, 0) / symptoms.length
}

function getMostFrequentDay(symptoms: Symptom[]): string {
  if (symptoms.length === 0) return "N/A"

  const dayCount = symptoms.reduce(
    (acc, symptom) => {
      const day = new Date(symptom.timestamp).toLocaleDateString("en-US", { weekday: "long" })
      acc[day] = (acc[day] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0][0]
}

function getMostCommonTrigger(symptoms: Symptom[]): string {
  const allTriggers = symptoms.flatMap((s) => s.triggers.split(",").map((t) => t.trim())).filter((t) => t.length > 0)

  if (allTriggers.length === 0) return "unknown factors"

  const triggerCount = allTriggers.reduce(
    (acc, trigger) => {
      acc[trigger] = (acc[trigger] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(triggerCount).sort((a, b) => b[1] - a[1])[0][0]
}

function getPercentageWithTrigger(symptoms: Symptom[], trigger: string): number {
  if (symptoms.length === 0 || !trigger) return 0

  const symptomsWithTrigger = symptoms.filter((s) => s.triggers.toLowerCase().includes(trigger.toLowerCase()))

  return Math.round((symptomsWithTrigger.length / symptoms.length) * 100)
}

function getIntensityTrend(symptoms: Symptom[]): string {
  if (symptoms.length < 3) return "been stable"

  // Sort by date
  const sortedSymptoms = [...symptoms].sort((a, b) => a.timestamp - b.timestamp)

  // Calculate average of first half vs second half
  const halfIndex = Math.floor(sortedSymptoms.length / 2)
  const firstHalf = sortedSymptoms.slice(0, halfIndex)
  const secondHalf = sortedSymptoms.slice(halfIndex)

  const firstAvg = firstHalf.reduce((sum, s) => sum + s.intensity, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, s) => sum + s.intensity, 0) / secondHalf.length

  const difference = secondAvg - firstAvg

  if (difference <= -0.5) return "decreased"
  if (difference >= 0.5) return "increased"
  return "remained stable"
}

export function calculateSymptomSummary(symptoms: Symptom[]): SymptomSummary {
  if (symptoms.length === 0) {
    return {
      total: 0,
      avgIntensity: 0,
      prevAvgIntensity: 0,
      mostCommon: "None",
      mostCommonCount: 0,
      symptomFreeDays: 0,
      prevSymptomFreeDays: 0,
    }
  }

  // Calculate total symptoms in last 7 days
  const now = Date.now()
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000
  const twoWeeksAgo = oneWeekAgo - 7 * 24 * 60 * 60 * 1000

  const lastWeekSymptoms = symptoms.filter((s) => s.timestamp >= oneWeekAgo && s.timestamp <= now)
  const prevWeekSymptoms = symptoms.filter((s) => s.timestamp >= twoWeeksAgo && s.timestamp < oneWeekAgo)

  // Calculate average intensity
  const avgIntensity =
    lastWeekSymptoms.length > 0
      ? lastWeekSymptoms.reduce((sum, s) => sum + s.intensity, 0) / lastWeekSymptoms.length
      : 0

  const prevAvgIntensity =
    prevWeekSymptoms.length > 0
      ? prevWeekSymptoms.reduce((sum, s) => sum + s.intensity, 0) / prevWeekSymptoms.length
      : 0

  // Find most common symptom
  const typeCounts = lastWeekSymptoms.reduce(
    (acc, symptom) => {
      acc[symptom.type] = (acc[symptom.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  let mostCommon = "None"
  let mostCommonCount = 0

  if (Object.keys(typeCounts).length > 0) {
    const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])
    mostCommon = sorted[0][0]
    mostCommonCount = sorted[0][1]
  }

  // Calculate symptom-free days
  const lastWeekDays = new Set()
  const prevWeekDays = new Set()

  for (let i = 0; i < 7; i++) {
    const day = new Date(now - i * 24 * 60 * 60 * 1000).toLocaleDateString()
    lastWeekDays.add(day)

    const prevDay = new Date(oneWeekAgo - i * 24 * 60 * 60 * 1000).toLocaleDateString()
    prevWeekDays.add(prevDay)
  }

  const daysWithSymptoms = new Set(lastWeekSymptoms.map((s) => new Date(s.timestamp).toLocaleDateString()))

  const prevDaysWithSymptoms = new Set(prevWeekSymptoms.map((s) => new Date(s.timestamp).toLocaleDateString()))

  const symptomFreeDays = 7 - Math.min(7, daysWithSymptoms.size)
  const prevSymptomFreeDays = 7 - Math.min(7, prevDaysWithSymptoms.size)

  return {
    total: lastWeekSymptoms.length,
    avgIntensity,
    prevAvgIntensity,
    mostCommon,
    mostCommonCount,
    symptomFreeDays,
    prevSymptomFreeDays,
  }
}

