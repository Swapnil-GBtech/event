"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, MapPin, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useParams } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import type { Booking } from "@/lib/types"
import { fetchAttendeeBookings, cancelBooking } from "@/lib/api"
import { useAuth } from "@/lib/auth/auth-provider"
import { Loader2 } from "lucide-react"
import { removeRegisterEvent } from "../ApiServices/ApiServices"

 

export default function AttendeeBookingsTable() {
  const { auth,refreshUser} = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const { toast } = useToast()

  

  const handleCancel = async () => {
    try {
       setIsLoading(true)
      const response = await removeRegisterEvent(selectedBooking)
      if (response?.data) {
        toast({
          title: "Booking Cancelled",
          description: "The booking has been cancelled successfully.",
        })
        await refreshUser()
        setIsLoading(false)
      } else {
        setIsLoading(false)
        toast({
          title: "Error",
          description: "Failed to cancel the booking. Please try again.",
        })
      }
      return response?.data
    } catch (error) {
      setIsLoading(false)
      console.log("error", error)
    }
  } 


  

  const confirmCancel = (id: string) => {
    setSelectedBooking(id)
    setShowCancelDialog(true)
  }

  const getStatusBadge = (date: string) => {
    const eventDate = new Date(date)
    const now = new Date()

    if (eventDate > now) {
      return <Badge className="bg-green-500">Upcoming</Badge>
    } else {
      return <Badge variant="outline">Past</Badge>
    }
  }

  return (
    <div className="bg-white rounded-lg">
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-12 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : auth?.registered_attendees === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No bookings found</h3>
          <p className="text-muted-foreground mb-4">You haven't registered for any events yet.</p>
          <Button asChild>
            <Link href="/events">Browse events</Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auth?.registered_attendees?.map((booking:string) => (
                <TableRow key={booking?._id}>
                  <TableCell className="font-medium">{booking?.Event_title}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {format(new Date(booking?.Date), "MMM dd, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {booking?.location}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(booking?.date)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/events/${booking?._id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      {new Date(booking?.Date) > new Date() && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => confirmCancel(booking?._id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your registration for this event. You can register again later if you change your mind.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Registration</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground">
               {isLoading 
               ? <div className="flex items-center justify-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Cancelling...</div> 
               : <div>Remove</div>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
