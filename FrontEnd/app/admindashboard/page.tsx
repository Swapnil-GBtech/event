"use client"

import { useEffect, useState } from "react"
import {
    Users,
    Calendar,
    DollarSign,
    Bell,
    BarChart3,
    Plus,
    Send,

} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import UserManagement from "@/components/Admindashboard/UserManagement"
import AdmindashboardHome from "@/components/Admindashboard/homedashboard"
import EventManagement from "@/components/Admindashboard/eventmanagement"
import RevenueDashboard from "@/components/Admindashboard/revenueanalytics"
import { useAuth } from "@/lib/auth/auth-provider"
import { getRevenue } from "@/components/ApiServices/ApiServices"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar"
import CategoriesTable from "@/components/dashboard/CategoriesTable"


const sidebarItems = [
    { title: "Dashboard", icon: BarChart3, id: "dashboard" },
    { title: "Events Management", icon: Calendar, id: "events" },
    { title: "Users Management", icon: Users, id: "users" },
    { title: "Revenue Analytics", icon: DollarSign, id: "revenue" },
    { title: "Notifications", icon: Bell, id: "notifications" },
    { title: "Categoryes", icon: Bell, id: "Categoryes" },
]


function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard")
     const {auth} = useAuth();

     useEffect(()=>{
        const   handlegetpayment = async()=>{
            const response = await getRevenue(auth?._id);
        }
        handlegetpayment()
     },[auth])


    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <AdmindashboardHome />
            case "users":
                return <UserManagement />
            case "events":
                return <EventManagement />
            case "revenue":
                return <RevenueDashboard />
           case "Categoryes":
                return <CategoriesTable />
            case "notifications":
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Platform Notifications</h2>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-500 hover:bg-blue-600">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Send Notification
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Send Platform-wide Notification</DialogTitle>
                                        <DialogDescription>Send a notification to all users or specific groups</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="title">Title</Label>
                                            <Input id="title" placeholder="Notification title" />
                                        </div>
                                        <div>
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea id="message" placeholder="Notification message" />
                                        </div>
                                        <div>
                                            <Label htmlFor="audience">Audience</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select audience" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Users</SelectItem>
                                                    <SelectItem value="organizers">Organizers Only</SelectItem>
                                                    <SelectItem value="attendees">Attendees Only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="urgent" />
                                            <Label htmlFor="urgent">Mark as urgent</Label>
                                        </div>
                                        <Button className="w-full bg-blue-500 hover:bg-blue-600">
                                            <Send className="h-4 w-4 mr-2" />
                                            Send Notification
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid gap-4">
                            <Card className="border-l-4 border-l-green-500">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">System Maintenance Completed</h3>
                                            <p className="text-sm text-gray-600">All systems are now operational</p>
                                            <p className="text-xs text-gray-500">Sent 2 hours ago • All Users</p>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800">Sent</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-blue-500">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">New Feature Release</h3>
                                            <p className="text-sm text-gray-600">Enhanced event analytics now available</p>
                                            <p className="text-xs text-gray-500">Sent 1 day ago • Organizers</p>
                                        </div>
                                        <Badge className="bg-blue-100 text-blue-800">Sent</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )
        }
    }


    return (
        <SidebarProvider className="mt-[50px]">
            <Sidebar className="border-r border-gray-200 bg-white">
                <SidebarContent className="bg-white">
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-gray-900 text-lg font-bold px-4 py-6">
                            Admin Control Panel
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {sidebarItems.map((item) => (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton
                                            onClick={() => setActiveTab(item.id)}
                                            isActive={activeTab === item.id}
                                            className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700"
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex items-center justify-between w-full">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="sm" className="border-gray-300 bg-white hover:bg-gray-50">
                                <Bell className="h-4 w-4 mr-2" />
                                Notifications
                                <Badge className="ml-2 bg-red-500">3</Badge>
                            </Button>

                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 bg-gray-50 overflow-auto">{renderContent()}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AdminDashboard




