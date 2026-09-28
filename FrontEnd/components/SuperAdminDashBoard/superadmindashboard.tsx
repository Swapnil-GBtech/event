 
// "use client"

// import { useState, useEffect } from "react"
// import type React from "react"
// import { getAllAdminPayments } from "../ApiServices/ApiServices"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { useAppDispatch, useAppSelector } from "@/lib/store"
// import { registerUserThunk, setFormData, resetFormData } from "../ReduxSlices/UserSlice"
// import { Loader2 } from "lucide-react"
// import { useToast } from "../ui/use-toast"
// import { useAuth } from "@/lib/auth/auth-provider"
// import { updateSubscriptionStatus } from "../ApiServices/ApiServices"
// import {
//   Calendar,
//   CreditCard,
//   LogOut,
//   MoreHorizontal,
//   Plus,
//   Search,
//   Shield,
//   TrendingUp,
//   Users,
//   UserX,
//   X,
//   DollarSign,
//   Receipt,
//   Download,
//   Eye,
//   BarChart3,
//   PieChart,
// } from "lucide-react"
// import { getAllAdmins } from "../ApiServices/ApiServices"
// import AdminPaymentSheet from "../paymentsModel/adminPaymentModel"
// import { DeleteUser } from "../ApiServices/ApiServices"

// interface AdminInfo {
//   name: string
//   email: string
// }

// interface SuperAdminDashboardProps {
//   adminInfo: AdminInfo
//   onLogout: () => void
// }

// interface PaymentData {
//   _id: string
//   orderId: string
//   paymentId: string
//   signature: string
//   amount: number
//   currency: string
//   username: string
//   ordername: string
//   organizationId: string
//   role: string
//   status: string
//   monthName: string
//   createdAt: string
//   updatedAt: string
// }

// const mockAdmins = [
//   {
//     id: 1,
//     name: "Rajesh Kumar",
//     email: "rajesh@company.com",
//     company: "Tech Solutions Pvt Ltd",
//     subscriptionType: "Monthly",
//     subscriptionStatus: "Active",
//     daysRemaining: 15,
//     totalEvents: 45,
//     lastLogin: "2024-01-15",
//     autoRenewal: true,
//   },
//   {
//     id: 2,
//     name: "Priya Sharma",
//     email: "priya@events.com",
//     company: "Event Masters",
//     subscriptionType: "Yearly",
//     subscriptionStatus: "Active",
//     daysRemaining: 120,
//     totalEvents: 78,
//     lastLogin: "2024-01-14",
//     autoRenewal: false,
//   },
//   {
//     id: 3,
//     name: "Amit Singh",
//     email: "amit@weddings.in",
//     company: "Wedding Planners",
//     subscriptionType: "Monthly",
//     subscriptionStatus: "Expiring Soon",
//     daysRemaining: 3,
//     totalEvents: 23,
//     lastLogin: "2024-01-13",
//     autoRenewal: true,
//   },
//   {
//     id: 4,
//     name: "Sneha Patel",
//     email: "sneha@corporate.com",
//     company: "Corporate Events Co",
//     subscriptionType: "Monthly",
//     subscriptionStatus: "Expired",
//     daysRemaining: -2,
//     totalEvents: 67,
//     lastLogin: "2024-01-10",
//     autoRenewal: false,
//   },
// ]

// export default function SuperAdminDashboard({ adminInfo, onLogout }: SuperAdminDashboardProps) {
//   const [admins, setAdmins] = useState(mockAdmins)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [paymentSearchTerm, setPaymentSearchTerm] = useState("")
//   const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false)
//   const [adminPaymentData, setAdminPaymentData] = useState<PaymentData[]>([])
//   const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false)
//   const [activeTab, setActiveTab] = useState("admins")
//   const [paymentFilter, setPaymentFilter] = useState("all")
//   const [dateFilter, setDateFilter] = useState("all")

//   const { loading, formdata } = useAppSelector((state) => state.user)
//   const dispatch = useAppDispatch()
//   const [subscriptionStatus, setSubScriptionStatus] = useState("Active")
//   const auth = useAuth()
//   const { toast } = useToast()

//   const filteredAdmins = admins?.filter(
//     (admin) =>
//       admin?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       admin?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       admin?.organization?.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   const filteredPayments = adminPaymentData?.filter((payment) => {
//     const matchesSearch =
//       payment.username.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
//       payment.orderId.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
//       payment.paymentId.toLowerCase().includes(paymentSearchTerm.toLowerCase())

//     const matchesFilter = paymentFilter === "all" || payment.ordername.toLowerCase() === paymentFilter.toLowerCase()

//     const matchesDate = dateFilter === "all" || payment.monthName.toLowerCase() === dateFilter.toLowerCase()

//     return matchesSearch && matchesFilter && matchesDate
//   })

//   // Calculate payment statistics
//   const totalRevenue = adminPaymentData?.reduce((sum, payment) => sum + payment.amount, 0) || 0
//   const monthlyRevenue =
//     adminPaymentData?.filter((p) => p.ordername === "Monthly").reduce((sum, payment) => sum + payment.amount, 0) || 0
//   const yearlyRevenue =
//     adminPaymentData?.filter((p) => p.ordername === "Yearly").reduce((sum, payment) => sum + payment.amount, 0) || 0
//   const totalTransactions = adminPaymentData?.length || 0
//   const successfulPayments = adminPaymentData?.filter((p) => p.status === "paid").length || 0

//   // Monthly breakdown
//   const monthlyBreakdown = adminPaymentData?.reduce(
//     (acc, payment) => {
//       const month = payment.monthName
//       if (!acc[month]) {
//         acc[month] = { count: 0, amount: 0 }
//       }
//       acc[month].count += 1
//       acc[month].amount += payment.amount
//       return acc
//     },
//     {} as Record<string, { count: number; amount: number }>,
//   )


//     const handleDeleteUser = async(userId:string)=>{
//          try {
//             const response = await DeleteUser(auth?._id,userId)
//             if(response?.statuscode == 200){
//                toast({
//                   title: "User Deleted Successfully",
//                   duration: 3000,
//                })
//             }
//          } catch (error) {
//             toast({
//                title: "Error",
//                description: error?.response?.data?.message || "Something went wrong while deleting user.",
//                variant: "destructive",
//             })
//          }
//     }

//   const totalAdmins = admins?.length
//   const activeSubscriptions = admins?.filter((admin) => admin?.status === "Active").length
//   const expiringSoon = admins?.filter((admin) => admin?.status === "Expiring Soon").length


//     const handleAdminPayments = async () => {
//       try {
//         const response = await getAllAdminPayments(auth?.auth?._id)
//         if (response?.statuscode == 200) {
//           setAdminPaymentData(response?.data || [])
//         }
//       } catch (error) {
//         console.error("Error fetching payments:", error)
//       }
//     }

//   useEffect(() => {
//     if (auth?.auth?._id) {
//       handleAdminPayments()
//     }
//   }, [auth])

//   const handleCloseSubscription = (adminId: number) => {
//     setAdmins(
//       admins?.map((admin) =>
//         admin.id === adminId
//           ? { ...admin, subscriptionStatus: "Expired", daysRemaining: 0, autoRenewal: false }
//           : admin,
//       ),
//     )
//     toast({
//       title: "Subscription Closed",
//       description: "Admin subscription has been successfully closed.",
//     })
//   }

