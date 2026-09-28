"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Users, TrendingUp, Clock } from "lucide-react"
import { fetchStats } from "@/lib/api"

interface Stats {
  totalEvents: number
  upcomingEvents: number
  totalAttendees: number
  pastEvents: number
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalAttendees: 0,
    pastEvents: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchStats()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getStats()
  }, [])

  const statItems = [
    {
      icon: Calendar,
      value: stats.totalEvents,
      label: "Total Events",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Clock,
      value: stats.upcomingEvents,
      label: "Upcoming Events",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: TrendingUp,
      value: stats.pastEvents,
      label: "Past Events",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Users,
      value: stats.totalAttendees,
      label: "Total Attendees",
      color: "bg-orange-100 text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mr-4`}>
              <item.icon size={24} />
            </div>
            <div>
              {isLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
              ) : (
                <h3 className="text-2xl font-bold">{item.value.toLocaleString()}</h3>
              )}
              <p className="text-gray-600">{item.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
