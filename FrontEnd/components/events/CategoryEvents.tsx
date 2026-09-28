"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import EventCard from "@/components/events/EventCard"
import { Button } from "@/components/ui/button"
import type { Event } from "@/lib/types"
import { fetchEvents } from "@/lib/api"

interface CategoryEventsProps {
  slug: string
}

export default function CategoryEvents({ slug }: CategoryEventsProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsLoading(true)
        const allEvents = await fetchEvents(page)

        // Filter events by category
        const categoryEvents = allEvents.filter((event) => event.category.toLowerCase() === slug.toLowerCase())

        if (categoryEvents.length === 0) {
          setHasMore(false)
        } else {
          setEvents((prev) => (page === 1 ? categoryEvents : [...prev, ...categoryEvents]))
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getEvents()
  }, [slug, page])

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
  }

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
    <div className="container mx-auto px-4 py-12">
      {isLoading && page === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onToggleFavorite={() => handleToggleFavorite(event)}
                isFavorite={(() => {
                  const storedFavorites = localStorage.getItem("favoriteEvents")
                  const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : []
                  return favoriteIds.includes(event.id)
                })()}
              />
            ))}
          </motion.div>

          {isLoading && page > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="text-center mt-12">
              <Button size="lg" onClick={handleLoadMore} disabled={isLoading}>
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold mb-4">No events found</h3>
          <p className="text-gray-600 mb-8">
            There are no {slug} events available at the moment. Check back later or explore other categories.
          </p>
          <Button asChild>
            <a href="/events">Browse All Events</a>
          </Button>
        </div>
      )}
    </div>
  )
}
