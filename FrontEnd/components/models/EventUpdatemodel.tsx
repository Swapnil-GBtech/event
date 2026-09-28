"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CalendarDays,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Mail,
  Phone,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react"

interface EventDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  event: any
}

export function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
  if (!event) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const time = new Date()
    time.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "attended":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "no-show":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case "attended":
        return <Badge className="bg-green-100 text-green-800">Attended</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "no-show":
        return <Badge className="bg-red-100 text-red-800">No Show</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{event.Event_title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Image */}
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.Event_title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Event Information</h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(event.Date)} at {formatTime(event.Time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900 capitalize">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium text-emerald-600">
                      {event.Price === 0 ? "Free Event" : `₹${event.Price}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-medium text-gray-900">
                      {event.registeredCount} / {event.maxCapacity || "Unlimited"} registered
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-gray-900">{event.Description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Event Status & Progress</h3>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Current Status</p>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(event.eventStatus)}
                    {getStatusBadge(event.eventStatus)}
                  </div>
                  {event.delayReason && (
                    <div className="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      <p className="text-sm text-yellow-800">
                        <strong>Delay Reason:</strong> {event.delayReason}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Completion Progress</p>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          event.completionPercentage === 100
                            ? "bg-green-500"
                            : event.completionPercentage >= 75
                              ? "bg-blue-500"
                              : event.completionPercentage >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                        }`}
                        style={{ width: `${event.completionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{event.completionPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Attendees List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Attendees ({event.attendee.length})</h3>
              <div className="flex space-x-2 text-sm">
                <span className="text-green-600">
                  ✓ {event.attendee.filter((a) => a.status === "confirmed" || a.status === "attended").length} Confirmed
                </span>
                <span className="text-yellow-600">
                  ⏳ {event.attendee.filter((a) => a.status === "pending").length} Pending
                </span>
                {event.attendee.filter((a) => a.status === "no-show").length > 0 && (
                  <span className="text-red-600">
                    ✗ {event.attendee.filter((a) => a.status === "no-show").length} No Show
                  </span>
                )}
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {event.attendee.map((attendee: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      {/* <span className="text-sm font-medium text-gray-700">
                        {attendee.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </span> */}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{attendee.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{attendee.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{attendee.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(attendee.status)}
                    {getStatusBadge(attendee.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
