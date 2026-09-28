
"use client"

import { useEffect, useState } from "react"
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  BarChart3,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  Plus,
  Clock,
  CreditCard,
  PieChartIcon,
  ArrowUpRight,
  Target,
  Search,
  CalendarDays,
  ArrowDownRight,
  Info,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
 import { getEventsRevenue,getAllPayments } from "../ApiServices/ApiServices"
 import { useAuth } from "@/lib/auth/auth-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
 
import { Separator } from "@/components/ui/separator"
 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import EventRevenueDashboard from "./earningeventwise"
import PaymentHistory from "./paymentshistory"

 

  function RevenueDashboard() {
   
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("events")
  const[eventRevenue,setEventRevenue] = useState({})
  const[loader,setLoader] = useState(false)
  const[paymentshisstry,setPaymentHistry] = useState({})

   const { auth } = useAuth()

  useEffect(()=>{
    const getEventsRevenueData = async()=>{
        try {
          setLoader(true)
           const response = await getEventsRevenue(auth?._id)
           if(response?.statuscode==200){
              setEventRevenue(response?.data)
              setLoader(false)
           }
        } catch (error) {
          
        }
    }

    const getAllpaymentsHistry = async()=>{
         try {
           const response = await getAllPayments(auth?._id)
           if(response?.statuscode==200){
              setPaymentHistry(response?.data)
           }
         } catch (error) {
          
         }
    }

     if(auth?._id){
        Promise.all([getEventsRevenueData(),getAllpaymentsHistry()]).finally(()=>{
          setLoader(false)
        })
     }
  },[auth])

 
  

  const topEvents = [
    {
      name: "Summer Festival",
      revenue: 800000,
      commission: 16000,
      tickets: 3200,
      avgPrice: 250,
      status: "completed",
      organizer: "TechCorp Ltd",
      date: "2024-06-15",
    },
    {
      name: "Innovation Conference",
      revenue: 700000,
      commission: 14000,
      tickets: 2800,
      avgPrice: 250,
      status: "active",
      organizer: "EventPro",
      date: "2024-07-20",
    },
    {
      name: "Startup Expo",
      revenue: 600000,
      commission: 12000,
      tickets: 2000,
      avgPrice: 300,
      status: "upcoming",
      organizer: "BizEvents",
      date: "2024-08-10",
    },
    {
      name: "Tech Conference",
      revenue: 450000,
      commission: 9000,
      tickets: 1800,
      avgPrice: 250,
      status: "completed",
      organizer: "Innovation Hub",
      date: "2024-05-25",
    },
    {
      name: "Art Exhibition",
      revenue: 520000,
      commission: 10400,
      tickets: 2600,
      avgPrice: 200,
      status: "active",
      organizer: "Creative Space",
      date: "2024-07-01",
    },
  ]

 
  const recentTransactions = [
    {
      id: "TXN001",
      event: "Summer Festival",
      amount: 25000,
      status: "completed",
      date: "2024-07-20",
      organizer: "TechCorp Ltd",
    },
    {
      id: "TXN002",
      event: "Innovation Conference",
      amount: 18000,
      status: "pending",
      date: "2024-07-19",
      organizer: "EventPro",
    },
    {
      id: "TXN003",
      event: "Art Exhibition",
      amount: 12000,
      status: "completed",
      date: "2024-07-18",
      organizer: "Creative Space",
    },
    {
      id: "TXN004",
      event: "Startup Expo",
      amount: 30000,
      status: "failed",
      date: "2024-07-17",
      organizer: "BizEvents",
    },
    {
      id: "TXN005",
      event: "Tech Conference",
      amount: 22000,
      status: "completed",
      date: "2024-07-16",
      organizer: "Innovation Hub",
    },
  ]

  const calculatePercentageChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100
    return change.toFixed(1)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num)
  }

  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amt)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-200",
      upcoming: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-gray-100 text-gray-800 border-gray-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      failed: "bg-red-100 text-red-800 border-red-200",
    }
    return variants[status as keyof typeof variants] || variants.completed
  }

  const filteredEvents = topEvents.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50/50">
         

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
              {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}
              <TabsTrigger value="events">Events</TabsTrigger>
              {/* <TabsTrigger value="organizers">Organizers</TabsTrigger> */}
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            

            <TabsContent value="events" className="space-y-6">
                <EventRevenueDashboard eventRevenue={eventRevenue}/>
            </TabsContent>

          

            <TabsContent value="transactions" className="space-y-6">
                <PaymentHistory paymentshistry={paymentshisstry}/>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  )
}


export default RevenueDashboard

