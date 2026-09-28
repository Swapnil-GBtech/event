
"use client"

import { useState, useEffect } from "react"
import {
  ArrowUpRight,
  Users,
  Calendar,
  IndianRupee,
  Award,
   
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-provider"
import { 
    getRevenue, 
    getAllOrganizerAndAttendee, 
    getEvents, 
    getTopPayments,
    getMonthlyRevenue

} from "../ApiServices/ApiServices"
 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
 
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import MonthlyRevenueDashboard from "./monthlyRevenueChartWise"

function AdminDashboardHome() {
  // Your original state variables
  const [totalrevenue, setTotalRevenue] = useState({})
  const [users, setUsers] = useState({})
  const [allevents, setAllEvents] = useState({})
  const [bestperformenceevent, setBestPerformenceEvent] = useState({})
  const [loading, setLoading] = useState(true)
  const [monthlyRevenue, setMonthlyRevenue] = useState({})

 


  const { auth } = useAuth()

  // Your original API calls
  useEffect(() => {
    const handlegetpayment = async () => {
      try {
        const response = await getRevenue(auth?._id)
        if (response?.statuscode == 200) {
          setTotalRevenue(response?.data)
        }
      } catch (error) {
        console.error("Error fetching revenue:", error)
      }
    }

    const getUsers = async () => {
      try {
        const response = await getAllOrganizerAndAttendee(auth?._id)
        if (response?.statuscode == 200) {
          setUsers(response?.data)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    const getAllEvents = async () => {
      try {
        const response = await getEvents(auth?._id)
        if (response?.statuscode == 201) {
          setAllEvents(response?.data)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    const getBestPerformenceEvent = async () => {
      try {
        const response = await getTopPayments(auth?._id)
        if (response?.statuscode == 200) {
          setBestPerformenceEvent(response?.data)
        }
      } catch (error) {
        console.error("Error fetching top payments:", error)
      }
    }
 
      const getMonthlyRevenues = async () => {
      try {
       
        const response = await getMonthlyRevenue(auth?._id)
         console.log("month",response)
        if (response?.statuscode == 200) {
          setMonthlyRevenue(response?.data)
        }
      } catch (error) {
        console.error("Error fetching monthly revenue:", error)
      }
    }
    

    if (auth?._id) {
      setLoading(true)
      Promise.all([getBestPerformenceEvent(), getAllEvents(), getUsers(), handlegetpayment(),getMonthlyRevenues()]).finally(() => {
        setLoading(false)
      })
    }
  }, [auth])



  const formatCurrency = (amount:any) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0)
  }

  const formatNumber = (num:any) => {
    return new Intl.NumberFormat("en-IN").format(num || 0)
  }

  const getInitials = (name:any) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  
  // Create pie chart data from your API response
  const pieData = bestperformenceevent?.totalAdmin
    ? [
        { name: "Admin Revenue", value: bestperformenceevent?.totalAdmin, color: "#3b82f6" },
        // { name: "Super Admin Commission", value: bestperformenceevent.totalSuperAdmin, color: "#10b981" },
      ]
    : []

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Stats Cards - Using your API data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <IndianRupee className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalrevenue?.totalRevenue)}</div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+14.2%</span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>

        
          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              <Users className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(users?.Users?.length)}</div>
              <p className="text-sm text-gray-500 mt-2">Active platform users</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
              <Calendar className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(allevents?.length)}</div>
              <p className="text-sm text-gray-500 mt-2">Events created</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Revenue Chart */}


          <Card>
             <MonthlyRevenueDashboard monthlyRevenue={monthlyRevenue}/>
          </Card>

          {/* Top Event Performance - Using your API data */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                Top Event Performance
              </CardTitle>
              <CardDescription>Best performing event this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bestperformenceevent?._id ? (
                <>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 capitalize">{bestperformenceevent._id}</h3>
                    <div className="text-3xl font-bold text-yellow-600">
                      {formatCurrency(bestperformenceevent?.totalAmount)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Price:</span>
                      <span className="font-semibold">{formatCurrency(bestperformenceevent.averagePrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Participants:</span>
                      <span className="font-semibold">{bestperformenceevent.usernames?.length || 0}</span>
                    </div>
                    
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Participants</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {bestperformenceevent.usernames?.map((username, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">{getInitials(username)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{username}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No event data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

 
      </div>
    </div>
  )
}

export default AdminDashboardHome
