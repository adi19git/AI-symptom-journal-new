"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import { saveSymptom } from "@/lib/storage"
import type { Symptom } from "@/lib/types"

export default function AddSymptom() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    type: "",
    intensity: 5,
    duration: "",
    durationUnit: "hours" as "minutes" | "hours" | "days",
    triggers: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSliderChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, intensity: value[0] }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, durationUnit: value as "minutes" | "hours" | "days" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form data
      if (!formData.type) {
        toast({
          title: "Error",
          description: "Please select a symptom type",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Create symptom object
      const now = new Date()
      const symptom: Symptom = {
        id: uuidv4(),
        type: formData.type,
        intensity: formData.intensity,
        date: now.toLocaleString(),
        timestamp: now.getTime(),
        duration: formData.duration,
        durationUnit: formData.durationUnit,
        triggers: formData.triggers,
        notes: formData.notes,
      }

      // Save to storage
      saveSymptom(symptom)

      toast({
        title: "Success",
        description: "Symptom logged successfully",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving symptom:", error)
      toast({
        title: "Error",
        description: "Failed to save symptom. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card className="max-w-2xl mx-auto shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Log New Symptom</CardTitle>
            <CardDescription className="text-purple-100">Track your symptoms to help identify patterns</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-2">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="type">Symptom Type</Label>
                <Select onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select symptom type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pain">Pain</SelectItem>
                    <SelectItem value="Fatigue">Fatigue</SelectItem>
                    <SelectItem value="Headache">Headache</SelectItem>
                    <SelectItem value="Nausea">Nausea</SelectItem>
                    <SelectItem value="Dizziness">Dizziness</SelectItem>
                    <SelectItem value="Fever">Fever</SelectItem>
                    <SelectItem value="Cough">Cough</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="intensity">Intensity (1-10)</Label>
                <div className="pt-4 pb-2">
                  <Slider
                    defaultValue={[5]}
                    max={10}
                    step={1}
                    value={[formData.intensity]}
                    onValueChange={handleSliderChange}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration Unit</Label>
                  <RadioGroup
                    defaultValue="hours"
                    className="flex space-x-4"
                    value={formData.durationUnit}
                    onValueChange={handleRadioChange}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="minutes" id="minutes" />
                      <Label htmlFor="minutes">Minutes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hours" id="hours" />
                      <Label htmlFor="hours">Hours</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="days" id="days" />
                      <Label htmlFor="days">Days</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="triggers">Potential Triggers</Label>
                <Input
                  id="triggers"
                  placeholder="e.g., stress, food, weather"
                  value={formData.triggers}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional details about this symptom"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Saving..." : "Save Entry"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

