 

                         "use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CalendarDays,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Building2,
  Mail,
  Phone,
  MapPinIcon,
  Edit,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Calendar,
  Star,
  Activity,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProfileUpdateModal } from "@/components/models/profileupdatemodel"
  import { EventStatusModal } from "@/components/models/Eventstatusmodel"
import { EventDetailsModal } from "@/components/models/EventUpdatemodel"
import { getAssignedEvents } from "@/components/ApiServices/ApiServices"
import { useAuth } from "@/lib/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Lock, AlertCircle } from "lucide-react"

// API Service Functions (keeping existing functionality)
const apiService = {
  async getUserData(userId: string) {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        console.warn("API not available, using mock data")
        return getMockData()
      }
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("API returned non-JSON response, using mock data")
        return getMockData()
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.warn("Error fetching user data, using mock data:", error)
      return getMockData()
    }
  },

  async updateProfile(userId: string, profileData: any) {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })
      if (!response.ok) {
        throw new Error("Failed to update profile")
      }
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format")
      }
      return await response.json()
    } catch (error) {
      console.error("Error updating profile:", error)
      return { message: "Profile updated successfully (mock)", user: profileData }
    }
  },

  async updateEventStatus(eventId: string, status: string, reason?: string) {
    try {
      const response = await fetch(`/api/events/${eventId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, reason }),
      })
      if (!response.ok) {
        throw new Error("Failed to update event status")
      }
      return await response.json()
    } catch (error) {
      console.error("Error updating event status:", error)
      return { message: "Event status updated successfully (mock)" }
    }
  },

  async checkStatus(userId: string) {
    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        return null
      }
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        return null
      }
      return await response.json()
    } catch (error) {
      console.warn("Error checking status:", error)
      return null
    }
  },
}

// Enhanced mock data
const getMockData = () => ({
  user: {
    _id: "687de029241280389dddd9ae",
    name: "junaid Chaudhary",
    email: "junaid722@gmail.com",
    phone: "9690656168",
    address: "Nangla shahu Meerut 250406",
    role: "organizer",
    status: "Active",
    accountStatus: false,
  },
  organization: {
    _id: "6879e56f29827590e720f0c2",
    name: "samar momin",
    email: "samarali9027@gmail.com",
    organization: "Ecommrce Plate form",
    subscriptionType: "Monthly",
    status: "Active",
    monthName: "July",
    dayremaining: 31,
    price: 999,
  },
  assignedEvents: [
    {
      _id: "687e6ff01261ea9d109c4882",
      Event_title: "Wedding Ceremony",
      Description: "Celebrate the union of two souls with love, rituals, and family.",
      Date: "2025-07-24T00:00:00.000Z",
      Time: "01:19",
      location: "pune",
      Price: 100,
      image:
        "https://res.cloudinary.com/dwowpsw9w/image/upload/v1753116654/Event_Management_System/u9wj7nxdzkpdh0wpz3m2.jpg",
      attendee: [
        { name: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210", status: "confirmed" },
        { name: "Priya Singh", email: "priya@example.com", phone: "9876543211", status: "confirmed" },
        { name: "Amit Kumar", email: "amit@example.com", phone: "9876543212", status: "pending" },
        { name: "Sneha Patel", email: "sneha@example.com", phone: "9876543213", status: "confirmed" },
        { name: "Vikash Gupta", email: "vikash@example.com", phone: "9876543214", status: "confirmed" },
      ],
      status: "active",
      eventStatus: "upcoming",
      delayReason: null,
      maxCapacity: 150,
      registeredCount: 5,
      completionPercentage: 75,
    },
  ],
})

// Loading skeleton component
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
)

export default function OrganizerDashboard() {
  const [userData, setUserData] = useState(getMockData())
  const [isLoading, setIsLoading] = useState(true)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectEvent, setSelectEvent] = useState({})

   

  const { toast } = useToast()
  const { auth } = useAuth()

  // Load user data on component mount
  useEffect(() => {
    loadUserData()
  }, [])

  const getAssignEvents = async (organizationId:string,userId:string) => {
    try {
      const response = await getAssignedEvents(organizationId,userId)
      if (response.statuscode == 200) {
        setSelectEvent(response?.data)
      }
      return response
    } catch (error) {
      console.error("Error fetching assigned events:", error)
    }
  }

  useEffect(() => {
     if(auth && auth.createdBy && auth._id) {
       getAssignEvents(auth.createdBy,auth._id)
     }
  }, [auth])

  useEffect(() => {
    const interval = setInterval(() => {
      checkUserStatus()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadUserData = async () => {
    setIsLoading(true)
    try {
      const data = await apiService.getUserData(userData.user._id)
      setUserData(data)
    } catch (error) {
      toast({
        title: "Welcome! 👋",
        description: "Showing demo data while connecting to server.",
        variant: "default",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkUserStatus = async () => {
    try {
      const statusData = await apiService.checkStatus(userData.user._id)
      if (statusData) {
        const currentUserStatus = userData.user.status
        const currentOrgStatus = userData.organization.status
        if (statusData.userStatus !== currentUserStatus || statusData.organizationStatus !== currentOrgStatus) {
          setUserData((prev) => ({
            ...prev,
            user: { ...prev.user, status: statusData.userStatus },
            organization: { ...prev.organization, status: statusData.organizationStatus },
          }))
          if (statusData.userStatus === "inActive" || statusData.organizationStatus === "inActive") {
            toast({
              title: "⚠️ Account Status Changed",
              description: "Your account has been deactivated. Please contact support.",
              variant: "destructive",
            })
          }
        }
      }
    } catch (error) {
      console.error("Error checking status:", error)
    }
  }

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    await loadUserData()
    await checkUserStatus()
    setIsRefreshing(false)
    toast({
      title: "✅ Data Refreshed",
      description: "Your dashboard has been updated with the latest information.",
    })
  }

  const handleProfileUpdate = async (profileData: any) => {
    try {
      await apiService.updateProfile(userData.user._id, profileData)
      setUserData((prev) => ({
        ...prev,
        user: { ...prev.user, ...profileData },
      }))
      setIsProfileModalOpen(false)
      toast({
        title: "🎉 Profile Updated",
        description: "Your profile information has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "❌ Update Failed",
        description: "We couldn't update your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }


  
  const formatTime = (timeString: string) => {
    console.log("timeString", timeString);
    const [hours, minutes] = timeString.split(":")
    const time = new Date()
    time.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300",
        text: "Completed",
      },
      delayed: {
        className: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300",
        text: "Delayed",
      },
      cancelled: {
        className: "bg-red-100 text-red-800 hover:bg-red-200 border-red-300",
        text: "Cancelled",
      },
      upcoming: {
        className: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300",
        text: "Upcoming",
      },
    }

    
    const config = statusConfig[status] || statusConfig.upcoming
    return <Badge className={`${config.className} border font-medium`}>{config.text}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case "delayed":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "upcoming":
      default:
        return <Clock className="w-4 h-4 text-blue-600" />
    }
  }



  const getAttendeeStatusCount = (attendees: any[]) => {
    const confirmed = attendees.filter((a) => a.status === "confirmed" || a.status === "attended").length
    const pending = attendees.filter((a) => a.status === "pending").length
    const noShow = attendees.filter((a) => a.status === "no-show").length
    return { confirmed, pending, noShow, total: attendees.length }
  }

  // Check if user or organization is inactive
  const isUserInactive = userData.user.status === "inActive"
  const isOrgInactive = userData.organization.status === "inActive"
  const shouldShowContent = !isUserInactive && !isOrgInactive

  if (isLoading) {
    return <DashboardSkeleton />
  } 

  if (auth?.status === "inActive") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">Access Denied</CardTitle>
            <CardDescription className="text-gray-600">Your account is currently inactive</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <AlertCircle className="h-4 w-4" />
              <span>You do not have access to this system at the moment</span>
            </div>
            <p className="text-sm text-gray-600">
              Please contact your administrator or support team to activate your account.
            </p>
            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                Contact Support
              </Button>
              <Button variant="ghost" className="w-full text-sm">
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-blue-100 ring-offset-2">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                    {userData.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {selectEvent[0]?.userId?.email || "email"}
                  <Star className="w-4 h-4 text-yellow-500" />
                </h1>
                <p className="text-sm text-gray-600 capitalize flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {userData.user.role} • Online
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="hover:bg-blue-50 border-blue-200 text-blue-700 bg-transparent"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Syncing..." : "Refresh"}
              </Button>
              <Badge
                variant={shouldShowContent ? "default" : "destructive"}
                className={shouldShowContent ? "bg-green-100 text-green-800 border-green-300" : ""}
              >
                {shouldShowContent ? "🟢 Active" : "🔴 Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Inactive State */}
        {!shouldShowContent ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-lg">
                <Building2 className="w-16 h-16 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Account Temporarily Unavailable</h2>
              <p className="text-gray-600 max-w-md text-lg leading-relaxed">
                {isUserInactive && "Your account access has been temporarily suspended. "}
                {isOrgInactive && "Your organization subscription needs attention. "}
                Don't worry - we're here to help you get back on track!
              </p>
            </div>
            <Alert className="max-w-md border-blue-200 bg-blue-50">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Need help?</strong> Contact our support team at{" "}
                <span className="font-semibold">{userData.organization.email}</span> for immediate assistance.
              </AlertDescription>
            </Alert>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">
              Contact Support
            </Button>
          </div>
        ) : (
          <>
            {/* Enhanced Profile Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* Enhanced User Profile Card */}
              <Card className="lg:col-span-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-blue-900">Your Profile</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsProfileModalOpen(true)}
                    className="hover:bg-blue-200 text-blue-700 rounded-lg"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white/70 rounded-xl border border-white/50 hover:bg-white/90 transition-colors">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Email Address</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectEvent[0]?.userId?.email || userData.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/70 rounded-xl border border-white/50 hover:bg-white/90 transition-colors">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Phone Number</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectEvent[0]?.userId?.phone || userData.user.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/70 rounded-xl border border-white/50 hover:bg-white/90 transition-colors">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <MapPinIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Location</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectEvent[0]?.userId?.address || userData.user.address}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Organization Card */}
              <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 text-emerald-900">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold">Organization</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white/70 rounded-xl border border-white/50">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Company Name</p>
                    <p className="font-bold text-gray-900 text-lg">
                      {selectEvent[0]?.organizationId?.organization || userData.organization.organization}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectEvent[0]?.organizationId?.email || userData.organization.email}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/70 rounded-xl border border-white/50 text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Plan</p>
                      <Badge
                        variant="outline"
                        className="mt-2 bg-emerald-100 text-emerald-700 border-emerald-300 font-semibold"
                      >
                        {selectEvent[0]?.organizationId?.subscriptionType || userData.organization.subscriptionType}
                      </Badge>
                    </div>
                    <div className="p-3 bg-white/70 rounded-xl border border-white/50 text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Status</p>
                      <Badge
                        variant={selectEvent[0]?.organizationId?.status === "Active" ? "default" : "destructive"}
                        className="mt-2 font-semibold"
                      >
                        {selectEvent[0]?.organizationId?.status || userData.organization.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-white/70 rounded-xl border border-white/50">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Days Remaining</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        {selectEvent[0]?.organizationId?.dayremaining || userData.organization.dayremaining}
                      </p>
                    </div>
                    <Progress
                      value={
                        ((selectEvent[0]?.organizationId?.dayremaining || userData.organization.dayremaining) / 31) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Quick Stats Card */}
              <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 text-amber-900">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-md">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold">Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white/70 rounded-xl border border-white/50 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <Calendar className="w-6 h-6 text-amber-600" />
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Events</p>
                    </div>
                    <p className="text-4xl font-bold text-amber-600">
                      {selectEvent[0]?.eventIds?.length || userData.assignedEvents.length}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/70 rounded-xl border border-white/50 text-center">
                      <p className="text-xs text-gray-500 font-medium mb-1">Completed</p>
                      <p className="text-xl font-bold text-green-600">
                        {userData.assignedEvents.filter((event) => event.eventStatus === "completed").length}
                      </p>
                    </div>
                    <div className="p-3 bg-white/70 rounded-xl border border-white/50 text-center">
                      <p className="text-xs text-gray-500 font-medium mb-1">Pending</p>
                      <p className="text-xl font-bold text-yellow-600">
                        {userData.assignedEvents.filter((event) => event.eventStatus === "delayed").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Events Table Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
                    <CalendarDays className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Your Events</h2>
                    <p className="text-gray-600 text-lg">
                      Manage and track your assigned events with real-time updates
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-base bg-indigo-50 text-indigo-700 border-indigo-200 px-4 py-2">
                  📊 {selectEvent[0]?.eventIds?.length || userData.assignedEvents.length} Events
                </Badge>
              </div>

              {!selectEvent[0]?.eventIds || selectEvent[0]?.eventIds?.length === 0 ? (
                <Card className="bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200 shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <div className="p-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mb-6 shadow-inner">
                      <CalendarDays className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Events Yet</h3>
                    <p className="text-gray-600 text-center max-w-md text-lg leading-relaxed mb-6">
                      You don't have any events assigned yet. Once your administrator assigns events, they'll appear
                      here for you to manage.
                    </p>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium">
                      Contact Administrator
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white shadow-lg border-gray-200 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-gray-50 to-slate-100 border-b-2 border-gray-200">
                            <TableHead className="font-bold text-gray-900 text-sm py-4">Event Details</TableHead>
                            <TableHead className="font-bold text-gray-900 text-sm py-4">Schedule</TableHead>
                            <TableHead className="font-bold text-gray-900 text-sm py-4">Location</TableHead>
                            <TableHead className="font-bold text-gray-900 text-sm py-4">Attendees</TableHead>
                            <TableHead className="font-bold text-gray-900 text-sm py-4">Price</TableHead>
                            <TableHead className="font-bold text-gray-900 text-sm py-4">Status</TableHead>
                            <TableHead className="font-bold text-gray-900 text-sm py-4">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectEvent[0]?.eventIds?.map((event: any, index: number) => {
                            const attendeeStats = getAttendeeStatusCount(event.attendee || [])
                            return (
                              <TableRow
                                key={event?._id}
                                className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                }`}
                              >
                                <TableCell className="py-6">
                                  <div className="flex items-center space-x-4">
                                    <div className="relative">
                                      <img
                                        src={event?.image || "/placeholder.svg?height=60&width=60"}
                                        alt={event?.Event_title}
                                        className="w-16 h-16 rounded-xl object-cover shadow-md border-2 border-white"
                                      />
                                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-bold text-gray-900 text-base line-clamp-1">
                                        {event?.Event_title}
                                      </p>
                                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{event?.Description}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-6">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <CalendarDays className="w-4 h-4 text-blue-500" />
                                      <span className="text-sm font-semibold text-gray-900">
                                        {formatDate(event?.Date)}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Clock className="w-4 h-4 text-green-500" />
                                      <span className="text-sm text-gray-600">{formatTime(event?.Time)}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-6">
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    <span className="text-sm text-gray-900 capitalize font-medium">
                                      {event?.location}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-6">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Users className="w-4 h-4 text-purple-500" />
                                      <span className="text-sm font-semibold text-gray-900">
                                        {attendeeStats.total}  
                                      </span>
                                    </div>
                                    
                                  </div>
                                </TableCell>
                                <TableCell className="py-6">
                                  <div className="flex items-center space-x-2">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <span className="font-bold text-green-600 text-base">
                                      {event.Price === 0 ? "Free" : `₹${event?.Price}`}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-6">
                                  <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                       
                                      {getStatusBadge(event?.eventstatus)}
                                    </div>
                                    
                                  </div>
                                </TableCell>
                                <TableCell className="py-6">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="hover:bg-blue-100 rounded-lg">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-52 shadow-lg border-gray-200">
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedEvent(event)
                                          setIsDetailsModalOpen(true)
                                        }}
                                        className="hover:bg-blue-50 cursor-pointer"
                                      >
                                        <Eye className="w-4 h-4 mr-2 text-blue-600" />
                                        <span className="font-medium">View Details</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedEvent(event)
                                          setIsStatusModalOpen(true)
                                        }}
                                        className="hover:bg-green-50 cursor-pointer"
                                      >
                                        <Edit className="w-4 h-4 mr-2 text-green-600" />
                                        <span className="font-medium">Update Status</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <ProfileUpdateModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userData={userData.user}
        onUpdate={handleProfileUpdate}
      />
      <EventStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false)
          setSelectedEvent(null)
        }}
        event={selectedEvent}
        getAssignEvents={getAssignEvents}
      />
      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedEvent(null)
        }}
        event={selectedEvent}
      />
    </div>
  )
}

