import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Activity, Calendar, ChevronRight, LineChart, MessageSquare, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-500/10 z-0"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors">
              AI-Powered Health Tracking
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Symptom Journal
            </h1>
            <p className="text-xl text-slate-700 mb-8">
              Track, analyze, and understand your chronic health conditions with the power of artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Insights</h3>
              <p className="text-slate-600">
                Our advanced AI analyzes your symptom patterns to identify triggers and suggest personalized management
                strategies.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visual Tracking</h3>
              <p className="text-slate-600">
                Interactive charts and timelines help you visualize symptom patterns over time for better understanding.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="rounded-full w-12 h-12 bg-green-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
              <p className="text-slate-600">
                Chat with our AI health assistant to get personalized advice and answers about your symptoms.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* App Preview */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-12">Comprehensive Health Tracking</h2>
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-1 rounded-xl shadow-xl max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
                <Activity className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Track Symptoms</h3>
                <p className="text-slate-600 text-sm">Log intensity, duration, and triggers for each symptom</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
                <Calendar className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Monitor Patterns</h3>
                <p className="text-slate-600 text-sm">Identify trends and correlations in your health data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Section */}
      <div className="container mx-auto px-4 py-12 mb-8">
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-xl font-bold">Verification Details</h3>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Names</p>
                  <p className="font-medium">Aditya Kumar, Mohit Lal</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Registration Numbers</p>
                  <p className="font-medium">12413688 and 12403942</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-500">Section</p>
                  <p className="font-medium">K23LE</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2025 Symptom Journal. All rights reserved.</p>
          <p className="text-sm text-purple-100">Designed and developed with care for chronic condition management.</p>
        </div>
      </footer>
    </div>
  )
}

