"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Event } from "@/lib/types"
import { getAllEventsThunk } from "../ReduxSlices/CreateEventSlice"
 import { useAppDispatch,useAppSelector } from "@/lib/store"
 import { useAuth } from "@/lib/auth/auth-provider"
 import axios from "axios"

export default function FeaturedEventsPreview({evetsdata,isLoading}:{evetsdata:Event[],isLoading:boolean}) {

  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-2">Featured Events</h2>
            <p className="text-gray-300">Discover our handpicked selection of upcoming events</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="outline"
              asChild
              className="mt-4 md:mt-0 border-white bg-purple-700 text-white hover:bg-white hover:text-gray-900"
            >
              <Link href="/events" className="group">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 h-64 animate-pulse border border-white/20"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {evetsdata?.slice(0, 3).map((event, index) => (
              <motion.div
                key={event?._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <Link href={`/events/${event?._id}`} className="block">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-white font-medium text-xl">{event?.Event_title}</h3>
                    <Badge className="bg-primary/80">{event?.Category?.Category_name}</Badge>
                  </div>
                  <div className="flex flex-col space-y-3 text-sm text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        {new Date(event?.Date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span>{event?.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span>{event?.attendee?.length} attending</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
                    <span className="text-primary font-medium">${event?.Price.toFixed(2)}</span>
                    <span className="text-white/70 text-sm group-hover:text-white transition-colors">
                      View Details →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
