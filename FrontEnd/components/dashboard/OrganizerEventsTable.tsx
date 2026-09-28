"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, MapPin, Edit, Trash2, Eye, MoreHorizontal, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import type { Event } from "@/lib/types"
import { fetchOrganizerEvents, deleteEvent, duplicateEvent } from "@/lib/api"
import { useAuth } from "@/lib/auth/auth-provider"

export default function OrganizerEventsTable() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const getEvents = async () => {
      if (!user) return

      try {
        const data = await fetchOrganizerEvents(user.id)
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getEvents()
  }, [user])

  const handleDelete = async () => {
    if (!selectedEvent) return

    try {
      await deleteEvent(selectedEvent)
      setEvents((prev) => prev.filter((event) => event.id !== selectedEvent))
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setSelectedEvent(null)
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const newEvent = await duplicateEvent(id)
      setEvents((prev) => [...prev, newEvent])
      toast({
        title: "Event duplicated",
        description: "The event has been successfully duplicated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate the event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const confirmDelete = (id: string) => {
    setSelectedEvent(id)
    setShowDeleteDialog(true)
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
      ) : events.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No events found</h3>
          <p className="text-muted-foreground mb-4">You haven't created any events yet.</p>
          <Button asChild>
            <Link href="/events/create">Create your first event</Link>
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
                <TableHead>Attendees</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {format(new Date(event.date), "MMM dd, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {event.location}
                    </div>
                  </TableCell>
                  <TableCell>{event.attendees}</TableCell>
                  <TableCell>{getStatusBadge(event.date)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/events/${event.id}`} className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/events/edit/${event.id}`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(event.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Duplicate</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => confirmDelete(event.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
