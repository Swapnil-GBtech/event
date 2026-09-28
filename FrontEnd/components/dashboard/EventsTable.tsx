"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, MapPin, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllEventsThunk } from "../ReduxSlices/CreateEventSlice"
import { useAppDispatch,useAppSelector } from "@/lib/store"
import { useAuth } from "@/lib/auth/auth-provider"
import { deleteEvent } from "../ApiServices/ApiServices"
import { Input } from "../ui/input"
import Image from "next/image"
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
 
 

export default function EventsTable() {
  const [events, setEvents] = useState<Event[]>([])

  const[selectedallIds,setSelectedIds] = useState([]);

 
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toast } = useToast()
  const{auth} = useAuth()
  const dispatch = useAppDispatch();

  const {allevents,loading} = useAppSelector((state) => state.createEvents);

  useEffect(() => {
    dispatch(getAllEventsThunk());
  }, [dispatch,auth]);
 


    const selectedAll =()=>{
        const allIds = allevents?.map((event) => event?._id)
        if(allIds.length === selectedallIds.length){
            setSelectedIds([])
        }else if(selectedallIds.length > 0){
             setSelectedIds((prev)=> [ ...new Set([...prev, ...allIds])])
        }else {
            setSelectedIds(allIds)
        }
    }
 

    const selcetParticular = (id:string)=>{
       if(selectedallIds.includes(id)){
        setSelectedIds((prev) => prev.filter((eventId) => eventId !== id));
       }else{
        setSelectedIds((prev) => [...prev, id]);
       }
    }

    
  
  const handleDelete = async () => {
    if (!selectedEvent) return
    try {
      await deleteEvent(selectedEvent)
      setEvents((prev) => prev.filter((event) => event.id !== selectedEvent))
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      })
      dispatch(getAllEventsThunk());
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
    <div className="bg-white rounded-lg shadow-sm border">
      {loading ? (
        <div className="p-8 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-12 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                 <TableHead className="flex gap-2 items-center"> 
                    <Input
                      type="checkbox"
                      className="h-4 w-4"
                      onChange={selectedAll}
                      checked={selectedallIds.length === allevents?.length}
                    />
                     <span>Image</span>
                  </TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Organizer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allevents?.map((event) => (
                <TableRow 
                 className={`${selectedallIds?.includes(event?._id) ? "bg-[#7B68EE] border-blue-[#7B68EE] text-white" : ""}`}
                 key={event._id}>
                   <TableCell className="flex gap-2 items-center">
                    <Input
                      type="checkbox"
                      className="h-4 w-4"
                      onChange={() => selcetParticular(event._id)}
                      checked={selectedallIds?.includes(event?._id)}
                    />
                    <div className="relative h-10 w-16 rounded overflow-hidden">
                      <Image
                        src={event?.image || "/placeholder.svg"}
                        alt={event?.Event_title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{event?.Event_title}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {format(new Date(event?.Date), "MMM dd, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {event?.location}
                    </div>
                  </TableCell>
                  <TableCell>{event?.Organizer?.name}</TableCell>
                  <TableCell>{getStatusBadge(event?.Date)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/events/${event._id}`} className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </Link>
                        </DropdownMenuItem>


                        <DropdownMenuItem asChild>
                          <Link href={`/events/edit/${event._id}`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>


                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => confirmDelete(event._id)}
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
