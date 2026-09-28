 
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, CheckCircle, AlertTriangle, XCircle, Clock, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth/auth-provider"
import { UpdateEventStaus } from "../ApiServices/ApiServices"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EventStatusModalProps {
  isOpen: boolean
  onClose: () => void
  event: any
  getAssignEvents: () => Promise<any>
}

export function EventStatusModal({ isOpen, onClose, event, getAssignEvents }: EventStatusModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [eventStatus, setEventStatus] = useState("")
  const [updateEvenetMsg, setEventUpdateMsg] = useState("")
  const { auth } = useAuth()
  const { toast } = useToast()

  const handleEventUpdateStatus = async () => {
    if ((eventStatus === "delayed" || eventStatus === "cancelled") && !updateEvenetMsg.trim()) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please provide a reason for this status change.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      const formData = {
        organizationId: auth?.createdBy,
        eventId: event?._id,
        eventstatus: eventStatus,
        Event_update_messege: updateEvenetMsg,
      }
      const response = await UpdateEventStaus(formData)
      if (response.statuscode == 200) {
        toast({
          title: "🎉 Status Updated Successfully!",
          description: response?.message || "Your event status has been updated successfully.",
          variant: "default",
        })
        setIsLoading(false)
        await getAssignEvents(auth?.createdBy, auth?._id)
        onClose()
        // Reset form
        setEventStatus("")
        setEventUpdateMsg("")
      }
    } catch (error) {
      toast({
        title: "❌ Update Failed",
        description: error?.response?.data?.message || "Failed to update status. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const statusOptions = [
    {
      value: "upcoming",
      label: "Upcoming",
      description: "Event is scheduled and ready to go",
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      emoji: "🚀",
    },
    {
      value: "delayed",
      label: "Delayed",
      description: "Event needs to be postponed",
      icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      emoji: "⏰",
    },
    {
      value: "completed",
      label: "Completed",
      description: "Event finished successfully",
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      emoji: "✅",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      description: "Event has been cancelled",
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      emoji: "❌",
    },
  ]

  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">Update Event Status</DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                Update the status of <span className="font-semibold text-indigo-600">"{event.Event_title}"</span>
              </DialogDescription>
            </div>
          </div>

          {/* Event Preview Card */}
          <Card className="bg-gradient-to-r from-gray-50 to-slate-100 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={event?.image || "/placeholder.svg?height=60&width=60"}
                  alt={event?.Event_title}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-md"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{event.Event_title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{event.Description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="outline" className="text-xs">
                      📅 {new Date(event.Date).toLocaleDateString()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      📍 {event.location}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Choose New Status
            </Label>
            <RadioGroup value={eventStatus} onValueChange={setEventStatus}>
              <div className="grid grid-cols-1 gap-3">
                {statusOptions.map((option) => (
                  <div key={option.value} className="relative">
                    <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                    <Label
                      htmlFor={option.value}
                      className={`flex items-center space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        eventStatus === option.value
                          ? `${option.bgColor} ${option.borderColor} shadow-md ring-2 ring-offset-2 ring-blue-200`
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${eventStatus === option.value ? "bg-white shadow-sm" : option.bgColor}`}
                      >
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{option.emoji}</span>
                          <span
                            className={`font-bold text-lg ${eventStatus === option.value ? option.color : "text-gray-900"}`}
                          >
                            {option.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                      {eventStatus === option.value && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {(eventStatus === "delayed" || eventStatus === "cancelled") && (
            <div className="space-y-3">
              <Label htmlFor="reason" className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Reason for {eventStatus === "delayed" ? "Delay" : "Cancellation"} *
              </Label>
              <Textarea
                id="reason"
                value={updateEvenetMsg}
                onChange={(e) => setEventUpdateMsg(e.target.value)}
                placeholder={`Please provide a detailed reason for ${eventStatus === "delayed" ? "delaying" : "cancelling"} this event. This will help attendees understand the situation better.`}
                rows={4}
                className="resize-none border-2 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 rounded-lg"
              />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> A clear explanation helps maintain trust with your attendees and can be used
                  for future planning.
                </p>
              </div>
            </div>
          )}

          {eventStatus === "completed" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-800 font-medium">
                  🎉 Great! Marking this event as completed will update all attendee records and generate final reports.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="space-x-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-6 py-2 hover:bg-gray-50 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleEventUpdateStatus}
            disabled={
              isLoading ||
              !eventStatus ||
              ((eventStatus === "delayed" || eventStatus === "cancelled") && !updateEvenetMsg.trim())
            }
            className="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Updating..." : "✨ Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

