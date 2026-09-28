
"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import EventCard from "@/components/events/EventCard"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-provider"
import { getAllEventsThunk } from "../ReduxSlices/CreateEventSlice"
import { useAppDispatch } from "@/lib/store"
import { Calendar, Search, RefreshCw, Plus, Clock } from "lucide-react"
import { Card, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export default function EventsList({
  allevents,
  loading,
  setFavariteId,
  setPendingEvent
}: {
  allevents: any
  loading: boolean,
  setFavariteId:any,
  setPendingEvent:any
}) {
  const { auth } = useAuth()
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)


  useEffect(() => {
    dispatch(getAllEventsThunk(auth?._id))
  }, [auth, dispatch])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await dispatch(getAllEventsThunk())
    setTimeout(() => setIsRefreshing(false), 500) 
  }

 
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  // Enhanced Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin h-16 w-16" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {allevents?.length || 0} Events
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </motion.div>
      </div>
      
      <AnimatePresence mode="wait">
        {/* Events Grid */}
        {allevents.length > 0 ? (
          <motion.div
            key="events-grid"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {allevents?.map((event: any) => (
              <motion.div key={event._id} variants={item}>
                <EventCard
                  event={event}
                  setFavariteId={setFavariteId}
                  setPendingEvent={setPendingEvent}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Enhanced Empty State */
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-center min-h-[50vh]"
          >
            <Card className="w-full   text-center">
              <CardContent className="pt-8 pb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                </motion.div>

                <CardTitle className="text-xl mb-2">{searchTerm ? "No Events Found" : "No Events Available"}</CardTitle>

                <CardDescription className="mb-6">
                  {searchTerm
                    ? `No events match "${searchTerm}". Try adjusting your search terms.`
                    : "There are no events available at the moment. Check back later or create your own event!"}
                </CardDescription>

                
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      {allevents?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <Card className="text-center p-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Total Events
            </div>
            <div className="text-2xl font-bold mt-1">{allevents?.length || 0}</div>
          </Card>

          <Card className="text-center p-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              Showing
            </div>
            <div className="text-2xl font-bold mt-1">{allevents?.length}</div>
          </Card>

          <Card className="text-center p-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last Updated
            </div>
            <div className="text-sm font-medium mt-1">Just now</div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

