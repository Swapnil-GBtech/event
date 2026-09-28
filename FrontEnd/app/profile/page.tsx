"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Calendar, Heart, Settings, Edit3, MapPin, Clock, Star, Trophy, Gift, Camera } from "lucide-react"
 import { useAuth } from "@/lib/auth/auth-provider"
import { format } from "date-fns"
 import EditProfileModal from "@/components/Profile/EditProfileModel"
import Link from "next/link"
 import StatsCard from "@/components/Profile/StarCard"

export default function UserProfile() {
  const { auth } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)

  if (!auth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Please log in</h2>
          <p className="text-muted-foreground">You need to be logged in to view your profile</p>
        </div>
      </div>
    )
  }

  const stats = {
    totalRegistrations: auth.registered_attendees?.length || 0,
    favoriteEvents: auth.favorate_events?.length || 0,
    upcomingEvents: auth.registered_attendees?.filter((event) => new Date(event.Date) > new Date()).length || 0,
    pastEvents: auth.registered_attendees?.filter((event) => new Date(event.Date) <= new Date()).length || 0,
  }

  const memberSince = format(new Date(auth.createdAt), "MMMM yyyy")
  const lastUpdated = format(new Date(auth.updatedAt), "MMM dd, yyyy")

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
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto p-6 space-y-8 mt-10">
        {/* Profile Header */}
        <motion.div variants={item}>
          <Card className="relative overflow-hidden">
            {/* Background Pattern */}
            <div
              className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fillRule='evenodd'%3E%3Cg%20fill='%239C92AC'%20fillOpacity='0.05'%3E%3Ccircle%20cx='30'%20cy='30'%20r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-30`}
            />

            <CardContent className="relative p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar Section */}
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${auth.name}`} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {auth.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900">{auth.name}</h1>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      {auth.role}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{auth.email}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {memberSince}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Last updated {lastUpdated}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowEditModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Events"
            value={stats.totalRegistrations}
            icon={Calendar}
            description="Events registered"
            color="bg-blue-500"
            gradient="from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Favorites"
            value={stats.favoriteEvents}
            icon={Heart}
            description="Saved events"
            color="bg-red-500"
            gradient="from-red-500 to-pink-500"
          />
          <StatsCard
            title="Upcoming"
            value={stats.upcomingEvents}
            icon={Star}
            description="Events coming up"
            color="bg-green-500"
            gradient="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Completed"
            value={stats.pastEvents}
            icon={Trophy}
            description="Events attended"
            color="bg-purple-500"
            gradient="from-purple-500 to-indigo-500"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest event interactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {auth.registered_attendees?.slice(0, 5).map((event, index) => (
                  <div
                    key={event._id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                      {event.Event_title?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.Event_title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(event.Date), "MMM dd, yyyy")}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <Badge variant={new Date(event.Date) > new Date() ? "default" : "secondary"}>
                      {new Date(event.Date) > new Date() ? "Upcoming" : "Past"}
                    </Badge>
                  </div>
                ))}

                {stats.totalRegistrations === 0 && (
                  <div className="text-center py-8">
                    <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">No events yet</h3>
                    <p className="text-gray-500 mb-4">Start exploring amazing events!</p>
                    <Button asChild>
                      <Link href="/events">Browse Events</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions & Favorites */}
          <motion.div variants={item} className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/events">
                    <Calendar className="w-4 h-4 mr-2" />
                    Browse Events
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/dashboard">
                    <User className="w-4 h-4 mr-2" />
                    View Dashboard
                  </Link>
                </Button>
                
              </CardContent>
            </Card>

            {/* Favorite Events Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-red-500" />
                  Favorite Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                {auth.favorate_events?.length > 0 ? (
                  <div className="space-y-3">
                    {auth.favorate_events.slice(0, 3).map((event) => (
                      <div
                        key={event._id}
                        className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <h4 className="font-medium text-sm text-gray-900 mb-1">{event.Event_title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(event.Date), "MMM dd")}
                          <MapPin className="w-3 h-3 ml-2" />
                          {event.location}
                        </div>
                      </div>
                    ))}
                    {auth.favorate_events.length > 3 && (
                      <Button variant="ghost" size="sm" className="w-full">
                        View all {auth.favorate_events.length} favorites
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Heart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No favorite events yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
      <EditProfileModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} user={auth} />
    </>
  )
}
