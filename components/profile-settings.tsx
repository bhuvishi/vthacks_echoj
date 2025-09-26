"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Bell, Shield, Palette, Download, Award } from "lucide-react"

interface ProfileSettingsProps {
  onBack: () => void
}

export function ProfileSettings({ onBack }: ProfileSettingsProps) {
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    weeklyInsights: true,
    milestoneAlerts: true,
    smartReminders: false,
  })

  const [privacy, setPrivacy] = useState({
    dataEncryption: true,
    localStorage: true,
    analytics: false,
  })

  const stats = [
    { label: "Total Entries", value: "47", icon: "📝" },
    { label: "Longest Streak", value: "12 days", icon: "🔥" },
    { label: "Favorite Time", value: "7:30 PM", icon: "🌙" },
    { label: "Words Written", value: "12,847", icon: "✍️" },
  ]

  const badges = [
    { name: "First Entry", description: "Completed your first journal entry", earned: true, icon: "🌱" },
    { name: "Week Warrior", description: "7 day writing streak", earned: true, icon: "⚡" },
    { name: "Reflection Master", description: "50 entries completed", earned: false, icon: "🎯" },
    { name: "Growth Seeker", description: "Used time capsule feature", earned: true, icon: "🌟" },
  ]

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-slate-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-2xl font-bold text-slate-100">Profile & Settings</h1>
        </div>

        {/* Profile Stats */}
        <Card className="p-6 bg-gradient-to-br from-teal-400/10 to-purple-400/10 border border-teal-400/20 backdrop-blur-sm text-secondary-foreground bg-chart-3">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400/30 to-purple-400/30 rounded-full flex items-center justify-center text-2xl border border-teal-400/30">
                👤
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-100">Bhuvishi</h2>
                <p className="text-slate-300">Journaling since January 2024</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="text-2xl">{stat.icon}</div>
                  <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
                  <div className="text-sm text-slate-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Achievement Badges */}
        <Card className="p-6 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-slate-100">Achievement Badges</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    badge.earned
                      ? "bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border-yellow-400/30"
                      : "bg-slate-700/30 border-slate-600/50 opacity-60"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <h4 className="font-medium text-slate-100">{badge.name}</h4>
                      <p className="text-sm text-slate-400">{badge.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notifications */}
          <Card className="p-6 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Bell className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-slate-100">Notifications</h3>
              </div>

              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-200">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </p>
                      <p className="text-sm text-slate-400">
                        {key === "dailyReminders" && "Get gentle daily writing reminders"}
                        {key === "weeklyInsights" && "Receive weekly growth insights"}
                        {key === "milestoneAlerts" && "Celebrate your achievements"}
                        {key === "smartReminders" && "AI-powered personalized reminders"}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [key]: checked }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Privacy */}
          <Card className="p-6 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-slate-100">Privacy & Security</h3>
              </div>

              <div className="space-y-4">
                {Object.entries(privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-200">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </p>
                      <p className="text-sm text-slate-400">
                        {key === "dataEncryption" && "Encrypt all journal entries locally"}
                        {key === "localStorage" && "Store data on your device only"}
                        {key === "analytics" && "Help improve the app with usage data"}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, [key]: checked }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Export Data */}
        <Card className="p-6 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Download className="w-6 h-6 text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Export Your Journey</h3>
                <p className="text-slate-400">Download all your entries and insights</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-100 hover:bg-purple-500/30">
                Export as PDF
              </Button>
              <Button
                variant="outline"
                className="border-slate-600/50 text-slate-300 hover:bg-slate-700/30 bg-transparent"
              >
                Export as JSON
              </Button>
            </div>
          </div>
        </Card>

        {/* App Preferences */}
        <Card className="p-6 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Palette className="w-6 h-6 text-teal-400" />
              <h3 className="text-lg font-semibold text-slate-100">App Preferences</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Prompt Complexity</label>
                <select className="w-full bg-slate-700/30 border border-slate-600/50 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/50">
                  <option value="simple">Simple & Direct</option>
                  <option value="thoughtful">Thoughtful & Deep</option>
                  <option value="creative">Creative & Inspiring</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Preferred Topics</label>
                <div className="flex flex-wrap gap-2">
                  {["Self-reflection", "Goals", "Gratitude", "Emotions", "Creativity", "Relationships"].map((topic) => (
                    <Button
                      key={topic}
                      variant="outline"
                      size="sm"
                      className="border-slate-600/50 text-slate-300 hover:bg-teal-400/10 hover:border-teal-400/30 hover:text-teal-200 bg-transparent"
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
