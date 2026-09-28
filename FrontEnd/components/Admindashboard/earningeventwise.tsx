"use client"

import { useState } from "react"
import { CalendarDays, TrendingUp, Users, Eye, EyeOff, IndianRupee } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { motion, AnimatePresence } from "framer-motion"

// Sample data based on your API response
// const apiData = {
//   statuscode: 200,
//   data: {
//     "junaid ki shaadii": {
//       _id: "junaid ki shaadii",
//       totalRevenue: 505,
//       averagePrice: 252.5,
//       payments: [
//         {
//           _id: "688cdc8a7ff1a5ff1dbdc4ad",
//           amount: 5,
//           username: "Navazish Chouhan",
//           ordername: "junaid ki shaadii",
//           status: "paid",
//           createdAt: "2025-08-01T15:26:02.959Z",
//         },
//         {
//           _id: "688cf17f5145b231e71cabcc",
//           amount: 500,
//           username: "faizaan Khan",
//           ordername: "junaid ki shaadii",
//           status: "paid",
//           createdAt: "2025-08-01T16:55:27.881Z",
//         },
//       ],
//     },
//     "Anniversary Celebration": {
//       _id: "Anniversary Celebration",
//       totalRevenue: 200,
//       averagePrice: 200,
//       payments: [
//         {
//           _id: "688ce04ef3171e5d5e32be99",
//           amount: 200,
//           username: "faizaan Khan",
//           ordername: "Anniversary Celebration",
//           status: "paid",
//           createdAt: "2025-08-01T15:42:06.464Z",
//         },
//       ],
//     },
//     "Award Saremoney": {
//       _id: "Award Saremoney",
//       totalRevenue: 1.9999,
//       averagePrice: 1.9999,
//       payments: [
//         {
//           _id: "688cdbdd7ff1a5ff1dbdc490",
//           amount: 1.9999,
//           username: "Navazish Chouhan",
//           ordername: "Award Saremoney",
//           status: "paid",
//           createdAt: "2025-08-01T15:23:09.665Z",
//         },
//       ],
//     },
//     "Wedding Ceremony": {
//       _id: "Wedding Ceremony",
//       totalRevenue: 1,
//       averagePrice: 1,
//       payments: [
//         {
//           _id: "688cdfd67ff1a5ff1dbdc4df",
//           amount: 1,
//           username: "faizaan Khan",
//           ordername: "Wedding Ceremony",
//           status: "paid",
//           createdAt: "2025-08-01T15:40:07.005Z",
//         },
//       ],
//     },
//   },
//   message: "Event-wise revenue fetched successfully",
//   success: true,
// }

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
}

const paymentRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: {
            duration: 0.2,
        },
    },
}

