"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, MapPin, DollarSign, Users, Heart, MoreVertical, Trash, Edit, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
 import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-provider"
 
import type { Event } from "@/lib/types"
 


interface EventCardProps {
  Event_title: string
  Description: string
  Date: string
  Time: string
  location: string
  Category: string
  Price: number
  Organizer: string
  _id: string
  event: {}
  onDelete?: (id: string) => void
  onToggleFavorite?: (event: Event) => void
  isFavorite?: boolean
  image: string,
  setFavariteId:()=>void,
  setPendingEvent:()=>void
}

export default function EventCard({ event, onDelete,setFavariteId,setPendingEvent, onToggleFavorite, isFavorite = false }: EventCardProps) {
  const { auth } = useAuth()
  
   const path = usePathname()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }



  return (
    <motion.div
      variants={item}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-shadow hover:shadow-lg"
    >
      <div className="relative">
        <Link href={`/events/${event._id}`}>
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={event?.image || "/placeholder.svg"}
              alt={event?.Event_title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
        <div className="absolute top-4 left-4">
          <Badge
          >
            {
              event?.Category?.Category_name &&
              event.Category.Category_name.charAt(0).toUpperCase() +
              event.Category.Category_name.slice(1)
            }
          </Badge>
        </div>
        {
           path !=='/' && ( <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full h-8 w-8 p-1.5"
          onClick={()=>{setFavariteId(event),setPendingEvent(event)}}
        >
          <Heart
            className={`h-full w-full transition-colors ${auth?.favorate_events?.some((favid:string) => favid?._id === event._id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </Button>)
        }
      </div>
      <div className="p-5">
        <Link href={`/events/${event._id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors line-clamp-1">{event.title}</h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-700">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{formatDate(event?.Date)}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span className="line-clamp-1">{event?.location}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <DollarSign className="h-4 w-4 mr-2 text-primary" />
            <span>{event?.Price}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Users className="h-4 w-4 mr-2 text-primary" />
            <span>{event?.attendee?.length} attendees</span>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            By <span className="font-medium">{event?.Organizer?.name}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