//   const fetchAdmins = async () => {
//     try {
//       const admins = await getAllAdmins()
//       setAdmins(admins?.data)
//     } catch (error) {
//       console.error("Error fetching admins:", error)
//     }
//   }

//   useEffect(() => {
//     fetchAdmins()
//   }, [auth])

//   const handleSubScriptionStatus = async (status: "Active" | "inActive", userId: string) => {
//     try {
//       setSubScriptionStatus(status)
//       const data = {
//         status: status,
//         userID: userId,
//       }
//       const response = await updateSubscriptionStatus(data)
//       if (response?.statuscode == 200) {
//         toast({
//           title: "Status updated",
//           description: response?.message || "Your status has been updated successfully.",
//         })
//         fetchAdmins()
//       } else {
//         toast({
//           title: "Error",
//           description: response?.response?.data?.message || "Something went wrong while updating your status.",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error?.response?.data?.message || "Something went wrong while updating your status.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCreateAdmin = async () => {
//     try {
//       const response = await dispatch(registerUserThunk(formdata))
//       if (response.type === "user/registerUserThunk/fulfilled" && response.payload?.statuscode === 201) {
//         toast({
//           title: "Account created",
//           description: response.payload.message || "Your account has been created successfully.",
//         })
//         dispatch(resetFormData())
//         fetchAdmins()
//         setIsCreateSheetOpen(false)
//         setIsPaymentSheetOpen(false)
//       } else {
//         toast({
//           title: "Error",
//           description: response.payload || "Something went wrong while creating your account.",
//           variant: "destructive",
//         })
//       }
//       dispatch(resetFormData())
//       setIsCreateSheetOpen(false)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Something went wrong while creating your account.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleChangeFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     dispatch(
//       setFormData({
//         ...formdata,
//         [name]: value,
//         role: "admin",
//       }),
//     )
//   }

//   const handleSelectChange = (name: string, value: string) => {
//     dispatch(
//       setFormData({
//         ...formdata,
//         [name]: value,
//         role: "admin",
//         price: value === "Monthly" ? "999" : "9999",
//       }),
//     )
//   }

//   const handleProceedToPayment = () => {
//     if (
//       !formdata?.name ||
//       !formdata?.email ||
//       !formdata?.password ||
//       !formdata?.organization ||
//       !formdata?.subscriptionType
//     ) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all required fields before proceeding to payment.",
//         variant: "destructive",
//       })
//       return
//     }
//     setIsPaymentSheetOpen(true)
//   }

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "Active":
//         return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-poppins">Active</Badge>
//       case "Expiring Soon":
//         return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 font-poppins">Expiring Soon</Badge>
//       case "Expired":
//         return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 font-poppins">Expired</Badge>
//       default:
//         return (
//           <Badge variant="secondary" className="font-poppins">
//             {status}
//           </Badge>
//         )
//     }
//   }

