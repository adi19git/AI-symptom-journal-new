"use client"

import type { Symptom, AIInsight, AIMessage } from "./types"

// Symptom Storage
export const saveSymptom = (symptom: Symptom): void => {
  const symptoms = getSymptoms()
  symptoms.push(symptom)
  localStorage.setItem("symptoms", JSON.stringify(symptoms))
}

export const getSymptoms = (): Symptom[] => {
  if (typeof window === "undefined") return []
  const symptoms = localStorage.getItem("symptoms")
  return symptoms ? JSON.parse(symptoms) : []
}

export const deleteSymptom = (id: string): void => {
  const symptoms = getSymptoms()
  const updatedSymptoms = symptoms.filter((symptom) => symptom.id !== id)
  localStorage.setItem("symptoms", JSON.stringify(updatedSymptoms))
}

export const updateSymptom = (updatedSymptom: Symptom): void => {
  const symptoms = getSymptoms()
  const updatedSymptoms = symptoms.map((symptom) => (symptom.id === updatedSymptom.id ? updatedSymptom : symptom))
  localStorage.setItem("symptoms", JSON.stringify(updatedSymptoms))
}

// AI Messages Storage
export const saveAIMessage = (message: AIMessage): void => {
  const messages = getAIMessages()
  messages.push(message)
  localStorage.setItem("aiMessages", JSON.stringify(messages))
}

export const getAIMessages = (): AIMessage[] => {
  if (typeof window === "undefined") return []
  const messages = localStorage.getItem("aiMessages")
  return messages ? JSON.parse(messages) : []
}

// AI Insights Storage
export const saveAIInsight = (insight: AIInsight): void => {
  const insights = getAIInsights()
  insights.push(insight)
  localStorage.setItem("aiInsights", JSON.stringify(insights))
}

export const getAIInsights = (): AIInsight[] => {
  if (typeof window === "undefined") return []
  const insights = localStorage.getItem("aiInsights")
  return insights
    ? JSON.parse(insights)
    : [
        {
          id: "1",
          title: "Headache Pattern",
          description:
            "Your headaches tend to increase in intensity on Thursdays and Fridays, possibly related to work stress.",
          type: "pattern",
        },
        {
          id: "2",
          title: "Trigger Correlation",
          description: "Fatigue symptoms appear to worsen 2-3 hours after caffeine consumption.",
          type: "correlation",
        },
        {
          id: "3",
          title: "Improvement Trend",
          description: "Weekend symptoms are consistently less severe than weekday symptoms.",
          type: "improvement",
        },
      ]
}

