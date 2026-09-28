"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Calendar, Users, Award, MapPin } from "lucide-react"
import { fetchStats } from "@/lib/api"
import { useRef } from "react"

interface Stats {
  totalEvents: number
  upcomingEvents: number
  totalAttendees: number
  locations: number
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalAttendees: 0,
    locations: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

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
      label: "Events Organized",
      color: "bg-blue-100 text-blue-600",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Award,
      value: stats.upcomingEvents,
      label: "Upcoming Events",
      color: "bg-green-100 text-green-600",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: Users,
      value: stats.totalAttendees,
      label: "Happy Attendees",
      color: "bg-purple-100 text-purple-600",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: MapPin,
      value: stats.locations,
      label: "Unique Locations",
      color: "bg-orange-100 text-orange-600",
      gradient: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity, scale }}
      className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-purple-500 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-blue-500 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 bg-white/10 text-white rounded-full text-sm font-medium mb-4">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Making Events Memorable</h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            We've helped thousands of people create unforgettable experiences. Here's a snapshot of our journey so far.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:bg-white/10 transition-colors duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div
                className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon size={28} />
              </div>
              {isLoading ? (
                <div className="h-10 bg-gray-700 rounded animate-pulse mb-2"></div>
              ) : (
                <motion.h3
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  className="text-4xl font-bold mb-2 text-white"
                >
                  {item.value.toLocaleString()}
                </motion.h3>
              )}
              <p className="text-gray-300 text-lg">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