//   const getPaymentStatusBadge = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "paid":
//         return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
//       case "pending":
//         return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
//       case "failed":
//         return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
//       default:
//         return <Badge variant="secondary">{status}</Badge>
//     }
//   }

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     }).format(amount / 100) // Assuming amount is in paise
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   const handleLogout = () => {
//     toast({
//       title: "Logged Out",
//       description: "You have been successfully logged out.",
//     })
//     setTimeout(() => {
//       onLogout()
//     }, 1000)
//   }

//   return (
//     <>
//       {isPaymentSheetOpen && (
//         <AdminPaymentSheet
//           formdata={formdata}
//           handleCreateAdmin={handleCreateAdmin}
//           isSheetOpen={isPaymentSheetOpen}
//           setIsSheetOpen={setIsPaymentSheetOpen}
//           handleAdminPayments={handleAdminPayments}
//         />
//       )}
//       <div className="min-h-screen bg-gray-50/50 font-poppins">
//         <div className="flex h-screen">
//           {/* Sidebar */}
//           <div className="w-64 bg-white shadow-lg">
//             <div className="p-6">
//               <div className="flex items-center gap-2">
//                 <Shield className="h-8 w-8 text-blue-600" />
//                 <div>
//                   <h1 className="text-lg font-bold text-gray-900 font-poppins">EventMaster Pro</h1>
//                   <p className="text-xs text-gray-500 font-inter">Super Admin</p>
//                 </div>
//               </div>
//             </div>
//             <nav className="px-4 space-y-2">
//               <button
//                 onClick={() => setActiveTab("admins")}
//                 className={`flex items-center gap-3 px-3 py-3 text-sm font-medium w-full text-left font-poppins ${
//                   activeTab === "admins" ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
//                 }`}
//               >
//                 <Users className="h-4 w-4" />
//                 Admin Management
//               </button>
//               <button
//                 onClick={() => setActiveTab("payments")}
//                 className={`flex items-center gap-3 px-3 py-3 text-sm font-medium w-full text-left font-poppins ${
//                   activeTab === "payments" ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
//                 }`}
//               >
//                 <CreditCard className="h-4 w-4" />
//                 Payment History
//               </button>
//               <button
//                 onClick={() => setActiveTab("analytics")}
//                 className={`flex items-center gap-3 px-3 py-3 text-sm font-medium w-full text-left font-poppins ${
//                   activeTab === "analytics" ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
//                 }`}
//               >
//                 <BarChart3 className="h-4 w-4" />
//                 Revenue Analytics
//               </button>
//             </nav>
//             {/* Admin Info & Logout */}
//             <div className="absolute bottom-4 left-4 right-4 space-y-3">
//               <Button
//                 onClick={handleLogout}
//                 variant="outline"
//                 className="justify-start bg-transparent hover:bg-red-50 hover:text-red-600 font-poppins px-3 py-2 w-full"
//               >
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Logout
//               </Button>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 overflow-auto">
//             <div className="p-8">
//               <div className="mb-8">
//                 <h1 className="text-3xl font-bold text-gray-900 font-poppins">
//                   {activeTab === "admins" && "Admin Management Dashboard"}
//                   {activeTab === "payments" && "Payment History Dashboard"}
//                   {activeTab === "analytics" && "Revenue Analytics Dashboard"}
//                 </h1>
//                 <p className="text-gray-600 mt-2 font-inter">
//                   {activeTab === "admins" && "Manage all admin users and their subscriptions"}
//                   {activeTab === "payments" && "Track all payment transactions and billing history"}
//                   {activeTab === "analytics" && "Analyze revenue trends and financial insights"}
//                 </p>
//               </div>

//               {/* Enhanced Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 <Card className="shadow-sm">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium font-poppins">Total Revenue</CardTitle>
//                     <DollarSign className="h-4 w-4 text-muted-foreground" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold font-poppins text-green-600">{formatCurrency(totalRevenue)}</div>
//                     <p className="text-xs text-muted-foreground font-inter">From {totalTransactions} transactions</p>
//                   </CardContent>
//                 </Card>

//                 <Card className="shadow-sm">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium font-poppins">Total Admins</CardTitle>
//                     <Users className="h-4 w-4 text-muted-foreground" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold font-poppins">{totalAdmins}</div>
//                     <p className="text-xs text-muted-foreground font-inter">Active users on platform</p>
//                   </CardContent>
//                 </Card>

//                 <Card className="shadow-sm">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium font-poppins">Success Rate</CardTitle>
//                     <TrendingUp className="h-4 w-4 text-muted-foreground" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold text-green-600 font-poppins">
//                       {totalTransactions > 0 ? Math.round((successfulPayments / totalTransactions) * 100) : 0}%
//                     </div>
//                     <p className="text-xs text-muted-foreground font-inter">
//                       {successfulPayments} of {totalTransactions} payments
//                     </p>
//                   </CardContent>
//                 </Card>

//                 <Card className="shadow-sm">
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium font-poppins">Monthly vs Yearly</CardTitle>
//                     <PieChart className="h-4 w-4 text-muted-foreground" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold font-poppins">
//                       {formatCurrency(monthlyRevenue)} / {formatCurrency(yearlyRevenue)}
//                     </div>
//                     <p className="text-xs text-muted-foreground font-inter">Monthly / Yearly revenue</p>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Tab Content */}
//               {activeTab === "admins" && (
//                 <Card className="shadow-sm">
//                   <CardHeader>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <CardTitle className="font-poppins">Admin Users</CardTitle>
//                         <CardDescription className="font-inter">
//                           Manage all admin accounts and their subscriptions
//                         </CardDescription>
//                       </div>
//                       <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
//                         <SheetTrigger asChild>
//                           <Button className="font-poppins">
//                             <Plus className="h-4 w-4 mr-2" />
//                             Create Admin
//                           </Button>
//                         </SheetTrigger>
//                         <SheetContent
//                           side="right"
//                           className="w-full sm:w-[400px] md:w-[600px] lg:w-[700px] xl:w-[800px] max-w-none sm:max-w-none md:max-w-none lg:max-w-none xl:max-w-none rounded-l-3xl rounded-bl-3xl overflow-y-auto"
//                         >
//                           <SheetHeader className="pb-6">
//                             <SheetTitle className="flex items-center justify-between text-xl">
//                               <span>Create New Admin</span>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => setIsCreateSheetOpen(false)}
//                                 disabled={loading}
//                               >
//                                 <X className="h-4 w-4" />
//                               </Button>
//                             </SheetTitle>
//                             <SheetDescription className="font-inter">
//                               Add a new admin user to the event management system.
//                             </SheetDescription>
//                           </SheetHeader>
//                           <div className="space-y-6 pb-6">
//                             <div className="grid gap-4">
//                               <div className="grid gap-2">
//                                 <Label htmlFor="name" className="font-poppins">
//                                   Full Name *
//                                 </Label>
//                                 <Input
//                                   id="name"
//                                   name="name"
//                                   value={formdata?.name || ""}
//                                   onChange={(e) => handleChangeFormData(e)}
//                                   placeholder="Enter full name"
//                                   className="font-inter"
//                                 />
//                               </div>
//                               <div className="grid gap-2">
//                                 <Label htmlFor="email" className="font-poppins">
//                                   Email Address *
//                                 </Label>
//                                 <Input
//                                   id="email"
//                                   name="email"
//                                   type="email"
//                                   value={formdata?.email || ""}
//                                   onChange={(e) => handleChangeFormData(e)}
//                                   placeholder="Enter email address"
//                                   className="font-inter"
//                                 />
//                               </div>
//                               <div className="grid gap-2">
//                                 <Label htmlFor="password" className="font-poppins">
//                                   Password *
//                                 </Label>
//                                 <Input
//                                   id="password"
//                                   name="password"
//                                   type="password"
//                                   value={formdata?.password || ""}
//                                   onChange={(e) => handleChangeFormData(e)}
//                                   placeholder="Enter password"
//                                   className="font-inter"
//                                 />
//                               </div>
//                               <div className="grid gap-2">
//                                 <Label htmlFor="address" className="font-poppins">
//                                   Address *
//                                 </Label>
//                                 <Input
//                                   id="address"
//                                   name="address"
//                                   type="address"
//                                   value={formdata?.address || ""}
//                                   onChange={(e) => handleChangeFormData(e)}
//                                   placeholder="Enter address"
//                                   className="font-inter"
//                                 />
//                               </div>
//                               <div className="grid gap-2">
//                                 <Label htmlFor="organization" className="font-poppins">
//                                   Organization *
//                                 </Label>
//                                 <Input
//                                   id="organization"
//                                   name="organization"
//                                   value={formdata?.organization || ""}
//                                   onChange={(e) => handleChangeFormData(e)}
//                                   placeholder="Enter organization name"
//                                   className="font-inter"
//                                 />
//                               </div>
//                               <div className="grid gap-2">
//                                 <Label htmlFor="phone" className="font-poppins">
//                                   Phone Number
//                                 </Label>
//                                 <Input
//                                   id="phone"
//                                   name="phone"
//                                   type="tel"
//                                   value={formdata?.phone || ""}
//                                   onChange={(e) => handleChangeFormData(e)}
//                                   placeholder="Enter phone number"
//                                   className="font-inter"
//                                 />
//                               </div>
//                               <div className="grid gap-2">
//                                 <Label htmlFor="subscriptionType" className="font-poppins">
//                                   Subscription Type *
//                                 </Label>
//                                 <Select
//                                   value={formdata?.subscriptionType || ""}
//                                   onValueChange={(value) => handleSelectChange("subscriptionType", value)}
//                                 >
//                                   <SelectTrigger className="font-inter">
//                                     <SelectValue placeholder="Select subscription type" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectItem value="Monthly" className="font-inter">
//                                       Monthly (₹999/month)
//                                     </SelectItem>
//                                     <SelectItem value="Yearly" className="font-inter">
//                                       Yearly (₹9,999/year)
//                                     </SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                               {formdata?.subscriptionType && (
//                                 <div className="bg-blue-50 p-4 rounded-lg">
//                                   <div className="flex items-center justify-between">
//                                     <span className="font-medium">Selected Plan:</span>
//                                     <span className="font-bold text-blue-600">
//                                       ₹{formdata?.subscriptionType === "Monthly" ? "999" : "9,999"}
//                                     </span>
//                                   </div>
//                                   <p className="text-sm text-blue-700 mt-1">
//                                     {formdata?.subscriptionType === "Monthly"
//                                       ? "Billed monthly"
//                                       : "Billed annually (Save 17%)"}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                             <SheetFooter className="flex gap-3">
//                               <Button
//                                 variant="outline"
//                                 onClick={() => setIsCreateSheetOpen(false)}
//                                 className="flex-1"
//                                 disabled={loading}
//                               >
//                                 Cancel
//                               </Button>
//                               <Button
//                                 onClick={handleProceedToPayment}
//                                 className="flex-1"
//                                 disabled={loading || !formdata?.subscriptionType}
//                               >
//                                 {loading ? (
//                                   <div className="flex items-center gap-2">
//                                     <Loader2 className="animate-spin h-4 w-4" />
//                                     <span>Processing...</span>
//                                   </div>
//                                 ) : (
//                                   <>
//                                     <CreditCard className="mr-2 h-4 w-4" />
//                                     Proceed to Payment
//                                   </>
//                                 )}
//                               </Button>
//                             </SheetFooter>
//                           </div>
//                         </SheetContent>
//                       </Sheet>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex items-center space-x-2 mb-4">
//                       <Search className="h-4 w-4 text-gray-400" />
//                       <Input
//                         placeholder="Search admins by name, email, or company..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="max-w-sm font-inter"
//                       />
//                     </div>
//                     <div className="shadow-sm">
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead className="font-poppins">Admin Details</TableHead>
//                             <TableHead className="font-poppins">Company</TableHead>
//                             <TableHead className="font-poppins">Subscription</TableHead>
//                             <TableHead className="font-poppins">Status</TableHead>
//                             <TableHead className="font-poppins">Days Remaining</TableHead>
//                             <TableHead className="font-poppins">Auto Renewal</TableHead>
//                             {/* <TableHead className="font-poppins">Events</TableHead>
//                             <TableHead className="font-poppins">Last Login</TableHead> */}
//                             <TableHead className="text-right font-poppins">Actions</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {filteredAdmins?.map((admin, index) => (
//                             <TableRow key={admin?._id ? admin._id : index}>
//                               <TableCell>
//                                 <div>
//                                   <div className="font-medium font-poppins">{admin?.name}</div>
//                                   <div className="text-sm text-gray-500 font-inter">{admin?.email}</div>
//                                 </div>
//                               </TableCell>
//                               <TableCell className="font-inter">{admin?.organization}</TableCell>
//                               <TableCell>
//                                 <Badge variant="outline" className="font-poppins">
//                                   {admin?.subscriptionType}
//                                 </Badge>
//                               </TableCell>
//                               <TableCell>{getStatusBadge(admin?.status)}</TableCell>
//                               <TableCell>
//                                 <span
//                                   className={`font-poppins ${
//                                     admin.daysRemaining < 0
//                                       ? "text-red-600 font-medium"
//                                       : admin.daysRemaining <= 7
//                                         ? "text-yellow-600 font-medium"
//                                         : "text-green-600"
//                                   }`}
//                                 >
//                                   {admin?.dayremaining < 0 ? "Expired" : `${admin?.dayremaining} days`}
//                                 </span>
//                               </TableCell>
//                               <TableCell>
//                                 <Switch
//                                   checked={admin?.status == "Active"}
//                                   onCheckedChange={() => {
//                                     const newStatus = admin?.status === "Active" ? "inActive" : "Active"
//                                     handleSubScriptionStatus(newStatus, admin?._id)
//                                   }}
//                                   disabled={admin.subscriptionStatus === "Expired"}
//                                 />
//                               </TableCell>
//                               {/* <TableCell className="font-poppins">{admin.totalEvents}</TableCell>
//                               <TableCell className="font-inter">{admin.lastLogin}</TableCell> */}
//                               <TableCell className="text-right">
//                                 <DropdownMenu>
//                                   <DropdownMenuTrigger asChild>
//                                     <Button variant="ghost" className="h-8 w-8 p-0">
//                                       <MoreHorizontal className="h-4 w-4" />
//                                     </Button>
//                                   </DropdownMenuTrigger>
//                                   <DropdownMenuContent align="end">
//                                     <DropdownMenuLabel className="font-poppins">Actions</DropdownMenuLabel>
//                                     <DropdownMenuItem className="font-inter">
//                                       <Calendar className="mr-2 h-4 w-4" />
//                                       View Events
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem className="font-inter">
//                                       <CreditCard className="mr-2 h-4 w-4" />
//                                       Billing History
//                                     </DropdownMenuItem>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuItem
//                                       onClick={() => handleCloseSubscription(admin.id)}
//                                       className="text-red-600 font-inter"
//                                       disabled={admin.subscriptionStatus === "Expired"}
//                                     >
//                                       <UserX className="mr-2 h-4 w-4" />
//                                       Close Subscription
//                                     </DropdownMenuItem>
//                                   </DropdownMenuContent>
//                                 </DropdownMenu>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//               {activeTab === "payments" && (
//                 <Card className="shadow-sm">
//                   <CardHeader>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <CardTitle className="font-poppins">Payment History</CardTitle>
//                         <CardDescription className="font-inter">
//                           Track all payment transactions and billing details
//                         </CardDescription>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button variant="outline" size="sm">
//                           <Download className="h-4 w-4 mr-2" />
//                           Export
//                         </Button>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex flex-col sm:flex-row gap-4 mb-6">
//                       <div className="flex items-center space-x-2 flex-1">
//                         <Search className="h-4 w-4 text-gray-400" />
//                         <Input
//                           placeholder="Search by customer name, order ID, or payment ID..."
//                           value={paymentSearchTerm}
//                           onChange={(e) => setPaymentSearchTerm(e.target.value)}
//                           className="font-inter"
//                         />
//                       </div>
//                       <Select value={paymentFilter} onValueChange={setPaymentFilter}>
//                         <SelectTrigger className="w-[180px]">
//                           <SelectValue placeholder="Filter by plan" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All Plans</SelectItem>
//                           <SelectItem value="monthly">Monthly</SelectItem>
//                           <SelectItem value="yearly">Yearly</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <Select value={dateFilter} onValueChange={setDateFilter}>
//                         <SelectTrigger className="w-[180px]">
//                           <SelectValue placeholder="Filter by month" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All Months</SelectItem>
//                           <SelectItem value="august">August</SelectItem>
//                           <SelectItem value="july">July</SelectItem>
//                           <SelectItem value="june">June</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="shadow-sm">
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead className="font-poppins">Customer</TableHead>
//                             <TableHead className="font-poppins">Order Details</TableHead>
//                             <TableHead className="font-poppins">Plan</TableHead>
//                             <TableHead className="font-poppins">Amount</TableHead>
//                             <TableHead className="font-poppins">Status</TableHead>
//                             <TableHead className="font-poppins">Date</TableHead>
//                             <TableHead className="font-poppins">Month</TableHead>
//                             <TableHead className="text-right font-poppins">Actions</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {filteredPayments?.map((payment) => (
//                             <TableRow key={payment._id}>
//                               <TableCell>
//                                 <div>
//                                   <div className="font-medium font-poppins">{payment.username}</div>
//                                   <div className="text-sm text-gray-500 font-inter">
//                                     ID: {payment.organizationId.slice(-8)}
//                                   </div>
//                                 </div>
//                               </TableCell>
//                               <TableCell>
//                                 <div className="space-y-1">
//                                   <div className="text-sm font-mono">{payment.orderId}</div>
//                                   <div className="text-xs text-gray-500 font-mono">{payment.paymentId}</div>
//                                 </div>
//                               </TableCell>
//                               <TableCell>
//                                 <Badge
//                                   variant={payment.ordername === "Yearly" ? "default" : "secondary"}
//                                   className="font-poppins"
//                                 >
//                                   {payment.ordername}
//                                 </Badge>
//                               </TableCell>
//                               <TableCell>
//                                 <div className="font-semibold text-green-600">{formatCurrency(payment.amount)}</div>
//                                 <div className="text-xs text-gray-500">{payment.currency}</div>
//                               </TableCell>
//                               <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
//                               <TableCell>
//                                 <div className="text-sm">{formatDate(payment.createdAt)}</div>
//                               </TableCell>
//                               <TableCell>
//                                 <Badge variant="outline" className="font-poppins">
//                                   {payment.monthName}
//                                 </Badge>
//                               </TableCell>
//                               <TableCell className="text-right">
//                                 <DropdownMenu>
//                                   <DropdownMenuTrigger asChild>
//                                     <Button variant="ghost" className="h-8 w-8 p-0">
//                                       <MoreHorizontal className="h-4 w-4" />
//                                     </Button>
//                                   </DropdownMenuTrigger>
//                                   <DropdownMenuContent align="end">
//                                     <DropdownMenuLabel className="font-poppins">Actions</DropdownMenuLabel>
//                                     <DropdownMenuItem className="font-inter">
//                                       <Eye className="mr-2 h-4 w-4" />
//                                       View Details
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem className="font-inter">
//                                       <Receipt className="mr-2 h-4 w-4" />
//                                       Download Receipt
//                                     </DropdownMenuItem>
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuItem className="font-inter">
//                                       <Download className="mr-2 h-4 w-4" />
//                                       Export Data
//                                     </DropdownMenuItem>
//                                   </DropdownMenuContent>
//                                 </DropdownMenu>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </div>

//                     {filteredPayments?.length === 0 && (
//                       <div className="text-center py-8">
//                         <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
//                         <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               )}

//               {activeTab === "analytics" && (
//                 <div className="space-y-6">
//                   {/* Monthly Revenue Breakdown */}
//                   <Card className="shadow-sm">
//                     <CardHeader>
//                       <CardTitle className="font-poppins">Monthly Revenue Breakdown</CardTitle>
//                       <CardDescription className="font-inter">Revenue and transaction count by month</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid gap-4">
//                         {Object.entries(monthlyBreakdown || {}).map(([month, data]) => (
//                           <div key={month} className="flex items-center justify-between p-4 border rounded-lg">
//                             <div>
//                               <h3 className="font-medium font-poppins">{month}</h3>
//                               <p className="text-sm text-gray-500">{data.count} transactions</p>
//                             </div>
//                             <div className="text-right">
//                               <div className="font-semibold text-green-600">{formatCurrency(data.amount)}</div>
//                               <div className="text-sm text-gray-500">
//                                 Avg: {formatCurrency(data.amount / data.count)}
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>

//                   {/* Plan Performance */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <Card className="shadow-sm">
//                       <CardHeader>
//                         <CardTitle className="font-poppins">Monthly Plans</CardTitle>
//                         <CardDescription className="font-inter">Monthly subscription performance</CardDescription>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="space-y-4">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium">Total Revenue</span>
//                             <span className="font-semibold text-green-600">{formatCurrency(monthlyRevenue)}</span>
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium">Subscribers</span>
//                             <span className="font-semibold">
//                               {adminPaymentData?.filter((p) => p.ordername === "Monthly").length}
//                             </span>
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium">Avg. Revenue per User</span>
//                             <span className="font-semibold">
//                               {adminPaymentData?.filter((p) => p.ordername === "Monthly").length > 0
//                                 ? formatCurrency(
//                                     monthlyRevenue / adminPaymentData?.filter((p) => p.ordername === "Monthly").length,
//                                   )
//                                 : "₹0"}
//                             </span>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>

//                     <Card className="shadow-sm">
//                       <CardHeader>
//                         <CardTitle className="font-poppins">Yearly Plans</CardTitle>
//                         <CardDescription className="font-inter">Yearly subscription performance</CardDescription>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="space-y-4">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium">Total Revenue</span>
//                             <span className="font-semibold text-green-600">{formatCurrency(yearlyRevenue)}</span>
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium">Subscribers</span>
//                             <span className="font-semibold">
//                               {adminPaymentData?.filter((p) => p.ordername === "Yearly").length}
//                             </span>
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium">Avg. Revenue per User</span>
//                             <span className="font-semibold">
//                               {adminPaymentData?.filter((p) => p.ordername === "Yearly").length > 0
//                                 ? formatCurrency(
//                                     yearlyRevenue / adminPaymentData?.filter((p) => p.ordername === "Yearly").length,
//                                   )
//                                 : "₹0"}
//                             </span>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>

//                   {/* Key Metrics */}
//                   <Card className="shadow-sm">
//                     <CardHeader>
//                       <CardTitle className="font-poppins">Key Performance Indicators</CardTitle>
//                       <CardDescription className="font-inter">Important business metrics and insights</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="text-center p-4 border rounded-lg">
//                           <div className="text-2xl font-bold text-blue-600 mb-2">
//                             {totalTransactions > 0 ? Math.round((successfulPayments / totalTransactions) * 100) : 0}%
//                           </div>
//                           <div className="text-sm font-medium text-gray-900">Payment Success Rate</div>
//                           <div className="text-xs text-gray-500 mt-1">
//                             {successfulPayments} successful out of {totalTransactions}
//                           </div>
//                         </div>

//                         <div className="text-center p-4 border rounded-lg">
//                           <div className="text-2xl font-bold text-green-600 mb-2">
//                             {formatCurrency(totalRevenue / Math.max(totalTransactions, 1))}
//                           </div>
//                           <div className="text-sm font-medium text-gray-900">Average Transaction Value</div>
//                           <div className="text-xs text-gray-500 mt-1">Across all payment types</div>
//                         </div>

//                         <div className="text-center p-4 border rounded-lg">
//                           <div className="text-2xl font-bold text-purple-600 mb-2">
//                             {adminPaymentData?.filter((p) => p.ordername === "Yearly").length > 0
//                               ? Math.round(
//                                   (adminPaymentData?.filter((p) => p.ordername === "Yearly").length /
//                                     totalTransactions) *
//                                     100,
//                                 )
//                               : 0}
//                             %
//                           </div>
//                           <div className="text-sm font-medium text-gray-900">Yearly Plan Adoption</div>
//                           <div className="text-xs text-gray-500 mt-1">Higher value customers</div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }








"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { deleteAdminUser, getAllAdminPayments } from "../ApiServices/ApiServices"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { registerUserThunk, setFormData, resetFormData } from "../ReduxSlices/UserSlice"
import { Loader2 } from "lucide-react"
import { useToast } from "../ui/use-toast"
import { useAuth } from "@/lib/auth/auth-provider"
import { updateSubscriptionStatus } from "../ApiServices/ApiServices"
import {
  CreditCard,
  LogOut,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  TrendingUp,
  Users,
  X,
  DollarSign,
  Receipt,
  Download,
  Eye,
  BarChart3,
  PieChart,
  Trash2,
} from "lucide-react"
import { getAllAdmins } from "../ApiServices/ApiServices"
import AdminPaymentSheet from "../paymentsModel/adminPaymentModel"
import { DeleteUser } from "../ApiServices/ApiServices"

interface AdminInfo {
  name: string
  email: string
}

interface SuperAdminDashboardProps {
  adminInfo: AdminInfo
  onLogout: () => void
}

interface PaymentData {
  _id: string
  orderId: string
  paymentId: string
  signature: string
  amount: number
  currency: string
  username: string
  ordername: string
  organizationId: string
  role: string
  status: string
  monthName: string
  createdAt: string
  updatedAt: string
}

const mockAdmins = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh@company.com",
    company: "Tech Solutions Pvt Ltd",
    subscriptionType: "Monthly",
    subscriptionStatus: "Active",
    daysRemaining: 15,
    totalEvents: 45,
    lastLogin: "2024-01-15",
    autoRenewal: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@events.com",
    company: "Event Masters",
    subscriptionType: "Yearly",
    subscriptionStatus: "Active",
    daysRemaining: 120,
    totalEvents: 78,
    lastLogin: "2024-01-14",
    autoRenewal: false,
  },
  {
    id: 3,
    name: "Amit Singh",
    email: "amit@weddings.in",
    company: "Wedding Planners",
    subscriptionType: "Monthly",
    subscriptionStatus: "Expiring Soon",
    daysRemaining: 3,
    totalEvents: 23,
    lastLogin: "2024-01-13",
    autoRenewal: true,
  },
  {
    id: 4,
    name: "Sneha Patel",
    email: "sneha@corporate.com",
    company: "Corporate Events Co",
    subscriptionType: "Monthly",
    subscriptionStatus: "Expired",
    daysRemaining: -2,
    totalEvents: 67,
    lastLogin: "2024-01-10",
    autoRenewal: false,
  },
]

