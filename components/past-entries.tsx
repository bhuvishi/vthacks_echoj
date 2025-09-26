"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Filter, Calendar, Smile, PenTool, Mic } from "lucide-react"

interface PastEntriesProps {
  onBack: () => void
}

export function PastEntries({ onBack }: PastEntriesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<"all" | "mood" | "date" | "type">("all")

  const entries = [
    {
      id: 1,
      date: "2024-01-07",
      type: "text",
      mood: "grateful",
      moodColor: "bg-green-400",
      preview:
        "Today I realized how much I've grown in the past year. The challenges that once seemed impossible now feel like stepping stones...",
      wordCount: 247,
      tags: ["growth", "reflection", "gratitude"],
    },
    {
      id: 2,
      date: "2024-01-06",
      type: "emoji",
      mood: "peaceful",
      moodColor: "bg-blue-400",
      preview: "😌 🌅 ☕ 📚 🧘‍♀️ 🌱 ✨",
      wordCount: 0,
      tags: ["morning", "peace", "routine"],
    },
    {
      id: 3,
      date: "2024-01-05",
      type: "quick",
      mood: "excited",
      moodColor: "bg-yellow-400",
      preview:
        "Feeling: Energized and ready for new challenges. Grateful for: My supportive family and the opportunity to learn...",
      wordCount: 89,
      tags: ["energy", "family", "learning"],
    },
    {
      id: 4,
      date: "2024-01-04",
      type: "voice",
      mood: "thoughtful",
      moodColor: "bg-purple-400",
      preview: "Voice note: 3:24 - Reflecting on the conversation with mom about finding balance...",
      wordCount: 0,
      tags: ["family", "balance", "conversation"],
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return PenTool
      case "emoji":
        return Smile
      case "voice":
        return Mic
      default:
        return PenTool
    }
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-slate-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-2xl font-bold text-slate-100">Past Entries</h1>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search entries, tags, or feelings..."
                className="pl-10 bg-slate-700/30 border-slate-600/50 text-slate-100 placeholder-slate-400 focus:border-teal-400/50"
              />
            </div>

            <div className="flex space-x-2">
              {[
                { key: "all", label: "All", icon: Filter },
                { key: "date", label: "Date", icon: Calendar },
                { key: "mood", label: "Mood", icon: Smile },
                { key: "type", label: "Type", icon: PenTool },
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={selectedFilter === key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedFilter(key as any)}
                  className={`transition-all duration-300 ${
                    selectedFilter === key
                      ? "bg-gradient-to-r from-teal-500/20 to-purple-500/20 text-teal-100 border border-teal-400/30"
                      : "text-slate-300 hover:text-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Entries Timeline */}
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const TypeIcon = getTypeIcon(entry.type)

            return (
              <Card
                key={entry.id}
                className="p-6 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-700/30 transition-all duration-300 cursor-pointer group"
              >
                <div className="space-y-4">
                  {/* Entry Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${entry.moodColor}`} />
                        <span className="text-sm text-slate-400">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <TypeIcon className="w-4 h-4 text-slate-400" />
                      {entry.wordCount > 0 && <span className="text-xs text-slate-400">{entry.wordCount} words</span>}
                    </div>
                  </div>

                  {/* Entry Preview */}
                  <div className="space-y-3">
                    <p className="text-slate-200 leading-relaxed group-hover:text-slate-100 transition-colors">
                      {entry.preview}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded-full border border-slate-600/50"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredEntries.length === 0 && (
          <Card className="p-12 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-400/20 to-slate-500/20 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">No entries found</h3>
                <p className="text-slate-400">Try adjusting your search or filters</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
