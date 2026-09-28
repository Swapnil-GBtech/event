"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { toast } from "@/hooks/use-toast"
import { Calendar, Shield, Users, Zap, Eye, EyeOff, Mail, Lock, Smartphone } from "lucide-react"

interface LoginPageProps {
  onLoginSuccess: (email: string) => void
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false)
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsOtpDialogOpen(true)
      toast({
        title: "OTP Sent",
        description: "Verification code has been sent to your email",
      })
    }, 1500)
  }

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    setOtpLoading(true)

    // Simulate OTP verification
    setTimeout(() => {
      setOtpLoading(false)
      setIsOtpDialogOpen(false)
      toast({
        title: "Login Successful",
        description: "Welcome to Super Admin Dashboard",
      })
      onLoginSuccess(email)
    }, 1500)
  }

  const features = [
    {
      icon: Users,
      title: "Admin Management",
      description: "Manage all admin users and their permissions",
    },
    {
      icon: Calendar,
      title: "Event Oversight",
      description: "Monitor all events across the platform",
    },
    {
      icon: Zap,
      title: "Real-time Analytics",
      description: "Get instant insights and performance metrics",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-poppins">
      <div className="flex min-h-screen">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col justify-center max-w-md">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-sm">
                  <Shield className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-poppins">EventMaster Pro</h1>
                  <p className="text-blue-100 font-inter">Super Admin Portal</p>
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-4 leading-tight font-poppins">Manage Your Event Empire</h2>
              <p className="text-xl text-blue-100 mb-8 font-inter">
                Complete control over your event management platform with advanced admin tools and analytics.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2 bg-white/20 backdrop-blur-sm">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 font-poppins">{feature.title}</h3>
                    <p className="text-blue-100 text-sm font-inter">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-poppins">10,000+</div>
                  <div className="text-blue-100 text-sm font-inter">Events Managed</div>
                </div>
              </div>
              <div className="text-sm text-blue-100 font-inter">Trusted by event organizers worldwide</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 lg:hidden">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900 font-poppins">EventMaster Pro</h1>
              </div>
              <p className="text-gray-600 font-inter">Super Admin Portal</p>
            </div>

            <Card className="shadow-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 font-poppins">Admin Login</CardTitle>
                <CardDescription className="text-gray-600 font-inter">
                  Access your super admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 font-poppins">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@eventmaster.com"
                        className="pl-10 h-12 focus:ring-blue-500 font-inter"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 font-poppins">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 h-12 focus:ring-blue-500 font-inter"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input id="remember" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                      <label htmlFor="remember" className="ml-2 text-sm text-gray-600 font-inter">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500 font-inter">
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium font-poppins"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin"></div>
                        Sending OTP...
                      </div>
                    ) : (
                      "Login with OTP"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 font-inter">
                    Need help?{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                      Contact Support
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 text-center text-xs text-gray-500 font-inter">
              <p>© 2024 EventMaster Pro. All rights reserved.</p>
              <p className="mt-1">Secure admin access with two-factor authentication</p>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-100">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <DialogTitle className="text-xl font-bold font-poppins">Verify Your Identity</DialogTitle>
            <DialogDescription className="text-gray-600 font-inter">
              We've sent a 6-digit verification code to
              <br />
              <span className="font-medium text-gray-900">{email}</span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleOtpVerification} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="otp" className="text-sm font-medium text-gray-700 font-poppins text-center block">
                Verification Code
              </Label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg font-mono font-semibold" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg font-mono font-semibold" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg font-mono font-semibold" />
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg font-mono font-semibold" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg font-mono font-semibold" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg font-mono font-semibold" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 bg-transparent font-poppins"
                onClick={() => setIsOtpDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 font-poppins"
                disabled={otpLoading || otp.length !== 6}
              >
                {otpLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify & Login"
                )}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 font-inter">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                  onClick={() => {
                    toast({
                      title: "OTP Resent",
                      description: "New verification code has been sent",
                    })
                  }}
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