const expandVariants = {
    hidden: {
        opacity: 0,
        height: 0,
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
    visible: {
        opacity: 1,
        height: "auto",
        transition: {
            duration: 0.4,
            ease: "easeInOut",
        },
    },
}

export default function EventRevenueDashboard({ eventRevenue }: any) {
    const [expandedEvents, setExpandedEvents] = useState<string[]>([])


    const events = Object.values(eventRevenue)

    // Calculate summary statistics
    const totalRevenue = events.reduce((sum, event) => sum + event.totalRevenue, 0)
    const totalEvents = events.length
    const totalPayments = events.reduce((sum, event) => sum + event.payments.length, 0)
    const averageRevenuePerEvent = totalRevenue / totalEvents

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        }).format(amount)
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

    const toggleEventExpansion = (eventId: string) => {
        setExpandedEvents((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]))
    }

    return (
        <div className="min-h-screen md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-2"
                >
                </motion.div>

                {/* Summary Cards */}
                   
                    <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <IndianRupee className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                                <p className="text-xs opacity-90">Across all events</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                                <CalendarDays className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalEvents}</div>
                                <p className="text-xs opacity-90">Active events</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                                <Users className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalPayments}</div>
                                <p className="text-xs opacity-90">Successful transactions</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Revenue/Event</CardTitle>
                                <TrendingUp className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(averageRevenuePerEvent)}</div>
                                <p className="text-xs opacity-90">Per event average</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
                   

                {/* Events Table */}
                
                   <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Card className="border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <IndianRupee className="h-5 w-5 text-green-600" />
                                Event Revenue Details
                            </CardTitle>
                            <CardDescription>Detailed breakdown of revenue by event</CardDescription>
                        </CardHeader>


                        <CardContent>
                            <div className="space-y-4">
                                {events?.map((event, index) => (
                                    <motion.div
                                        key={event._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                    >


                                        <Collapsible>
                                            <div className="border rounded-lg overflow-hidden">
                                                <CollapsibleTrigger asChild>
                                                    <motion.div
                                                        className="cursor-pointer w-full"
                                                        onClick={() => toggleEventExpansion(event?._id)}
                                                    >
                                                        <div className="flex items-center justify-between w-full p-4">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="text-left">
                                                                    <h3 className="font-semibold text-lg">{event?._id}</h3>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {event?.payments.length} payment{event?.payments.length !== 1 ? "s" : ""}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-4">
                                                                <div className="text-right">
                                                                    <p className="font-bold text-lg text-green-600">
                                                                        {formatCurrency(event?.totalRevenue)}
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Avg: {formatCurrency(event?.averagePrice)}
                                                                    </p>
                                                                </div>
                                                                <motion.div
                                                                    animate={{ rotate: expandedEvents.includes(event._id) ? 180 : 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                >
                                                                    {expandedEvents.includes(event._id) ? (
                                                                        <EyeOff className="h-4 w-4" />
                                                                    ) : (
                                                                        <Eye className="h-4 w-4" />
                                                                    )}
                                                                </motion.div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </CollapsibleTrigger>

                                                <AnimatePresence>
                                                    {expandedEvents.includes(event._id) && (
                                                        <CollapsibleContent forceMount>
                                                            <motion.div
                                                                variants={expandVariants}
                                                                initial="hidden"
                                                                animate="visible"
                                                                exit="hidden"
                                                                className="border-t bg-gray-50/50"
                                                            >
                                                                <div className="p-4">
                                                                    <motion.h4
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        transition={{ delay: 0.2 }}
                                                                        className="font-medium mb-3 flex items-center gap-2"
                                                                    >
                                                                        <IndianRupee className="h-4 w-4 text-green-600" />
                                                                        Payment Details
                                                                    </motion.h4>
                                                                    <div className="overflow-hidden rounded-lg border bg-white">
                                                                        <Table>
                                                                            <TableHeader>
                                                                                <TableRow className="bg-gray-50">
                                                                                    <TableHead className="font-semibold">Customer</TableHead>
                                                                                    <TableHead className="font-semibold">Amount</TableHead>
                                                                                    <TableHead className="font-semibold">Status</TableHead>
                                                                                    <TableHead className="font-semibold">Date</TableHead>
                                                                                </TableRow>
                                                                            </TableHeader>
                                                                            <TableBody>
                                                                                <AnimatePresence>
                                                                                    {event.payments.map((payment, paymentIndex) => (
                                                                                        <motion.tr
                                                                                            key={payment._id}
                                                                                            variants={paymentRowVariants}
                                                                                            initial="hidden"
                                                                                            animate="visible"
                                                                                            exit="exit"
                                                                                            transition={{ delay: paymentIndex * 0.1 }}
                                                                                            className="hover:bg-gray-50/50 transition-colors"
                                                                                        >
                                                                                            <TableCell className="font-medium">{payment.username}</TableCell>
                                                                                            <TableCell>
                                                                                                <motion.span
                                                                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                                                                    animate={{ scale: 1, opacity: 1 }}
                                                                                                    transition={{ delay: paymentIndex * 0.1 + 0.2 }}
                                                                                                    className="font-semibold text-green-600 inline-flex items-center gap-1"
                                                                                                >
                                                                                                    <IndianRupee className="h-3 w-3" />
                                                                                                    {formatCurrency(payment.amount).replace("₹", "")}
                                                                                                </motion.span>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <motion.div
                                                                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                                                                    animate={{ scale: 1, opacity: 1 }}
                                                                                                    transition={{ delay: paymentIndex * 0.1 + 0.3 }}
                                                                                                >
                                                                                                    <Badge
                                                                                                        variant={payment.status === "paid" ? "default" : "secondary"}
                                                                                                        className={
                                                                                                            payment.status === "paid"
                                                                                                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                                                                                : ""
                                                                                                        }
                                                                                                    >
                                                                                                        {payment.status}
                                                                                                    </Badge>
                                                                                                </motion.div>
                                                                                            </TableCell>
                                                                                            <TableCell className="text-sm text-muted-foreground">
                                                                                                <motion.span
                                                                                                    initial={{ opacity: 0 }}
                                                                                                    animate={{ opacity: 1 }}
                                                                                                    transition={{ delay: paymentIndex * 0.1 + 0.4 }}
                                                                                                >
                                                                                                    {formatDate(payment.createdAt)}
                                                                                                </motion.span>
                                                                                            </TableCell>
                                                                                        </motion.tr>
                                                                                    ))}
                                                                                </AnimatePresence>
                                                                            </TableBody>
                                                                        </Table>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        </CollapsibleContent>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </Collapsible>


                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                 
            </div>
        </div>
    )
}
