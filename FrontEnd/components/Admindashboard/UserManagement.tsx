 
"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getUserById, updateOrganizerStatus } from "../ApiServices/ApiServices"
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  Loader2,
  Filter,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  X,
  Plus,
  Minus,
} from "lucide-react"
import { registerUserThunk, resetFormData, setFormData } from "../ReduxSlices/UserSlice"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { useAuth } from "@/lib/auth/auth-provider"
import { useToast } from "../ui/use-toast"
import { getAllOrganizerAndAttendee, EditUsers, DeleteUser } from "../ApiServices/ApiServices"
import { getAllEventsThunk } from "../ReduxSlices/CreateEventSlice"
import { AssignEvents, getAssignEvents } from "../ApiServices/ApiServices"
import { ApiError } from "next/dist/server/api-utils"

interface Event {
  _id: string
  Event_title: string
  Description: string
  Date: string
  Time: string
  location: string
  Category: string | null
  Price: number
  Organizer: string | null
  image: string
  createdAt: string
  updatedAt: string
  __v: number
  attendee: any[]
}

interface Person {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  role: "organizer" | "attendee"
  assignedEvents: string[]
  status: "Active" | "Inactive"
  createdAt: string
  updatedAt: string
}

function UserManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState<Person[]>([])
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all")
  const [roleFilter, setRoleFilter] = useState<"all" | "organizer" | "attendee">("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Person | null>(null)
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<Person | null>(null)
  const [deactivateConfirmUser, setDeactivateConfirmUser] = useState<Person | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [isLoading, setIsLoading] = useState(false)
  const [eventAssignmentUser, setEventAssignmentUser] = useState<Person | null>(null)
  const [assignedEvents, setAssignedEvents] = useState<string[]>([])
  const [isAssigningEvents, setIsAssigningEvents] = useState(false)

  const dispatch = useAppDispatch()
  const { formdata, loading } = useAppSelector((state) => state.user)
  const { allevents } = useAppSelector((state) => state.createEvents)
  const { auth } = useAuth()

   

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const fetchUsers = async () => {
    try {
      const response = await getAllOrganizerAndAttendee(auth._id)
      if (response?.statuscode == 200) {
        setUsers(response?.data?.Users)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    }
  }

  
  
  const fetchAssignedEvents = async (userId: string) => {
    try {
      const response = await getAssignEvents(auth?._id, userId)
      if (response?.statuscode == 200) {
        setAssignedEvents(response?.data[0]?.eventIds || [])
      }
    } catch (error) {
      setAssignedEvents([])
    }
  }

 
  const handleAssignEvent = async (eventId: string, isAssigning: boolean) => {
    if (!eventAssignmentUser) return
    
    setIsAssigningEvents(true)
    try {
      const response = await AssignEvents({
        eventId,
        organizationId: auth?._id,
        userId: eventAssignmentUser._id,
      })

      if (response?.statuscode == 200) {
        // Update local state immediately
        if (isAssigning) {
          setAssignedEvents((prev) => [...prev, eventId])
        } else {
          setAssignedEvents((prev) => prev.filter((id) => id !== eventId))
        }

        toast({
          title: "Success",
          description: isAssigning ? "Event assigned successfully" : "Event unassigned successfully",
        })
         await fetchAssignedEvents(eventAssignmentUser?._id,)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update event assignment",
        variant: "destructive",
      })
    } finally {
      setIsAssigningEvents(false)
    }
  }

  const handleEventAssignmentUser = async (user: Person) => {
    setEventAssignmentUser(user)
    await fetchAssignedEvents(user._id)
  }

  const handleEditUser = (user: Person) => {
    setEditingUser(user)
    dispatch(
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        userId: user._id,
        organizationId: auth?._id,
      }),
    )
  }

  const handleEditedUser = async () => {
    setIsLoading(true)
    try {
      const response = await EditUsers({
        ...formdata,
        userId: editingUser?._id,
        organizationId: auth?._id,
      })

      if (response?.statuscode == 200) {
        await fetchUsers()
        toast({
          title: "Success",
          description: response?.message || "User updated successfully",
        })
        setEditingUser(null)
        dispatch(resetFormData())
      } else {
        toast({
          title: "Error",
          description: response?.message || "Failed to update user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    setIsLoading(true)
    try {
      const response = await DeleteUser(auth?._id, userId)
      if (response?.statuscode == 200) {
        await fetchUsers()
        toast({
          title: "Success",
          description: response?.message || "User deleted successfully",
        })
        setDeleteConfirmUser(null)
      } else {
        toast({
          title: "Error",
          description: response?.message || "Failed to delete user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleUserStatus =async () => {
    try {
    const userStatus = deactivateConfirmUser?.status === "Active" ? "inActive" : "Active"
    const formdata = {
      organizaionId: auth?._id,
      userId:deactivateConfirmUser?._id,
      status: userStatus,
    }
     const response = await updateOrganizerStatus(formdata)
     if(response?.statuscode == 200){
      await fetchUsers()
      toast({
        title: "Success",
        description: response?.message || "User status updated successfully",
      })
      setDeactivateConfirmUser(null)
     }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }

  }


  const handleChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch(setFormData({ [name]: value }))
  }

  const handleSubmitUser = async () => {
    const response = await dispatch(registerUserThunk(formdata))
    if (response.type === "user/registerUserThunk/fulfilled" && response.payload?.statuscode === 201) {
      toast({
        title: "Success",
        description: response.payload.message || "User created successfully",
      })
      dispatch(resetFormData())
      await fetchUsers()
      setIsAddDialogOpen(false)
    } else {
      toast({
        title: "Error",
        description: response.payload || "Failed to create user",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (auth?._id) {
      fetchUsers()
      dispatch(getAllEventsThunk(auth._id))
    }
  }, [auth])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusBadgeColor = (status: string) => {
    return status === "Active"
      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
      : "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "organizer":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
      case "attendee":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getEventTitle = (eventId: string) => {
    const event = allevents?.find((e) => e._id === eventId)
    return event ? event?.Event_title : "Unknown Event"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-muted-foreground text-lg">Manage organizers and attendees efficiently</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <UserPlus className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Add New User</DialogTitle>
                <DialogDescription>Create a new organizer or attendee account</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formdata?.name || ""}
                    onChange={handleChangeUser}
                    placeholder="Enter full name"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formdata?.email || ""}
                    onChange={handleChangeUser}
                    placeholder="Enter email address"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formdata?.phone || ""}
                    onChange={handleChangeUser}
                    placeholder="Enter phone number"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formdata?.address || ""}
                    onChange={handleChangeUser}
                    placeholder="Enter full address"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formdata?.password || ""}
                    onChange={handleChangeUser}
                    placeholder="Enter password"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role" className="text-sm font-medium">
                    Role
                  </Label>
                  <Select
                    value={formdata?.role || ""}
                    onValueChange={(value) => dispatch(setFormData({ role: value }))}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organizer">Organizer</SelectItem>
                      <SelectItem value="attendee">Attendee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitUser} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">{users.length}</div>
              <p className="text-xs text-blue-600 mt-1">
                {users.filter((u) => u.status === "Active").length} active users
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Organizers</CardTitle>
              <Users className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-800">
                {users.filter((u) => u.role === "organizer").length}
              </div>
              <p className="text-xs text-purple-600 mt-1">
                {users.filter((u) => u.role === "organizer" && u.status === "Active").length} active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Attendees</CardTitle>
              <Users className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-800">
                {users.filter((u) => u.role === "attendee").length}
              </div>
              <p className="text-xs text-emerald-600 mt-1">
                {users.filter((u) => u.role === "attendee" && u.status === "Active").length} active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Total Events</CardTitle>
              <Calendar className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-800">{allevents?.length || 0}</div>
              <p className="text-xs text-orange-600 mt-1">Available events</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters */}
        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      handleFilterChange()
                    }}
                    className="pl-10 w-64 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value: "all" | "Active" | "Inactive") => {
                    setStatusFilter(value)
                    handleFilterChange()
                  }}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={roleFilter}
                  onValueChange={(value: "all" | "organizer" | "attendee") => {
                    setRoleFilter(value)
                    handleFilterChange()
                  }}
                >
                  <SelectTrigger className="w-40">
                    <Users className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="organizer">Organizer</SelectItem>
                    <SelectItem value="attendee">Attendee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="transition-all duration-200"
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Cards
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="transition-all duration-200"
                >
                  <List className="w-4 h-4 mr-2" />
                  Table
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Display */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedUsers.map((user) => (
              <Card
                key={user?._id}
                className="bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border-white/20"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="ring-2 ring-offset-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300 h-12 w-12">
                        <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${getInitials(user.name)}`} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-200">
                          {user.name}
                        </CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge className={`${getStatusBadgeColor(user.status)} transition-all duration-200 text-xs`}>
                            {user.status}
                          </Badge>
                          <Badge className={`${getRoleBadgeColor(user.role)} transition-all duration-200 text-xs`}>
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-100 rounded-full"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => handleEditUser(user)}
                          className="cursor-pointer hover:bg-blue-50 transition-colors duration-150"
                        >
                          <Edit className="w-4 h-4 mr-2 text-blue-600" />
                          Edit User
                        </DropdownMenuItem>
                        {user.role === "organizer" && (
                          <DropdownMenuItem
                            onClick={() => handleEventAssignmentUser(user)}
                            className="cursor-pointer hover:bg-purple-50 transition-colors duration-150"
                          >
                            <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                            Manage Events
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => setDeactivateConfirmUser(user)}
                          className="cursor-pointer hover:bg-orange-50 transition-colors duration-150"
                        >
                          {user.status === "Active" ? (
                            <>
                              <UserX className="w-4 h-4 mr-2 text-orange-600" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <Separator />
                        <DropdownMenuItem
                          onClick={() => setDeleteConfirmUser(user)}
                          className="cursor-pointer hover:bg-red-50 text-red-600 transition-colors duration-150"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground hover:text-blue-600 transition-colors duration-200">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground hover:text-blue-600 transition-colors duration-200">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{user.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground hover:text-blue-600 transition-colors duration-200">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{user.address}</span>
                    </div>
                    {user.role === "organizer" && user.assignedEvents.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium text-muted-foreground">Assigned Events:</span>
                        <div className="mt-2 space-y-1">
                          {user.assignedEvents.slice(0, 2).map((eventId) => (
                            <div key={eventId} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                              {getEventTitle(eventId)}
                            </div>
                          ))}
                          {user.assignedEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{user.assignedEvents.length - 2} more events
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/20">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-gray-50/50">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Role & Status</TableHead>
                    <TableHead className="font-semibold">Assigned Events</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-gray-50/50 transition-colors duration-150 group">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 ring-1 ring-gray-200">
                            <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${getInitials(user.name)}`} />
                            <AvatarFallback className="text-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium group-hover:text-blue-600 transition-colors duration-200">
                              {user.name}
                            </span>
                            <div className="text-sm text-muted-foreground">{user.address}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{user.email}</div>
                          <div className="text-sm text-muted-foreground">{user.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Badge className={`${getRoleBadgeColor(user.role)} transition-all duration-200`}>
                            {user.role}
                          </Badge>
                          <Badge className={`${getStatusBadgeColor(user.status)} transition-all duration-200`}>
                            {user.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.role === "organizer" && user.assignedEvents.length > 0 ? (
                          <div className="space-y-1">
                            {user.assignedEvents.slice(0, 2).map((eventId) => (
                              <div key={eventId} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                                {getEventTitle(eventId)}
                              </div>
                            ))}
                            {user.assignedEvents.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{user.assignedEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No events assigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-100"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleEditUser(user)}
                              className="cursor-pointer hover:bg-blue-50 transition-colors duration-150"
                            >
                              <Edit className="w-4 h-4 mr-2 text-blue-600" />
                              Edit User
                            </DropdownMenuItem>
                            {user.role === "organizer" && (
                              <DropdownMenuItem
                                onClick={() => handleEventAssignmentUser(user)}
                                className="cursor-pointer hover:bg-purple-50 transition-colors duration-150"
                              >
                                <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                                Manage Events
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => setDeactivateConfirmUser(user)}
                              className="cursor-pointer hover:bg-orange-50 transition-colors duration-150"
                            >
                              {user.status === "Active" ? (
                                <>
                                  <UserX className="w-4 h-4 mr-2 text-orange-600" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <Separator />
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirmUser(user)}
                              className="cursor-pointer hover:bg-red-50 text-red-600 transition-colors duration-150"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </Card>
        )}

        {/* Enhanced Pagination */}
        {filteredUsers.length > 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Show</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span>of {filteredUsers.length} users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="transition-all duration-200 hover:bg-blue-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 p-0 transition-all duration-200 ${
                            currentPage === pageNum ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-blue-50"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="transition-all duration-200 hover:bg-blue-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Event Assignment Dialog */}
        <Dialog open={!!eventAssignmentUser} onOpenChange={() => setEventAssignmentUser(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Manage Events for {eventAssignmentUser?.name}
              </DialogTitle>
              <DialogDescription>
                Assign or unassign events for this organizer. Changes are applied immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {allevents && allevents.length > 0 ? (
                    allevents.map((event) => {
                      const isAssigned =  assignedEvents.some((assignedEvent) => assignedEvent._id === event._id)
                      return (
                        <Card
                          key={event._id}
                          className={`p-4 transition-all duration-300 hover:shadow-md ${
                            isAssigned
                              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                              : "bg-white hover:bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="flex items-center pt-1">
                                <Button
                                  variant={isAssigned ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleAssignEvent(event._id, !isAssigned)}
                                  disabled={isAssigningEvents}
                                  className={`transition-all duration-200 ${
                                    isAssigned
                                      ? "bg-green-600 hover:bg-green-700 text-white"
                                      : "hover:bg-blue-50 border-blue-200"
                                  }`}
                                >
                                  {isAssigningEvents ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : isAssigned ? (
                                    <Minus className="w-4 h-4" />
                                  ) : (
                                    <Plus className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-base font-semibold text-gray-900 truncate">
                                    {event.Event_title}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    {isAssigned && (
                                      <Badge className="bg-green-100 text-green-800 border-green-200">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Assigned
                                      </Badge>
                                    )}
                                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                                      ₹{event.Price}
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.Description}</p>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(event.Date)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {event.Time}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {event.location}
                                  </span>
                                  {/* {event.Category && (
                                    // <Badge variant="secondary" className="text-xs">
                                    //   {event.Category}
                                    // </Badge>
                                  )} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )
                    })
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Available</h3>
                      <p className="text-gray-500">There are no events available for assignment at the moment.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter className="border-t pt-4">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-gray-600">
                  {assignedEvents.length} of {allevents?.length || 0} events assigned
                </div>
                <Button variant="outline" onClick={() => setEventAssignmentUser(null)} className="hover:bg-gray-50">
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Edit User</DialogTitle>
              <DialogDescription>Update user information and settings</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="edit-name"
                  value={formdata?.name || ""}
                  onChange={(e) => dispatch(setFormData({ name: e.target.value }))}
                  placeholder="Enter full name"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formdata?.email || ""}
                  onChange={(e) => dispatch(setFormData({ email: e.target.value }))}
                  placeholder="Enter email address"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="edit-phone"
                  value={formdata?.phone || ""}
                  onChange={(e) => dispatch(setFormData({ phone: e.target.value }))}
                  placeholder="Enter phone number"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address" className="text-sm font-medium">
                  Address
                </Label>
                <Input
                  id="edit-address"
                  value={formdata?.address || ""}
                  onChange={(e) => dispatch(setFormData({ address: e.target.value }))}
                  placeholder="Enter full address"
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role" className="text-sm font-medium">
                  Role
                </Label>
                <Select
                  value={formdata?.role || ""}
                  onValueChange={(value: "organizer" | "attendee") => dispatch(setFormData({ role: value }))}
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organizer">Organizer</SelectItem>
                    <SelectItem value="attendee">Attendee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditedUser} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </div>
                ) : (
                  "Update User"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirmUser} onOpenChange={() => setDeleteConfirmUser(null)}>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-red-600">Delete User</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete <span className="font-semibold">{deleteConfirmUser?.name}</span>?
                </p>
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md">
                  ⚠️ This action cannot be undone. All user data will be permanently removed.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setDeleteConfirmUser(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteConfirmUser && handleDeleteUser(deleteConfirmUser._id)}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </div>
                  ) : (
                    "Delete User"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Deactivate/Activate Confirmation Dialog */}
        <Dialog open={!!deactivateConfirmUser} onOpenChange={() => setDeactivateConfirmUser(null)}>
          
          <DialogTitle>
            {deactivateConfirmUser?.status === "Active" ? "Deactivate User" : "Activate User"}
          </DialogTitle>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  deactivateConfirmUser?.status === "Active" ? "bg-orange-100" : "bg-green-100"
                }`}
              >
                {deactivateConfirmUser?.status === "Active" ? (
                  <UserX className="w-8 h-8 text-orange-600" />
                ) : (
                  <UserCheck className="w-8 h-8 text-green-600" />
                )}
              </div>
              <div className="text-center space-y-2">
                <h3
                  className={`text-xl font-semibold ${
                    deactivateConfirmUser?.status === "Active" ? "text-orange-600" : "text-green-600"
                  }`}
                >
                  {deactivateConfirmUser?.status === "Active" ? "Deactivate" : "Activate"} User
                </h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to {deactivateConfirmUser?.status === "Active" ? "deactivate" : "activate"}{" "}
                  <span className="font-semibold">{deactivateConfirmUser?.name}</span>?
                </p>
                {deactivateConfirmUser?.status === "Active" && (
                  <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded-md">
                    ⚠️ This user will lose access to the system until reactivated.
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setDeactivateConfirmUser(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => deactivateConfirmUser && handleToggleUserStatus()}
                  className={
                    deactivateConfirmUser?.status === "Active"
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-green-600 hover:bg-green-700"
                  }
                >
                  {deactivateConfirmUser?.status === "Active" ? "inActive" : "Activate"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">No users found</h3>
              <p className="text-gray-500 mb-4 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                  ? "No users match your current search and filter criteria. Try adjusting your filters or search terms."
                  : "Get started by adding your first user to the system."}
              </p>
              {(searchTerm || statusFilter !== "all" || roleFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setRoleFilter("all")
                    setCurrentPage(1)
                  }}
                  className="mt-2"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default UserManagement
