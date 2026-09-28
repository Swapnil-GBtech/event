"use client"

import type React from "react"
import { EmailVarification, resetPassword } from "../ApiServices/ApiServices"
import { useState } from "react"
import { Mail, Eye, EyeOff, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "../ui/use-toast"

type Step = "email" | "loading" | "reset"

export default function ForgetPasswordModal({ openforgetPasswordModal, HandleCloseForgetPasswordModel }: { openforgetPasswordModal: boolean, HandleCloseForgetPasswordModel: () => boolean }) {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [newpassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  const { toast } = useToast();


  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setStep("loading")
      // Simulate email verification process
      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += 10
        setProgress(currentProgress)
        if (currentProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setStep("reset")
          }, 500)
        }
      }, 200)
    }
  }

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      // Handle password reset logic here
      console.log("Password reset successful")
      setIsOpen(false)
      // Reset form
      setStep("email")
      setEmail("")
      setNewPassword("")
      setConfirmPassword("")
      setProgress(0)
    }
  }

  const VerificationOfEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setProgress(0)
      const response = await EmailVarification({email})
      if (response.statuscode === 200) {
        toast({
          title: "Email Varification",
          description: response.message || "Email Varification Successfully",
        });
        setStep("loading")
        setProgress(50)
        setStep("reset")
        setProgress(100)
      }
    } catch (error) {
      setProgress(0)
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to send your message. Please try again.",
        variant: "destructive",
      })
    }
  }


  const handleResetPassword = async(e: React.FormEvent)=>{
    e.preventDefault()
      try {
         const response = await resetPassword({email,newpassword,confirmPassword})
         if (response.statuscode === 200) {
            toast({
              title: "Password Reset",
              description: response.message || "Password Reset Successfully",
            });
            setIsOpen(false)
            // Reset form
            setStep("email")
            setEmail("")
            setNewPassword("")
            setConfirmPassword("")
            setProgress(0)
         }
      } catch (error) {
         toast({
            title: "Error",
            description: error?.response?.data?.message || "Failed to send your message. Please try again.",
            variant: "destructive",
          })
      }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Dialog
        open={openforgetPasswordModal}
        onOpenChange={HandleCloseForgetPasswordModel}
      >
        <DialogContent className="sm:max-w-md p-0 gap-0">
          <Card className="border-0 shadow-none relative">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">
                {step === "email" && "Reset Password"}
                {step === "loading" && "Verifying Email"}
                {step === "reset" && "Create New Password"}
              </CardTitle>
              <CardDescription>
                {step === "email" && "Enter your email address and we'll send you a verification link"}
                {step === "loading" && "Please wait while we verify your email address"}
                {step === "reset" && "Enter your new password below"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Email Step */}
              {step === "email" && (
                <form onSubmit={VerificationOfEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={!email}>
                    Send Verification Email
                  </Button>
                </form>
              )}

              {/* Loading Step */}
              {step === "loading" && (
                <div className="space-y-4">
                  {/* Gmail-style loading bar at top of card */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="text-center space-y-2 py-8">
                    <p className="text-sm font-medium">Verifying your email...</p>
                    <p className="text-xs text-gray-500">We sent a verification link to {email}</p>
                  </div>
                </div>
              )}

              {/* Password Reset Step */}
              {step === "reset" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 text-sm">
                    <Check className="h-4 w-4" />
                    Email verified successfully
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Enter New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newpassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {confirmPassword && newpassword !== confirmPassword && (
                      <p className="text-sm text-red-600">Passwords do not match</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!newpassword || !confirmPassword || newpassword  !== confirmPassword}
                  >
                    Reset Password
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  )
}
