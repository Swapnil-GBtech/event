"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, Users, TrendingUp, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import OrganizerEventsTable from "@/components/dashboard/OrganizerEventsTable"
import { fetchOrganizerStats } from "@/lib/api"
import { useAuth } from "@/lib/auth/auth-provider"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", attendees: 65 },
  { name: "Feb", attendees: 59 },
  { name: "Mar", attendees: 80 },
  { name: "Apr", attendees: 81 },
  { name: "May", attendees: 56 },
  { name: "Jun", attendees: 55 },
  { name: "Jul", attendees: 40 },
]

export default function OrganizerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalAttendees: 0,
    averageAttendees: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getStats = async () => {
      if (!user) return

      try {
        const data = await fetchOrganizerStats(user.id)
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getStats()
  }, [user])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Organizer Dashboard</h1>
          <p className="text-muted-foreground">Manage your events and view analytics</p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/events/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Events"
          value={stats.totalEvents}
          icon={Calendar}
          description="Events you've created"
          change="+3 this month"
          isLoading={isLoading}
          color="bg-blue-100 text-blue-600"
          variants={item}
        />
        <StatsCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={Calendar}
          description="Events yet to happen"
          change="Next on Jul 15"
          isLoading={isLoading}
          color="bg-green-100 text-green-600"
          variants={item}
        />
        <StatsCard
          title="Total Attendees"
          value={stats.totalAttendees}
          icon={Users}
          description="People attending your events"
          change="+120 this month"
          isLoading={isLoading}
          color="bg-purple-100 text-purple-600"
          variants={item}
        />
        <StatsCard
          title="Avg. Attendees"
          value={stats.averageAttendees}
          icon={TrendingUp}
          description="Average attendees per event"
          change="+12% from last month"
          isLoading={isLoading}
          color="bg-orange-100 text-orange-600"
          variants={item}
        />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-medium">Attendee Growth</CardTitle>
              <CardDescription>Monthly attendee count for your events</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              View Report
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendees" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>My Events</CardTitle>
            <CardDescription>Manage events you've created</CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizerEventsTable />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

interface StatsCardProps {
  title: string
  value: number
  icon: React.ElementType
  description: string
  change?: string
  isLoading: boolean
  color: string
  variants?: any
}

function StatsCard({ title, value, icon: Icon, description, change, isLoading, color, variants }: StatsCardProps) {
  return (
    <motion.div variants={variants} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`${color} p-2 rounded-full`}>
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
          ) : (
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
          )}
          <p className="text-xs text-muted-foreground">{description}</p>
          {change && (
            <p className="text-xs text-green-600 mt-2 flex items-center">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              {change}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