export default function SuperAdminDashboard({ adminInfo, onLogout }: SuperAdminDashboardProps) {
  const [admins, setAdmins] = useState(mockAdmins)
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentSearchTerm, setPaymentSearchTerm] = useState("")
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false)
  const [adminPaymentData, setAdminPaymentData] = useState<PaymentData[]>([])
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("admins")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { loading, formdata } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const [subscriptionStatus, setSubScriptionStatus] = useState("Active")
  const auth = useAuth()
  const { toast } = useToast()


     
  const filteredAdmins = admins?.filter(
    (admin) =>
      admin?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin?.organization?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPayments = adminPaymentData?.filter((payment) => {
    const matchesSearch =
      payment.username.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(paymentSearchTerm.toLowerCase()) ||
      payment.paymentId.toLowerCase().includes(paymentSearchTerm.toLowerCase())

    const matchesFilter = paymentFilter === "all" || payment.ordername.toLowerCase() === paymentFilter.toLowerCase()
    const matchesDate = dateFilter === "all" || payment.monthName.toLowerCase() === dateFilter.toLowerCase()

    return matchesSearch && matchesFilter && matchesDate
  })

  // Calculate payment statistics
  const totalRevenue = adminPaymentData?.reduce((sum, payment) => sum + payment.amount, 0) || 0
  const monthlyRevenue =
    adminPaymentData?.filter((p) => p.ordername === "Monthly").reduce((sum, payment) => sum + payment.amount, 0) || 0
  const yearlyRevenue =
    adminPaymentData?.filter((p) => p.ordername === "Yearly").reduce((sum, payment) => sum + payment.amount, 0) || 0
  const totalTransactions = adminPaymentData?.length || 0
  const successfulPayments = adminPaymentData?.filter((p) => p.status === "paid").length || 0

  // Monthly breakdown
  const monthlyBreakdown = adminPaymentData?.reduce(
    (acc, payment) => {
      const month = payment.monthName
      if (!acc[month]) {
        acc[month] = { count: 0, amount: 0 }
      }
      acc[month].count += 1
      acc[month].amount += payment.amount
      return acc
    },
    {} as Record<string, { count: number; amount: number }>,
  )

    

  const handleDeleteUser = async (organizationId:string,userId: string) => {
    setIsDeleting(true)
    try {
      const response = await deleteAdminUser(organizationId, userId)
      if (response?.statuscode == 200) {
        toast({
          title: "User Deleted Successfully",
          duration: 3000,
        })
        fetchAdmins() // Refresh the admin list
        setDeleteDialogOpen(false)
        setUserToDelete(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong while deleting user.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteClick = (admin: any) => {
    setUserToDelete({ id: admin._id, name: admin.name })
    setDeleteDialogOpen(true)
  }

  const totalAdmins = admins?.length
  const activeSubscriptions = admins?.filter((admin) => admin?.status === "Active").length
  const expiringSoon = admins?.filter((admin) => admin?.status === "Expiring Soon").length

  const handleAdminPayments = async () => {
    try {
      const response = await getAllAdminPayments(auth?.auth?._id)
      if (response?.statuscode == 200) {
        setAdminPaymentData(response?.data || [])
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
    }
  }

  useEffect(() => {
    if (auth?.auth?._id) {
      handleAdminPayments()
    }
  }, [auth])

  const handleCloseSubscription = (adminId: number) => {
    setAdmins(
      admins?.map((admin) =>
        admin.id === adminId
          ? { ...admin, subscriptionStatus: "Expired", daysRemaining: 0, autoRenewal: false }
          : admin,
      ),
    )
    toast({
      title: "Subscription Closed",
      description: "Admin subscription has been successfully closed.",
    })
  }

  const fetchAdmins = async () => {
    try {
      const admins = await getAllAdmins()
      setAdmins(admins?.data)
    } catch (error) {
      console.error("Error fetching admins:", error)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [auth])

  const handleSubScriptionStatus = async (status: "Active" | "inActive", userId: string) => {
    try {
      setSubScriptionStatus(status)
      const data = {
        status: status,
        userID: userId,
      }
      const response = await updateSubscriptionStatus(data)
      if (response?.statuscode == 200) {
        toast({
          title: "Status updated",
          description: response?.message || "Your status has been updated successfully.",
        })
        fetchAdmins()
      } else {
        toast({
          title: "Error",
          description: response?.response?.data?.message || "Something went wrong while updating your status.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong while updating your status.",
        variant: "destructive",
      })
    }
  }

  const handleCreateAdmin = async () => {
    try {
      const response = await dispatch(registerUserThunk(formdata))
      if (response.type === "user/registerUserThunk/fulfilled" && response.payload?.statuscode === 201) {
        toast({
          title: "Account created",
          description: response.payload.message || "Your account has been created successfully.",
        })
        dispatch(resetFormData())
        fetchAdmins()
        setIsCreateSheetOpen(false)
        setIsPaymentSheetOpen(false)
      } else {
        toast({
          title: "Error",
          description: response.payload || "Something went wrong while creating your account.",
          variant: "destructive",
        })
      }
      dispatch(resetFormData())
      setIsCreateSheetOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while creating your account.",
        variant: "destructive",
      })
    }
  }

  const handleChangeFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch(
      setFormData({
        ...formdata,
        [name]: value,
        role: "admin",
      }),
    )
  }

  const handleSelectChange = (name: string, value: string) => {
    dispatch(
      setFormData({
        ...formdata,
        [name]: value,
        role: "admin",
        price: value === "Monthly" ? "999" : "9999",
      }),
    )
  }

  const handleProceedToPayment = () => {
    if (
      !formdata?.name ||
      !formdata?.email ||
      !formdata?.password ||
      !formdata?.organization ||
      !formdata?.subscriptionType
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before proceeding to payment.",
        variant: "destructive",
      })
      return
    }
    setIsPaymentSheetOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-poppins">Active</Badge>
      case "Expiring Soon":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 font-poppins">Expiring Soon</Badge>
      case "Expired":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 font-poppins">Expired</Badge>
      default:
        return (
          <Badge variant="secondary" className="font-poppins">
            {status}
          </Badge>
        )
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount / 100) // Assuming amount is in paise
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    setTimeout(() => {
      onLogout()
    }, 1000)
  }

  return (
    <>
      {isPaymentSheetOpen && (
        <AdminPaymentSheet
          formdata={formdata}
          handleCreateAdmin={handleCreateAdmin}
          isSheetOpen={isPaymentSheetOpen}
          setIsSheetOpen={setIsPaymentSheetOpen}
          handleAdminPayments={handleAdminPayments}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Delete Admin User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone and
              will permanently remove the admin user and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleDeleteUser(auth?.auth?._id,userToDelete?.id)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Deleting...</span>
                </div>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="min-h-screen bg-gray-50/50 font-poppins">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-lg font-bold text-gray-900 font-poppins">EventMaster Pro</h1>
                  <p className="text-xs text-gray-500 font-inter">Super Admin</p>
                </div>
              </div>
            </div>
            <nav className="px-4 space-y-2">
              <button
                onClick={() => setActiveTab("admins")}
                className={`flex items-center gap-3 px-3 py-3 text-sm font-medium w-full text-left font-poppins ${
                  activeTab === "admins" ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Users className="h-4 w-4" />
                Admin Management
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`flex items-center gap-3 px-3 py-3 text-sm font-medium w-full text-left font-poppins ${
                  activeTab === "payments" ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                Payment History
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center gap-3 px-3 py-3 text-sm font-medium w-full text-left font-poppins ${
                  activeTab === "analytics" ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Revenue Analytics
              </button>
            </nav>
            {/* Admin Info & Logout */}
            <div className="absolute bottom-4 left-4 right-4 space-y-3">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="justify-start bg-transparent hover:bg-red-50 hover:text-red-600 font-poppins px-3 py-2 w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 font-poppins">
                  {activeTab === "admins" && "Admin Management Dashboard"}
                  {activeTab === "payments" && "Payment History Dashboard"}
                  {activeTab === "analytics" && "Revenue Analytics Dashboard"}
                </h1>
                <p className="text-gray-600 mt-2 font-inter">
                  {activeTab === "admins" && "Manage all admin users and their subscriptions"}
                  {activeTab === "payments" && "Track all payment transactions and billing history"}
                  {activeTab === "analytics" && "Analyze revenue trends and financial insights"}
                </p>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-poppins">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-poppins text-green-600">{formatCurrency(totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground font-inter">From {totalTransactions} transactions</p>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-poppins">Total Admins</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-poppins">{totalAdmins}</div>
                    <p className="text-xs text-muted-foreground font-inter">Active users on platform</p>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-poppins">Success Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600 font-poppins">
                      {totalTransactions > 0 ? Math.round((successfulPayments / totalTransactions) * 100) : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground font-inter">
                      {successfulPayments} of {totalTransactions} payments
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-poppins">Monthly vs Yearly</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-poppins">
                      {formatCurrency(monthlyRevenue)} / {formatCurrency(yearlyRevenue)}
                    </div>
                    <p className="text-xs text-muted-foreground font-inter">Monthly / Yearly revenue</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tab Content */}
              {activeTab === "admins" && (
                <Card className="shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-poppins">Admin Users</CardTitle>
                        <CardDescription className="font-inter">
                          Manage all admin accounts and their subscriptions
                        </CardDescription>
                      </div>
                      <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
                        <SheetTrigger asChild>
                          <Button className="font-poppins">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Admin
                          </Button>
                        </SheetTrigger>
                        <SheetContent
                          side="right"
                          className="w-full sm:w-[400px] md:w-[600px] lg:w-[700px] xl:w-[800px] max-w-none sm:max-w-none md:max-w-none lg:max-w-none xl:max-w-none rounded-l-3xl rounded-bl-3xl overflow-y-auto"
                        >
                          <SheetHeader className="pb-6">
                            <SheetTitle className="flex items-center justify-between text-xl">
                              <span>Create New Admin</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsCreateSheetOpen(false)}
                                disabled={loading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </SheetTitle>
                            <SheetDescription className="font-inter">
                              Add a new admin user to the event management system.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="space-y-6 pb-6">
                            <div className="grid gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="name" className="font-poppins">
                                  Full Name *
                                </Label>
                                <Input
                                  id="name"
                                  name="name"
                                  value={formdata?.name || ""}
                                  onChange={(e) => handleChangeFormData(e)}
                                  placeholder="Enter full name"
                                  className="font-inter"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="email" className="font-poppins">
                                  Email Address *
                                </Label>
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  value={formdata?.email || ""}
                                  onChange={(e) => handleChangeFormData(e)}
                                  placeholder="Enter email address"
                                  className="font-inter"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="password" className="font-poppins">
                                  Password *
                                </Label>
                                <Input
                                  id="password"
                                  name="password"
                                  type="password"
                                  value={formdata?.password || ""}
                                  onChange={(e) => handleChangeFormData(e)}
                                  placeholder="Enter password"
                                  className="font-inter"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="address" className="font-poppins">
                                  Address *
                                </Label>
                                <Input
                                  id="address"
                                  name="address"
                                  type="address"
                                  value={formdata?.address || ""}
                                  onChange={(e) => handleChangeFormData(e)}
                                  placeholder="Enter address"
                                  className="font-inter"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="organization" className="font-poppins">
                                  Organization *
                                </Label>
                                <Input
                                  id="organization"
                                  name="organization"
                                  value={formdata?.organization || ""}
                                  onChange={(e) => handleChangeFormData(e)}
                                  placeholder="Enter organization name"
                                  className="font-inter"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="phone" className="font-poppins">
                                  Phone Number
                                </Label>
                                <Input
                                  id="phone"
                                  name="phone"
                                  type="tel"
                                  value={formdata?.phone || ""}
                                  onChange={(e) => handleChangeFormData(e)}
                                  placeholder="Enter phone number"
                                  className="font-inter"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="subscriptionType" className="font-poppins">
                                  Subscription Type *
                                </Label>
                                <Select
                                  value={formdata?.subscriptionType || ""}
                                  onValueChange={(value) => handleSelectChange("subscriptionType", value)}
                                >
                                  <SelectTrigger className="font-inter">
                                    <SelectValue placeholder="Select subscription type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Monthly" className="font-inter">
                                      Monthly (₹999/month)
                                    </SelectItem>
                                    <SelectItem value="Yearly" className="font-inter">
                                      Yearly (₹9,999/year)
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              {formdata?.subscriptionType && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Selected Plan:</span>
                                    <span className="font-bold text-blue-600">
                                      ₹{formdata?.subscriptionType === "Monthly" ? "999" : "9,999"}
                                    </span>
                                  </div>
                                  <p className="text-sm text-blue-700 mt-1">
                                    {formdata?.subscriptionType === "Monthly"
                                      ? "Billed monthly"
                                      : "Billed annually (Save 17%)"}
                                  </p>
                                </div>
                              )}
                            </div>
                            <SheetFooter className="flex gap-3">
                              <Button
                                variant="outline"
                                onClick={() => setIsCreateSheetOpen(false)}
                                className="flex-1"
                                disabled={loading}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleProceedToPayment}
                                className="flex-1"
                                disabled={loading || !formdata?.subscriptionType}
                              >
                                {loading ? (
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    <span>Processing...</span>
                                  </div>
                                ) : (
                                  <>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Proceed to Payment
                                  </>
                                )}
                              </Button>
                            </SheetFooter>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search admins by name, email, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm font-inter"
                      />
                    </div>
                    <div className="shadow-sm">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-poppins">Admin Details</TableHead>
                            <TableHead className="font-poppins">Company</TableHead>
                            <TableHead className="font-poppins">Subscription</TableHead>
                            <TableHead className="font-poppins">Status</TableHead>
                            <TableHead className="font-poppins">Days Remaining</TableHead>
                            <TableHead className="font-poppins">Auto Renewal</TableHead>
                            <TableHead className="text-right font-poppins">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAdmins?.map((admin, index) => (
                            <TableRow key={admin?._id ? admin._id : index}>
                              <TableCell>
                                <div>
                                  <div className="font-medium font-poppins">{admin?.name}</div>
                                  <div className="text-sm text-gray-500 font-inter">{admin?.email}</div>
                                </div>
                              </TableCell>
                              <TableCell className="font-inter">{admin?.organization}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-poppins">
                                  {admin?.subscriptionType}
                                </Badge>
                              </TableCell>
                              <TableCell>{getStatusBadge(admin?.status)}</TableCell>
                              <TableCell>
                                <span
                                  className={`font-poppins ${
                                    admin.daysRemaining < 0
                                      ? "text-red-600 font-medium"
                                      : admin.daysRemaining <= 7
                                        ? "text-yellow-600 font-medium"
                                        : "text-green-600"
                                  }`}
                                >
                                  {admin?.dayremaining < 0 ? "Expired" : `${admin?.dayremaining} days`}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Switch
                                  checked={admin?.status == "Active"}
                                  onCheckedChange={() => {
                                    const newStatus = admin?.status === "Active" ? "inActive" : "Active"
                                    handleSubScriptionStatus(newStatus, admin?._id)
                                  }}
                                  disabled={admin.subscriptionStatus === "Expired"}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel className="font-poppins">Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteClick(admin)}
                                      className="text-red-600 font-inter focus:text-red-600 focus:bg-red-50"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "payments" && (
                <Card className="shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-poppins">Payment History</CardTitle>
                        <CardDescription className="font-inter">
                          Track all payment transactions and billing details
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="flex items-center space-x-2 flex-1">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search by customer name, order ID, or payment ID..."
                          value={paymentSearchTerm}
                          onChange={(e) => setPaymentSearchTerm(e.target.value)}
                          className="font-inter"
                        />
                      </div>
                      <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Plans</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Months</SelectItem>
                          <SelectItem value="august">August</SelectItem>
                          <SelectItem value="july">July</SelectItem>
                          <SelectItem value="june">June</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="shadow-sm">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-poppins">Customer</TableHead>
                            <TableHead className="font-poppins">Order Details</TableHead>
                            <TableHead className="font-poppins">Plan</TableHead>
                            <TableHead className="font-poppins">Amount</TableHead>
                            <TableHead className="font-poppins">Status</TableHead>
                            <TableHead className="font-poppins">Date</TableHead>
                            <TableHead className="font-poppins">Month</TableHead>
                            {/* <TableHead className="text-right font-poppins">Actions</TableHead> */}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPayments?.map((payment) => (
                            <TableRow key={payment._id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium font-poppins">{payment.username}</div>
                                  <div className="text-sm text-gray-500 font-inter">
                                    ID: {payment.organizationId.slice(-8)}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="text-sm font-mono">{payment.orderId}</div>
                                  <div className="text-xs text-gray-500 font-mono">{payment.paymentId}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={payment.ordername === "Yearly" ? "default" : "secondary"}
                                  className="font-poppins"
                                >
                                  {payment.ordername}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="font-semibold text-green-600">{formatCurrency(payment.amount)}</div>
                                <div className="text-xs text-gray-500">{payment.currency}</div>
                              </TableCell>
                              <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                              <TableCell>
                                <div className="text-sm">{formatDate(payment.createdAt)}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-poppins">
                                  {payment.monthName}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  {/* <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger> */}
                                  {/* <DropdownMenuContent align="end">
                                    <DropdownMenuLabel className="font-poppins">Actions</DropdownMenuLabel>
                                    <DropdownMenuItem className="font-inter">
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="font-inter">
                                      <Receipt className="mr-2 h-4 w-4" />
                                      Download Receipt
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="font-inter">
                                      <Download className="mr-2 h-4 w-4" />
                                      Export Data
                                    </DropdownMenuItem>
                                  </DropdownMenuContent> */}
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {filteredPayments?.length === 0 && (
                      <div className="text-center py-8">
                        <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-6">
                  {/* Monthly Revenue Breakdown */}
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="font-poppins">Monthly Revenue Breakdown</CardTitle>
                      <CardDescription className="font-inter">Revenue and transaction count by month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {Object.entries(monthlyBreakdown || {}).map(([month, data]) => (
                          <div key={month} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium font-poppins">{month}</h3>
                              <p className="text-sm text-gray-500">{data.count} transactions</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-green-600">{formatCurrency(data.amount)}</div>
                              <div className="text-sm text-gray-500">
                                Avg: {formatCurrency(data.amount / data.count)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Plan Performance */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle className="font-poppins">Monthly Plans</CardTitle>
                        <CardDescription className="font-inter">Monthly subscription performance</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Total Revenue</span>
                            <span className="font-semibold text-green-600">{formatCurrency(monthlyRevenue)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Subscribers</span>
                            <span className="font-semibold">
                              {adminPaymentData?.filter((p) => p.ordername === "Monthly").length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Avg. Revenue per User</span>
                            <span className="font-semibold">
                              {adminPaymentData?.filter((p) => p.ordername === "Monthly").length > 0
                                ? formatCurrency(
                                    monthlyRevenue / adminPaymentData?.filter((p) => p.ordername === "Monthly").length,
                                  )
                                : "₹0"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle className="font-poppins">Yearly Plans</CardTitle>
                        <CardDescription className="font-inter">Yearly subscription performance</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Total Revenue</span>
                            <span className="font-semibold text-green-600">{formatCurrency(yearlyRevenue)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Subscribers</span>
                            <span className="font-semibold">
                              {adminPaymentData?.filter((p) => p.ordername === "Yearly").length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Avg. Revenue per User</span>
                            <span className="font-semibold">
                              {adminPaymentData?.filter((p) => p.ordername === "Yearly").length > 0
                                ? formatCurrency(
                                    yearlyRevenue / adminPaymentData?.filter((p) => p.ordername === "Yearly").length,
                                  )
                                : "₹0"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Key Metrics */}
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="font-poppins">Key Performance Indicators</CardTitle>
                      <CardDescription className="font-inter">Important business metrics and insights</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-2">
                            {totalTransactions > 0 ? Math.round((successfulPayments / totalTransactions) * 100) : 0}%
                          </div>
                          <div className="text-sm font-medium text-gray-900">Payment Success Rate</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {successfulPayments} successful out of {totalTransactions}
                          </div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            {formatCurrency(totalRevenue / Math.max(totalTransactions, 1))}
                          </div>
                          <div className="text-sm font-medium text-gray-900">Average Transaction Value</div>
                          <div className="text-xs text-gray-500 mt-1">Across all payment types</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-purple-600 mb-2">
                            {adminPaymentData?.filter((p) => p.ordername === "Yearly").length > 0
                              ? Math.round(
                                  (adminPaymentData?.filter((p) => p.ordername === "Yearly").length /
                                    totalTransactions) *
                                    100,
                                )
                              : 0}
                            %
                          </div>
                          <div className="text-sm font-medium text-gray-900">Yearly Plan Adoption</div>
                          <div className="text-xs text-gray-500 mt-1">Higher value customers</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
