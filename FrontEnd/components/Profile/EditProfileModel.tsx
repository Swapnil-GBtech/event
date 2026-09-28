"use client"
import { useState } from "react"
import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth/auth-provider"
import { X, User, Mail, Phone, MapPin, Calendar, Save, Loader2, Camera, Upload } from "lucide-react"
import { EditProfile } from "../ApiServices/ApiServices"


interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

export default function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const { auth, refreshUser } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password:"",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await EditProfile(formData)

      if (success) {
        toast({
          title: "✅ Profile Updated",
          description: "Your profile has been updated successfully!",
        })
        onClose()
        await refreshUser()
      } else {
        throw new Error("Update failed")
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-blue-500 text-white flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-bold">Edit Profile</h2>
                  <p className="text-purple-100">Update your personal information</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content - Make it scrollable */}
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                      <Avatar className="w-24 h-24 border-4 border-gray-200">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`} />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                          {formData.name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                    </div>
                    
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="transition-all focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="transition-all focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Password
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        value={formData?.password}
                        onChange={handleInputChange}
                        placeholder="Enter your Change Password"
                        className="transition-all focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

 

 
                  </div>

 

                  {/* Additional spacing at bottom for better scrolling */}
                  <div className="h-4"></div>
                </form>
              </div>

              {/* Footer - Fixed at bottom */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
