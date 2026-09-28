"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import EventCard from "@/components/events/EventCard"
import type { Event } from "@/lib/types"
 

export default function FeaturedEvents({evetsdata,isLoading} :{evetsdata:Event[],isLoading:boolean}) {
   
  const handleToggleFavorite = (event: Event) => {
    // Get current favorites from local storage
    const storedFavorites = localStorage.getItem("favoriteEvents")
    const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : []

    // Toggle favorite status
    if (favoriteIds.includes(event.id)) {
      const updatedFavorites = favoriteIds.filter((id: string) => id !== event.id)
      localStorage.setItem("favoriteEvents", JSON.stringify(updatedFavorites))
    } else {
      favoriteIds.push(event.id)
      localStorage.setItem("favoriteEvents", JSON.stringify(favoriteIds))
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Events</h2>
            <p className="text-gray-600 max-w-2xl">
              Discover our handpicked selection of the most exciting upcoming events you won't want to miss.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 md:mt-0"
          >
            <Button
              asChild
              className="group bg-purple-600 text-white hover:text-white hover:from-primary hover:to-purple-600 bg-gradient-to-r hover:shadow-md transition-all duration-300"
            >
              <Link href="/events" className="flex items-center">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

          </motion.div>
        </div>


        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {evetsdata?.slice(0, 3)?.map((event) => (
            <EventCard
              key={event?._id}
              event={event}
              onToggleFavorite={() => handleToggleFavorite(event)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
