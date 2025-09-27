"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight,
  CheckCircle
} from "lucide-react"
import { authAPI, setAuthToken } from "@/lib/api"

interface AuthScreenProps {
  onComplete: () => void
}

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  })
  const [twinklingStars, setTwinklingStars] = useState<Array<{id: number, x: number, y: number, delay: number}>>([])
  const [isLoading, setIsLoading] = useState(false)

  // Generate twinkling stars when typing
  useEffect(() => {
    const generateTwinklingStars = () => {
      const stars = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }))
      setTwinklingStars(stars)
    }

    generateTwinklingStars()
    const interval = setInterval(generateTwinklingStars, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      let response
      
      if (activeTab === "login") {
        response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        })
      } else {
        // Validate signup data
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match")
        }
        if (!formData.agreeToTerms) {
          throw new Error("Please agree to the terms and conditions")
        }
        
        response = await authAPI.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          agreeToTerms: formData.agreeToTerms,
        })
      }
      
      // Store auth token and user data
      setAuthToken(response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      console.log("Authentication successful:", response)
      onComplete()
    } catch (error) {
      console.error("Authentication error:", error)
      // You could add a toast notification here to show the error to the user
      alert(error instanceof Error ? error.message : "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Twinkling Stars Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {twinklingStars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-300 to-purple-400 bg-clip-text text-transparent font-mono">
              Echo Journal
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-300/20 to-purple-400/20 blur-xl rounded-full" />
          </div>
          <p className="text-slate-300 font-mono">
            Your thoughts, echoing through time
          </p>
        </div>

        {/* Auth Card */}
        <Card className="p-8 glass-effect shadow-2xl">
          {/* Tab Switcher */}
          <div className="flex mb-8 bg-slate-800/30 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === "login"
                  ? "bg-gradient-to-r from-teal-400/20 to-purple-400/20 text-teal-100 shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === "signup"
                  ? "bg-gradient-to-r from-teal-400/20 to-purple-400/20 text-teal-100 shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "signup" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 font-mono">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10 bg-slate-700/30 border-slate-600/50 text-slate-100 placeholder-slate-400 focus:border-teal-400/50"
                    required={activeTab === "signup"}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 font-mono">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 bg-slate-700/30 border-slate-600/50 text-slate-100 placeholder-slate-400 focus:border-teal-400/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 bg-slate-700/30 border-slate-600/50 text-slate-100 placeholder-slate-400 focus:border-teal-400/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {activeTab === "signup" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 font-mono">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 bg-slate-700/30 border-slate-600/50 text-slate-100 placeholder-slate-400 focus:border-teal-400/50"
                    required={activeTab === "signup"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "signup" && (
              <div className="flex items-start space-x-3">
                <button
                  type="button"
                  onClick={() => handleInputChange("agreeToTerms", !formData.agreeToTerms)}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    formData.agreeToTerms
                      ? "bg-gradient-to-r from-teal-400 to-purple-400 border-teal-400"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                >
                  {formData.agreeToTerms && <CheckCircle className="w-3 h-3 text-white" />}
                </button>
                <label className="text-sm text-slate-300 leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-teal-300 hover:text-teal-200 underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-teal-300 hover:text-teal-200 underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full glass-button text-teal-100 transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isLoading ? "Processing..." : (activeTab === "login" ? "Sign In" : "Create Account")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800/50 text-slate-400 font-mono">or</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/30 bg-slate-800/20 glass-effect"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/30 bg-slate-800/20 glass-effect"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
                className="text-teal-300 hover:text-teal-200 underline font-medium"
              >
                {activeTab === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 font-mono">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
