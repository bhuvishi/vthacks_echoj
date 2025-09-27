"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, Calendar, Heart, Sparkles } from "lucide-react"

interface GrowthTrackerProps {
  onBack: () => void
}

export function GrowthTracker({ onBack }: GrowthTrackerProps) {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "3months" | "year">("month")

  const spiritData = [
    { date: "2024-01-01", day: "Mon", spirit: 6, label: "Hopeful", emoji: "🌱" },
    { date: "2024-01-02", day: "Tue", spirit: 8, label: "Uplifted", emoji: "✨" },
    { date: "2024-01-03", day: "Wed", spirit: 4, label: "Contemplative", emoji: "🤔" },
    { date: "2024-01-04", day: "Thu", spirit: 9, label: "Radiant", emoji: "🌟" },
    { date: "2024-01-05", day: "Fri", spirit: 7, label: "Peaceful", emoji: "🕊️" },
    { date: "2024-01-06", day: "Sat", spirit: 5, label: "Grounded", emoji: "🌿" },
    { date: "2024-01-07", day: "Sun", spirit: 8, label: "Inspired", emoji: "🦋" },
  ]

  const insights = [
    {
      title: "Your most reflective times",
      description: "You tend to journal most between 7-9 PM",
      icon: Calendar,
      color: "from-blue-400/20 to-indigo-400/20",
    },
    {
      title: "Words that define your journey",
      description: "Growth, gratitude, and peace appear most often",
      icon: Heart,
      color: "from-pink-400/20 to-rose-400/20",
    },
    {
      title: "Growth themes",
      description: "Self-compassion and mindfulness are trending",
      icon: TrendingUp,
      color: "from-teal-400/20 to-green-400/20",
    },
  ]

  const timeCapsules = [
    {
      date: "1 year ago",
      prompt: "What does success mean to you?",
      oldResponse: "Success means achieving all my goals and being recognized for my work...",
      theme: "Achievement-focused",
    },
    {
      date: "6 months ago",
      prompt: "What brings you peace?",
      oldResponse: "I find peace in quiet moments, usually when I'm reading or walking...",
      theme: "Finding balance",
    },
  ]

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-slate-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-2xl font-bold text-slate-100">Growth Tracker</h1>
        </div>

        {/* Mood Timeline */}
        <Card className="p-6 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-100 font-mono">Spirit Timeline</h2>
              <div className="flex space-x-2">
                {(["week", "month", "3months", "year"] as const).map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className={timeRange === range ? "glass-button text-teal-100" : "text-slate-400 hover:text-slate-200"}
                  >
                    {range === "3months" ? "3M" : range.charAt(0).toUpperCase() + range.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Spirit Timeline Chart */}
            <div className="h-80 bg-gradient-to-br from-teal-400/5 to-purple-400/5 rounded-xl p-6 border border-slate-600/30">
              <div className="h-full flex flex-col">
                {/* Y-axis labels */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col justify-between h-48 text-xs font-mono text-slate-400">
                    <span>Uplifted</span>
                    <span>Elevated</span>
                    <span>Balanced</span>
                    <span>Grounded</span>
                    <span>Down</span>
                  </div>

                  {/* Chart area */}
                  <div className="flex-1 h-48 ml-4 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-full border-t border-slate-600/30"
                          style={{ top: `${i * 25}%` }}
                        />
                      ))}
                    </div>

                    {/* Spirit line chart */}
                    <div className="absolute inset-0 flex items-end justify-between px-2">
                      {spiritData.map((day, index) => (
                        <div key={index} className="flex flex-col items-center space-y-2 group cursor-pointer">
                          {/* Data point */}
                          <div className="relative">
                            <div
                              className="w-3 h-3 bg-gradient-to-r from-teal-400 to-purple-400 rounded-full shadow-lg transition-all duration-300 group-hover:scale-150 group-hover:shadow-xl"
                              style={{
                                marginBottom: `${((day.spirit - 1) / 9) * 180}px`,
                              }}
                            />

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                              <div className="bg-black/80 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap font-mono">
                                <div className="flex items-center space-x-2">
                                  <span>{day.emoji}</span>
                                  <span>{day.label}</span>
                                </div>
                                <div className="text-center text-xs opacity-75">{day.day}</div>
                              </div>
                            </div>
                          </div>

                          {/* Day label */}
                          <span className="text-xs text-slate-400 font-mono">{day.day}</span>
                        </div>
                      ))}
                    </div>

                    {/* Connecting line */}
                    <svg className="absolute inset-0 pointer-events-none">
                      <defs>
                        <linearGradient id="spiritGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgb(45, 212, 191)" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>
                      <polyline
                        fill="none"
                        stroke="url(#spiritGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={spiritData
                          .map((day, index) => {
                            const x = (index / (spiritData.length - 1)) * 100
                            const y = 100 - ((day.spirit - 1) / 9) * 100
                            return `${x}%,${y}%`
                          })
                          .join(" ")}
                        className="drop-shadow-sm"
                      />
                    </svg>
                  </div>
                </div>

                {/* X-axis label */}
                <div className="text-center">
                  <span className="text-sm font-mono text-slate-400">Time →</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <Card
              key={index}
              className={`p-6 bg-gradient-to-br opacity-100 shadow-xl bg-chart-3 text-muted rounded-xl ${insight.color} border backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-secondary-foreground`}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary-foreground">
                  <insight.icon className="w-6 h-6 text-slate-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-2">{insight.title}</h3>
                  <p className="text-sm text-slate-300">{insight.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Time Capsule Section */}
        <Card className="p-6 bg-gradient-to-br from-teal-400/10 to-purple-400/10 border border-teal-400/20 backdrop-blur-sm bg-chart-3">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400/30 to-purple-400/30 rounded-full flex items-center justify-center border border-teal-400/30">
                <Sparkles className="w-6 h-6 text-teal-200" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-100">Time Capsule</h2>
                <p className="text-slate-300">See how your perspective has evolved</p>
              </div>
            </div>

            <div className="space-y-6">
              {timeCapsules.map((capsule, index) => (
                <Card key={index} className="p-6 border border-slate-700/50 backdrop-blur-sm bg-secondary-foreground text-foreground">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-teal-300 font-medium">{capsule.date}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-chart-3 text-secondary">
                        {capsule.theme}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-slate-200">"{capsule.prompt}"</h4>
                      <p className="text-slate-300 italic">"{capsule.oldResponse}"</p>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-teal-400/30 text-teal-300 hover:bg-teal-400/10 bg-transparent"
                    >
                      Reflect on this
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
