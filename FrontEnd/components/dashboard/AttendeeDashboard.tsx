// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Calendar, Clock, CheckCircle, ArrowUpRight, Search } from "lucide-react"
// import { motion } from "framer-motion"
// import AttendeeBookingsTable from "@/components/dashboard/AttendeeBookingsTable"
// import { fetchAttendeeStats } from "@/lib/api"
// import { useAuth } from "@/lib/auth/auth-provider"
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

// const data = [
//   { name: "Upcoming", value: 3 },
//   { name: "Past", value: 12 },
// ]

// const COLORS = ["#8b5cf6", "#6366f1"]

// export default function AttendeeDashboard() {
//   const { auth } = useAuth()
//   const [stats, setStats] = useState({
//     upcomingEvents: 0,
//     pastEvents: 0,
//     totalBookings: 0,
//   })
//   const [isLoading, setIsLoading] = useState(false)

  
//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   }

//   const item = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0 },
//   }

//   return (
//     <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold gradient-text">My Dashboard</h1>
//           <p className="text-muted-foreground">Manage your event bookings</p>
//         </div>
//         <Button asChild className="rounded-full">
//           <Link href="/events">
//             <Search className="mr-2 h-4 w-4" />
//             Browse Events
//           </Link>
//         </Button>
//       </div>

//       <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <StatsCard
//           title="Upcoming Events"
//           value={stats.upcomingEvents}
//           icon={Calendar}
//           description="Events you're attending soon"
//           change="Next on Jul 15"
//           isLoading={isLoading}
//           color="bg-blue-100 text-blue-600"
//           variants={item}
//         />
//         <StatsCard
//           title="Past Events"
//           value={stats.pastEvents}
//           icon={Clock}
//           description="Events you've attended"
//           change="Last on Jun 20"
//           isLoading={isLoading}
//           color="bg-purple-100 text-purple-600"
//           variants={item}
//         />
//         <StatsCard
//           title="Total Bookings"
//           value={auth?.registered_attendees?.length}
//           icon={CheckCircle}
//           description="All your event registrations"
//           change="+2 this month"
//           isLoading={isLoading}
//           color="bg-green-100 text-green-600"
//           variants={item}
//         />
//       </motion.div>

//       <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <div>
//               <CardTitle className="text-lg font-medium">Event Distribution</CardTitle>
//               <CardDescription>Upcoming vs past events</CardDescription>
//             </div>
//             <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
//               View Details
//               <ArrowUpRight className="ml-1 h-3 w-3" />
//             </Button>
//           </CardHeader>
//           <CardContent className="pt-6">
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={data}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {data.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle>My Bookings</CardTitle>
//             <CardDescription>Manage your event registrations</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <AttendeeBookingsTable />
//           </CardContent>
//         </Card>
//       </motion.div>
//     </motion.div>
//   )
// }

// interface StatsCardProps {
//   title: string
//   value: number
//   icon: React.ElementType
//   description: string
//   change?: string
//   isLoading: boolean
//   color: string
//   variants?: any
// }

// function StatsCard({ title, value, icon: Icon, description, change, isLoading, color, variants }: StatsCardProps) {
//   return (
//     <motion.div variants={variants} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
//       <Card className="overflow-hidden">
//         <CardHeader className="flex flex-row items-center justify-between pb-2">
//           <CardTitle className="text-sm font-medium">{title}</CardTitle>
//           <div className={`${color} p-2 rounded-full`}>
//             <Icon className="h-4 w-4" />
//           </div>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-1"></div>
//           ) : (
//             <div className="text-2xl font-bold">{value.toLocaleString()}</div>
//           )}
//           <p className="text-xs text-muted-foreground">{description}</p>
//           {change && (
//             <p className="text-xs text-green-600 mt-2 flex items-center">
//               <ArrowUpRight className="mr-1 h-3 w-3" />
//               {change}
//             </p>
//           )}
//         </CardContent>
//       </Card>
//     </motion.div>
//   )
// }





"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, ArrowUpRight, Search, Heart, Star, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import AttendeeBookingsTable from "@/components/dashboard/AttendeeBookingsTable"
import { useAuth } from "@/lib/auth/auth-provider"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export default function AttendeeDashboard() {
  const { auth } = useAuth()
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    pastEvents: 0,
    totalBookings: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  // Calculate stats from user data
  useEffect(() => {
    if (auth?.registered_attendees) {
      const now = new Date()
      const upcoming = auth.registered_attendees.filter((event) => new Date(event.Date) > now).length
      const past = auth.registered_attendees.filter((event) => new Date(event.Date) <= now).length

      setStats({
        upcomingEvents: upcoming,
        pastEvents: past,
        totalBookings: auth.registered_attendees.length,
      })
    }
  }, [auth])

  const pieData = [
    { name: "Upcoming", value: stats.upcomingEvents },
    { name: "Past", value: stats.pastEvents },
  ]

  const COLORS = ["#8b5cf6", "#6366f1"]

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
          <h1 className="text-3xl font-bold gradient-text">Welcome back, {auth?.name}! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your events</p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/events">
            <Search className="mr-2 h-4 w-4" />
            Browse Events
          </Link>
        </Button>
      </div>

      <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Registrations"
          value={auth?.registered_attendees?.length || 0}
          icon={CheckCircle}
          description="Events you've registered for"
          change={`${stats.upcomingEvents} upcoming`}
          isLoading={isLoading}
          color="bg-green-100 text-green-600"
          variants={item}
        />
        <StatsCard
          title="Favorite Events"
          value={auth?.favorate_events?.length || 0}
          icon={Heart}
          description="Events you've saved"
          change="Your wishlist"
          isLoading={isLoading}
          color="bg-red-100 text-red-600"
          variants={item}
        />
        <StatsCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={Calendar}
          description="Events coming up"
          change={stats.upcomingEvents > 0 ? "Don't miss out!" : "No events yet"}
          isLoading={isLoading}
          color="bg-blue-100 text-blue-600"
          variants={item}
        />
        <StatsCard
          title="Events Attended"
          value={stats.pastEvents}
          icon={Star}
          description="Completed events"
          change="Great memories!"
          isLoading={isLoading}
          color="bg-purple-100 text-purple-600"
          variants={item}
        />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-medium">Event Distribution</CardTitle>
              <CardDescription>Your event timeline</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              View Details
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {stats.totalBookings > 0 ? (
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No events registered yet</p>
                <Button asChild className="mt-4" size="sm">
                  <Link href="/events">Find Events</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>Manage your event registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendeeBookingsTable />
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
            <p className="text-xs text-blue-600 mt-2 flex items-center">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              {change}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
