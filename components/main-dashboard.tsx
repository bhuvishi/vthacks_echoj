"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Sun,
  Moon,
  Sparkles,
  PenTool,
  MessageSquare,
  Smile,
  Mic,
  TrendingUp,
  Archive,
  Settings,
  ChevronRight,
} from "lucide-react"

interface MainDashboardProps {
  onNavigate: (screen: "writing" | "growth" | "entries" | "profile") => void
}

export function MainDashboard({ onNavigate }: MainDashboardProps) {
  const [currentTime] = useState(new Date())
  const isEvening = currentTime.getHours() >= 18
  const [selectedFrequency, setSelectedFrequency] = useState<string>("")

  const moodData = [
    { day: "Mon", emoji: "🕊️" },
    { day: "Tue", emoji: "🙏" },
    { day: "Wed", emoji: "⚡" },
    { day: "Thu", emoji: "🌙" },
    { day: "Fri", emoji: "✨" },
    { day: "Sat", emoji: "🌊" },
    { day: "Sun", emoji: "🌟" },
  ]

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              {isEvening ? <Moon className="w-6 h-6 text-indigo-300" /> : <Sun className="w-6 h-6 text-yellow-300" />}
              <h1 className="text-2xl font-bold text-slate-100 font-mono">
                Good {isEvening ? "evening" : "morning"}, Bhuvishi
              </h1>
            </div>
            <p className="text-slate-400 font-mono text-sm">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full shadow-lg">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span className="text-sm font-medium font-mono">7 day streak</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("profile")}
              className="text-slate-300 hover:text-slate-100"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Today's Prompt Card */}
        <Card className="p-8 glass-effect shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-100 mb-2">Today's Reflection</h2>
                <p className="text-sm text-slate-400">Chosen for your reflective mood today</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400/20 to-purple-400/20 rounded-full flex items-center justify-center border border-slate-600/50">
                <Sparkles className="w-6 h-6 text-teal-300" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-400/10 to-purple-400/10 p-6 rounded-xl border border-slate-600/30">
              <p className="text-lg text-slate-200 italic leading-relaxed font-mono">
                "What brought you joy today, and how did it make you feel in the moment? Sometimes the smallest moments
                carry the greatest meaning."
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={() => onNavigate("writing")}
                className="glass-button text-teal-100 transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                <PenTool className="w-4 h-4 mr-2" />
                Write freely
              </Button>

              <Button
                variant="outline"
                onClick={() => onNavigate("writing")}
                className="border-slate-600/50 text-slate-300 hover:bg-slate-700/30 bg-slate-800/20"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Quick thoughts
              </Button>

              <Button
                variant="outline"
                onClick={() => onNavigate("writing")}
                className="border-slate-600/50 text-slate-300 hover:bg-slate-700/30 bg-slate-800/20"
              >
                <Smile className="w-4 h-4 mr-2" />
                Just emojis
              </Button>

              <Button
                variant="outline"
                className="border-slate-600/50 text-slate-300 hover:bg-slate-700/30 bg-slate-800/20"
              >
                <Mic className="w-4 h-4 mr-2" />
                Voice note
              </Button>
            </div>
          </div>
        </Card>

        {/* Journal Frequency Selection */}
        <Card className="p-6 glass-effect shadow-lg">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-100">How often would you like to journal?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["Daily", "Weekly", "Bi-weekly", "Monthly"].map((frequency) => (
                <Button
                  key={frequency}
                  onClick={() => setSelectedFrequency(frequency)}
                  className={`transition-all duration-300 ${
                    selectedFrequency === frequency
                      ? "bg-white text-slate-900 shadow-lg scale-105"
                      : "border-slate-600/50 text-slate-300 hover:bg-slate-700/30 bg-slate-800/20"
                  }`}
                >
                  {frequency}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 glass-effect shadow-lg">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-300 font-mono">This week in emojis</h3>
              <div className="flex justify-between items-center">
                {moodData.map((day, index) => (
                  <div key={day.day} className="flex flex-col items-center space-y-1 group cursor-pointer">
                    <div className="text-2xl group-hover:scale-110 transition-transform duration-200">{day.emoji}</div>
                    <span className="text-xs font-mono text-slate-400">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-4 glass-effect shadow-lg">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-300">This Week's Word</h3>
              <p className="text-2xl font-bold bg-gradient-to-r from-teal-300 to-purple-400 bg-clip-text text-transparent">
                Growth
              </p>
            </div>
          </Card>

          <Card className="p-4 glass-effect shadow-lg">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-300">Next Milestone</h3>
              <div className="space-y-2">
                <p className="text-sm text-slate-400">10 day streak</p>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-teal-400 to-purple-400 h-2 rounded-full w-3/4" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="p-6 glass-effect shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group"
            onClick={() => onNavigate("entries")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full flex items-center justify-center border border-slate-600/50">
                  <Archive className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Browse past entries</h3>
                  <p className="text-sm text-slate-400">Revisit your journey</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-200 transition-colors" />
            </div>
          </Card>

          <Card
            className="p-6 bg-gradient-to-br from-teal-400/10 to-purple-400/10 border border-teal-400/20 shadow-lg backdrop-blur-sm cursor-pointer hover:shadow-xl hover:shadow-teal-400/10 transition-all duration-300 group bg-chart-3 text-foreground"
            onClick={() => onNavigate("growth")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400/30 to-purple-400/30 rounded-full flex items-center justify-center border border-teal-400/30">
                  <TrendingUp className="w-6 h-6 text-teal-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Growth time capsule</h3>
                  <p className="text-sm text-slate-300">See how far you've come</p>
                </div>
              </div>
              <div className="relative">
                <ChevronRight className="w-5 h-5 text-teal-300 group-hover:text-teal-200 transition-colors" />
                <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-md animate-pulse" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
