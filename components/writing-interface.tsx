"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, PenTool, MessageSquare, Smile, Mic, Save, Bold, Italic, List, X } from "lucide-react"

interface WritingInterfaceProps {
  onBack: () => void
}

export function WritingInterface({ onBack }: WritingInterfaceProps) {
  const [activeMode, setActiveMode] = useState<"write" | "quick" | "emojis" | "voice">("write")
  const [content, setContent] = useState("")
  const [showPrompt, setShowPrompt] = useState(true)
  const [wordCount, setWordCount] = useState(0)
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([])
  const [quickAnswers, setQuickAnswers] = useState({
    feeling: "",
    grateful: "",
    challenges: "",
  })

  const handleContentChange = (value: string) => {
    setContent(value)
    setWordCount(
      value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length,
    )
  }

  const emojiCategories = {
    Mood: ["😊", "😢", "😡", "😴", "🤔", "😌", "🥰", "😤", "😔", "✨"],
    Activities: ["📚", "🏃‍♀️", "🍳", "🎵", "🎨", "💻", "🌱", "🧘‍♀️", "🎯", "🏠"],
    People: ["👥", "👨‍👩‍👧‍👦", "🤝", "💕", "👋", "🫂", "👶", "👵", "🐕", "🐱"],
    Thoughts: ["💭", "💡", "🌟", "🔥", "💪", "🙏", "❤️", "🌈", "🌙", "☀️"],
  }

  const quickQuestions = [
    { key: "feeling", question: "How are you feeling right now?" },
    { key: "grateful", question: "What's one thing you're grateful for?" },
    { key: "challenges", question: "Any challenges today?" },
  ]

  const handleSave = () => {
    // Save logic here
    console.log("Saving entry...", { activeMode, content, selectedEmojis, quickAnswers })
    onBack()
  }

  const hasContent =
    content.trim().length > 0 ||
    selectedEmojis.length > 0 ||
    Object.values(quickAnswers).some((answer) => answer.trim().length > 0)

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-slate-100 bg-secondary-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="text-sm text-slate-400">
            Auto-saved <span className="inline-block w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse" />
          </div>
        </div>

        {/* Prompt Card */}
        {showPrompt && (
          <Card className="p-6 bg-gradient-to-r from-teal-400/10 to-purple-400/10 border border-teal-400/20 backdrop-blur-sm relative bg-chart-3 text-foreground">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPrompt(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </Button>
            <p className="text-lg text-slate-200 italic pr-8 font-mono leading-relaxed">
              "What brought you joy today, and how did it make you feel in the moment? Sometimes the smallest moments
              carry the greatest meaning."
            </p>
          </Card>
        )}

        {/* Mode Switcher */}
        <Card className="p-2 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex space-x-2">
            {[
              { mode: "write" as const, icon: PenTool, label: "Write" },
              { mode: "quick" as const, icon: MessageSquare, label: "Quick" },
              { mode: "emojis" as const, icon: Smile, label: "Emojis" },
              { mode: "voice" as const, icon: Mic, label: "Voice" },
            ].map(({ mode, icon: Icon, label }) => (
              <Button
                key={mode}
                variant={activeMode === mode ? "default" : "ghost"}
                onClick={() => setActiveMode(mode)}
                className={`flex-1 transition-all duration-300 ${
                  activeMode === mode
                    ? "bg-gradient-to-r from-teal-500/20 to-purple-500/20 text-teal-100 border border-teal-400/30"
                    : "text-slate-300 hover:text-slate-100 hover:bg-slate-700/30"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Writing Interface */}
        <Card className="min-h-[500px] bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm overflow-hidden">
          {activeMode === "write" && (
            <div className="h-full flex flex-col">
              {/* Formatting Toolbar */}
              <div className="flex items-center space-x-2 p-4 border-b border-slate-700/50">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-200">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-200">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-200">
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 p-6">
                <Textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Let your thoughts flow..."
                  className="w-full h-full min-h-[400px] bg-transparent border-none text-lg text-slate-100 placeholder-slate-400 resize-none focus:outline-none font-mono leading-relaxed"
                />
              </div>

              <div className="p-4 border-t border-slate-700/50 text-right">
                <span className="text-sm text-slate-400 font-mono">{wordCount} words</span>
              </div>
            </div>
          )}

          {activeMode === "quick" && (
            <div className="p-6 space-y-6">
              {quickQuestions.map(({ key, question }) => (
                <div key={key} className="space-y-3">
                  <label className="text-lg font-medium text-slate-200">{question}</label>
                  <Textarea
                    value={quickAnswers[key as keyof typeof quickAnswers]}
                    onChange={(e) => setQuickAnswers((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder="Your thoughts..."
                    className="bg-slate-700/30 border border-slate-600/50 text-slate-100 placeholder-slate-400 focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/50"
                    rows={3}
                  />
                </div>
              ))}
            </div>
          )}

          {activeMode === "emojis" && (
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-200">Express yourself with emojis</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEmojis.map((emoji, index) => (
                    <div
                      key={index}
                      className="text-3xl p-2 bg-teal-400/20 rounded-lg border border-teal-400/30 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => setSelectedEmojis((prev) => prev.filter((_, i) => i !== index))}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>

              {Object.entries(emojiCategories).map(([category, emojis]) => (
                <div key={category} className="space-y-3">
                  <h4 className="font-medium text-slate-300">{category}</h4>
                  <div className="grid grid-cols-10 gap-2">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedEmojis((prev) => [...prev, emoji])}
                        className="text-2xl p-2 hover:bg-slate-700/30 rounded-lg transition-colors hover:scale-110 transform duration-200"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeMode === "voice" && (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full flex items-center justify-center border border-red-400/30">
                  <Mic className="w-12 h-12 text-red-300" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-slate-200 mb-2">Voice Recording</h3>
                  <p className="text-slate-400">Tap to start recording your thoughts</p>
                </div>
                <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 rounded-full">
                  Start Recording
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSave}
            disabled={!hasContent}
            className={`px-8 py-3 rounded-full transition-all duration-300 ${
              hasContent
                ? "bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl"
                : "bg-slate-700/50 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </div>
      </div>
    </div>
  )
}
