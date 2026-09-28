"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Lock, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle,CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Users, Calendar, TrendingUp, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import EventsTable from "@/components/dashboard/EventsTable"
import UsersTable from "@/components/dashboard/UsersTable"
import CategoriesTable from "@/components/dashboard/CategoriesTable"
import { fetchDashboardStats } from "@/lib/api"
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { useAuth } from "@/lib/auth/auth-provider"
import { getAllEventsThunk } from "../ReduxSlices/CreateEventSlice"
import { getAllUsersThunk } from "../ReduxSlices/UserSlice"

const data = [
  { name: "Jan", events: 65, users: 120 },
  { name: "Feb", events: 59, users: 150 },
  { name: "Mar", events: 80, users: 200 },
  { name: "Apr", events: 81, users: 220 },
  { name: "May", events: 56, users: 250 },
  { name: "Jun", events: 55, users: 260 },
  { name: "Jul", events: 40, users: 280 },
]

const pieData = [
  { name: "Weddings", value: 400 },
  { name: "Concerts", value: 300 },
  { name: "Conferences", value: 300 },
  { name: "Seminars", value: 200 },
  { name: "Festivals", value: 100 },
]

const COLORS = ["#8b5cf6", "#6366f1", "#ec4899", "#f43f5e", "#f97316"]


export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalOrganizers: 0,
    totalAttendees: 0,
  })

  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useAppDispatch()
  const { auth } = useAuth()

  const { allevents, loading } = useAppSelector((state) => state.createEvents);
  const { allUsers } = useAppSelector((state) => state.user);


  const organizer = allUsers.filter((user) => user?.role === "organizer").length
  const attendee = allUsers.filter((user) => user?.role === "attendee").length


  useEffect(() => {
    dispatch(getAllEventsThunk());
    dispatch(getAllUsersThunk())
  }, [dispatch, auth]);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getStats()
  }, [])

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
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage events, users, and view analytics</p>
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
          value={allevents?.length}
          icon={Calendar}
          description="Events on the platform"
          change="+12% from last month"
          isLoading={isLoading}
          color="bg-blue-100 text-blue-600"
          variants={item}
        />
        <StatsCard
          title="Total Users"
          value={allUsers?.length}
          icon={Users}
          description="Registered users"
          change="+8% from last month"
          isLoading={isLoading}
          color="bg-purple-100 text-purple-600"
          variants={item}
        />
        <StatsCard
          title="Organizers"
          value={organizer}
          icon={Users}
          description="Event organizers"
          change="+5% from last month"
          isLoading={isLoading}
          color="bg-green-100 text-green-600"
          variants={item}
        />
        <StatsCard
          title="Attendees"
          value={attendee}
          icon={TrendingUp}
          description="Event attendees"
          change="+15% from last month"
          isLoading={isLoading}
          color="bg-orange-100 text-orange-600"
          variants={item}
        />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Growth Overview</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              View Report
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="events" stroke="#8b5cf6" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Event Categories</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              View All
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 rounded-full p-1 bg-gray-100">
            <TabsTrigger value="events" className="rounded-full data-[state=active]:bg-white">
              Events
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-full data-[state=active]:bg-white">
              Users
            </TabsTrigger>
            <TabsTrigger value="categories" className="rounded-full data-[state=active]:bg-white">
              Categories
            </TabsTrigger>
          </TabsList>


          <TabsContent value="events">
            <EventsTable />
          </TabsContent>




          <TabsContent value="users">
            <UsersTable />
          </TabsContent>


          <TabsContent value="categories">
            <CategoriesTable />
          </TabsContent>



        </Tabs>
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
