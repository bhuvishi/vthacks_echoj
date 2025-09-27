"use client"

import { useState } from "react"
import { AuthScreen } from "@/components/auth-screen"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { MainDashboard } from "@/components/main-dashboard"
import { WritingInterface } from "@/components/writing-interface"
import { GrowthTracker } from "@/components/growth-tracker"
import { PastEntries } from "@/components/past-entries"
import { ProfileSettings } from "@/components/profile-settings"

export default function EchoJournal() {
  const [currentScreen, setCurrentScreen] = useState<
    "auth" | "onboarding" | "dashboard" | "writing" | "growth" | "entries" | "profile"
  >("auth")
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)

  const handleAuthComplete = () => {
    setCurrentScreen("onboarding")
  }

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true)
    setCurrentScreen("dashboard")
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "auth":
        return <AuthScreen onComplete={handleAuthComplete} />
      case "onboarding":
        return <OnboardingFlow onComplete={handleOnboardingComplete} />
      case "dashboard":
        return <MainDashboard onNavigate={setCurrentScreen} />
      case "writing":
        return <WritingInterface onBack={() => setCurrentScreen("dashboard")} />
      case "growth":
        return <GrowthTracker onBack={() => setCurrentScreen("dashboard")} />
      case "entries":
        return <PastEntries onBack={() => setCurrentScreen("dashboard")} />
      case "profile":
        return <ProfileSettings onBack={() => setCurrentScreen("dashboard")} />
      default:
        return <MainDashboard onNavigate={setCurrentScreen} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Aurora Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Global Glass Effect Styles */}
      <style jsx global>{`
        .glass-effect {
          background: rgba(30, 41, 59, 0.3) !important;
          backdrop-filter: blur(16px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
          border: 1px solid rgba(148, 163, 184, 0.2) !important;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important;
        }
        
        .glass-button {
          background: rgba(45, 212, 191, 0.1) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(45, 212, 191, 0.2) !important;
        }
        
        .glass-button:hover {
          background: rgba(45, 212, 191, 0.2) !important;
          transform: translateY(-1px) !important;
        }
        
        .glass-button:active {
          background: rgba(45, 212, 191, 0.15) !important;
          transform: translateY(0px) !important;
        }
      `}</style>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-teal-300/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {renderScreen()}
    </div>
  )
}
