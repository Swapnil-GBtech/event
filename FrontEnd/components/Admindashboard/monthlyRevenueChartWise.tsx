"use client"

import { useState } from "react"
import { TrendingUp, ArrowLeft, Calendar, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

// Complete 12 months data - replace with your API data
const monthlyData = {
  January: {
    _id: "January",
    totalRevenue: 1250.5,
    averagePrice: 208.42,
    payments: [
      {
        _id: "1",
        amount: 300,
        username: "Rahul Sharma",
        ordername: "Birthday Party",
        status: "paid",
        createdAt: "2025-01-15T10:30:00.000Z",
      },
      {
        _id: "2",
        amount: 450.5,
        username: "Priya Singh",
        ordername: "Wedding Function",
        status: "paid",
        createdAt: "2025-01-20T14:15:00.000Z",
      },
      {
        _id: "3",
        amount: 500,
        username: "Amit Kumar",
        ordername: "Anniversary",
        status: "paid",
        createdAt: "2025-01-25T16:45:00.000Z",
      },
    ],
  },
  February: {
    _id: "February",
    totalRevenue: 890.75,
    averagePrice: 222.69,
    payments: [
      {
        _id: "4",
        amount: 200,
        username: "Sneha Patel",
        ordername: "Engagement Ceremony",
        status: "paid",
        createdAt: "2025-02-10T11:20:00.000Z",
      },
      {
        _id: "5",
        amount: 340.75,
        username: "Vikash Gupta",
        ordername: "Holi Celebration",
        status: "paid",
        createdAt: "2025-02-18T13:30:00.000Z",
      },
      {
        _id: "6",
        amount: 350,
        username: "Ravi Verma",
        ordername: "Office Party",
        status: "paid",
        createdAt: "2025-02-28T17:00:00.000Z",
      },
    ],
  },
  March: {
    _id: "March",
    totalRevenue: 1580.25,
    averagePrice: 263.38,
    payments: [
      {
        _id: "7",
        amount: 600,
        username: "Anjali Mehta",
        ordername: "Wedding Reception",
        status: "paid",
        createdAt: "2025-03-05T12:00:00.000Z",
      },
      {
        _id: "8",
        amount: 480.25,
        username: "Suresh Yadav",
        ordername: "Birthday Bash",
        status: "paid",
        createdAt: "2025-03-15T15:30:00.000Z",
      },
      {
        _id: "9",
        amount: 500,
        username: "Kavita Joshi",
        ordername: "Farewell Party",
        status: "paid",
        createdAt: "2025-03-25T18:45:00.000Z",
      },
    ],
  },
  April: {
    _id: "April",
    totalRevenue: 2100.8,
    averagePrice: 350.13,
    payments: [
      {
        _id: "10",
        amount: 750,
        username: "Deepak Singh",
        ordername: "Grand Wedding",
        status: "paid",
        createdAt: "2025-04-08T09:15:00.000Z",
      },
      {
        _id: "11",
        amount: 650.8,
        username: "Meera Sharma",
        ordername: "Baby Shower",
        status: "paid",
        createdAt: "2025-04-18T14:20:00.000Z",
      },
      {
        _id: "12",
        amount: 700,
        username: "Rohit Kumar",
        ordername: "Corporate Event",
        status: "paid",
        createdAt: "2025-04-28T16:30:00.000Z",
      },
    ],
  },
  May: {
    _id: "May",
    totalRevenue: 1750.6,
    averagePrice: 437.65,
    payments: [
      {
        _id: "13",
        amount: 800,
        username: "Sunita Agarwal",
        ordername: "Golden Jubilee",
        status: "paid",
        createdAt: "2025-05-10T11:45:00.000Z",
      },
      {
        _id: "14",
        amount: 450.6,
        username: "Manoj Tiwari",
        ordername: "Graduation Party",
        status: "paid",
        createdAt: "2025-05-20T13:15:00.000Z",
      },
      {
        _id: "15",
        amount: 500,
        username: "Pooja Gupta",
        ordername: "House Warming",
        status: "paid",
        createdAt: "2025-05-30T19:00:00.000Z",
      },
    ],
  },
  June: {
    _id: "June",
    totalRevenue: 1320.4,
    averagePrice: 330.1,
    payments: [
      {
        _id: "16",
        amount: 400,
        username: "Arjun Patel",
        ordername: "Summer Party",
        status: "paid",
        createdAt: "2025-06-05T14:30:00.000Z",
      },
      {
        _id: "17",
        amount: 520.4,
        username: "Nisha Gupta",
        ordername: "Wedding Anniversary",
        status: "paid",
        createdAt: "2025-06-15T16:45:00.000Z",
      },
      {
        _id: "18",
        amount: 400,
        username: "Karan Singh",
        ordername: "Birthday Celebration",
        status: "paid",
        createdAt: "2025-06-25T18:20:00.000Z",
      },
    ],
  },
  July: {
    _id: "July",
    totalRevenue: 980.3,
    averagePrice: 245.08,
    payments: [
      {
        _id: "19",
        amount: 250,
        username: "Ritu Sharma",
        ordername: "Monsoon Party",
        status: "paid",
        createdAt: "2025-07-08T12:15:00.000Z",
      },
      {
        _id: "20",
        amount: 330.3,
        username: "Ajay Kumar",
        ordername: "Family Function",
        status: "paid",
        createdAt: "2025-07-18T15:30:00.000Z",
      },
      {
        _id: "21",
        amount: 400,
        username: "Sonia Verma",
        ordername: "Office Celebration",
        status: "paid",
        createdAt: "2025-07-28T17:45:00.000Z",
      },
    ],
  },
  August: {
    _id: "August",
    totalRevenue: 707.9999,
    averagePrice: 141.59998000000002,
    payments: [
      {
        _id: "688cdbdd7ff1a5ff1dbdc490",
        amount: 1.9999,
        username: "Navazish Chouhan",
        ordername: "Award Saremoney",
        status: "paid",
        createdAt: "2025-08-01T15:23:09.665Z",
      },
      {
        _id: "688cdc8a7ff1a5ff1dbdc4ad",
        amount: 5,
        username: "Navazish Chouhan",
        ordername: "junaid ki shaadii",
        status: "paid",
        createdAt: "2025-08-01T15:26:02.959Z",
      },
      {
        _id: "688cdfd67ff1a5ff1dbdc4df",
        amount: 1,
        username: "faizaan Khan",
        ordername: "Wedding Ceremony",
        status: "paid",
        createdAt: "2025-08-01T15:40:07.005Z",
      },
      {
        _id: "688ce04ef3171e5d5e32be99",
        amount: 200,
        username: "faizaan Khan",
        ordername: "Anniversary Celebration",
        status: "paid",
        createdAt: "2025-08-01T15:42:06.464Z",
      },
      {
        _id: "688cf17f5145b231e71cabcc",
        amount: 500,
        username: "faizaan Khan",
        ordername: "junaid ki shaadii",
        status: "paid",
        createdAt: "2025-08-01T16:55:27.881Z",
      },
    ],
  },
  September: {
    _id: "September",
    totalRevenue: 1890.7,
    averagePrice: 378.14,
    payments: [
      {
        _id: "22",
        amount: 600,
        username: "Manish Agarwal",
        ordername: "Ganesh Festival",
        status: "paid",
        createdAt: "2025-09-10T11:30:00.000Z",
      },
      {
        _id: "23",
        amount: 590.7,
        username: "Preeti Singh",
        ordername: "Navratri Celebration",
        status: "paid",
        createdAt: "2025-09-20T14:45:00.000Z",
      },
      {
        _id: "24",
        amount: 700,
        username: "Rajesh Kumar",
        ordername: "Wedding Function",
        status: "paid",
        createdAt: "2025-09-28T16:20:00.000Z",
      },
    ],
  },
  October: {
    _id: "October",
    totalRevenue: 2250.9,
    averagePrice: 450.18,
    payments: [
      {
        _id: "25",
        amount: 800,
        username: "Divya Patel",
        ordername: "Diwali Celebration",
        status: "paid",
        createdAt: "2025-10-08T13:15:00.000Z",
      },
      {
        _id: "26",
        amount: 750.9,
        username: "Sunil Gupta",
        ordername: "Karva Chauth",
        status: "paid",
        createdAt: "2025-10-18T15:30:00.000Z",
      },
      {
        _id: "27",
        amount: 700,
        username: "Anita Sharma",
        ordername: "Festival Party",
        status: "paid",
        createdAt: "2025-10-28T17:45:00.000Z",
      },
    ],
  },
  November: {
    _id: "November",
    totalRevenue: 1680.5,
    averagePrice: 420.13,
    payments: [
      {
        _id: "28",
        amount: 550,
        username: "Vikram Singh",
        ordername: "Bhai Dooj",
        status: "paid",
        createdAt: "2025-11-05T12:00:00.000Z",
      },
      {
        _id: "29",
        amount: 630.5,
        username: "Kavya Mehta",
        ordername: "Birthday Party",
        status: "paid",
        createdAt: "2025-11-15T14:30:00.000Z",
      },
      {
        _id: "30",
        amount: 500,
        username: "Rohit Verma",
        ordername: "Anniversary",
        status: "paid",
        createdAt: "2025-11-25T16:15:00.000Z",
      },
    ],
  },
  December: {
    _id: "December",
    totalRevenue: 2890.8,
    averagePrice: 578.16,
    payments: [
      {
        _id: "31",
        amount: 1000,
        username: "Arun Kumar",
        ordername: "Christmas Party",
        status: "paid",
        createdAt: "2025-12-10T10:45:00.000Z",
      },
      {
        _id: "32",
        amount: 890.8,
        username: "Neha Agarwal",
        ordername: "New Year Eve",
        status: "paid",
        createdAt: "2025-12-20T18:30:00.000Z",
      },
      {
        _id: "33",
        amount: 1000,
        username: "Deepak Patel",
        ordername: "Year End Celebration",
        status: "paid",
        createdAt: "2025-12-31T20:00:00.000Z",
      },
    ],
  },
}

export default function MonthlyRevenueDashboard({monthlyRevenue}:any) {
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

     

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Prepare chart data for all 12 months
  const chartData = Object.keys(monthlyRevenue).map((month) => ({
    month: month,
    revenue: monthlyRevenue[month].totalRevenue,
    payments: monthlyRevenue[month].payments.length,
    averagePrice: monthlyRevenue[month].averagePrice,
  }))

  const handleBarClick = (data) => {
    setSelectedMonth(data.month)
    setShowDetails(true)
  }

  const getBarColor = (month) => {
    if (selectedMonth === month) return "#10B981" // Green for selected
    return "#3B82F6" // Blue for default
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
 

        {!showDetails ? (
          /* Main Chart View */
          <div className="space-y-8">
            {/* Monthly Revenue Chart */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  Monthly Revenue Overview - 2025
                </CardTitle>
                <CardDescription className="text-base">
                  Interactive chart showing revenue for all 12 months • Hover for details • Click for breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={450}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#374151" }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#374151" }}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}K`}
                    />
                    <Tooltip
                      formatter={(value, name, props) => [formatCurrency(value), "Monthly Revenue"]}
                      labelFormatter={(label) => `${label} 2025`}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        fontSize: "14px",
                      }}
                      labelStyle={{
                        color: "#374151",
                        fontWeight: "bold",
                        marginBottom: "4px",
                      }}
                    />
                    <Bar dataKey="revenue" cursor="pointer" onClick={handleBarClick} radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getBarColor(entry.month)}
                          stroke={selectedMonth === entry.month ? "#059669" : "#2563eb"}
                          strokeWidth={selectedMonth === entry.month ? 2 : 0}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Detailed Month View - Only Payment Details */
          <div className="space-y-6">
            {/* Back Button */}
            <Button
              onClick={() => setShowDetails(false)}
              variant="outline"
              className="flex items-center gap-2 hover:bg-blue-50 border-blue-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Overview
            </Button>

            {/* Selected Month Payment Details */}
            {selectedMonth && monthlyRevenue[selectedMonth] && (
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-white/20 rounded-full">
                      <Calendar className="h-6 w-6" />
                    </div>
                    {selectedMonth} 2025 - Payment Details
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-base">
                    Complete breakdown of all {monthlyRevenue[selectedMonth].payments.length} payments • Total Revenue:{" "}
                    {formatCurrency(monthlyRevenue[selectedMonth].totalRevenue)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-semibold text-gray-700 border-b">S.No.</th>
                          <th className="text-left p-4 font-semibold text-gray-700 border-b">Order Name</th>
                          <th className="text-left p-4 font-semibold text-gray-700 border-b">Customer</th>
                          <th className="text-left p-4 font-semibold text-gray-700 border-b">Amount</th>
                          <th className="text-left p-4 font-semibold text-gray-700 border-b">Status</th>
                          <th className="text-left p-4 font-semibold text-gray-700 border-b">Date & Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyRevenue[selectedMonth].payments.map((payment, index) => (
                          <tr
                            key={payment._id}
                            className={`hover:bg-blue-50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-25"
                            }`}
                          >
                            <td className="p-4 border-b border-gray-100">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                                {index + 1}
                              </div>
                            </td>
                            <td className="p-4 border-b border-gray-100">
                              <div className="font-medium text-gray-900">{payment.ordername}</div>
                            </td>
                            <td className="p-4 border-b border-gray-100">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <Users className="h-4 w-4 text-purple-600" />
                                </div>
                                <span className="text-gray-700">{payment.username}</span>
                              </div>
                            </td>
                            <td className="p-4 border-b border-gray-100">
                              <div className="font-bold text-green-600 text-lg">{formatCurrency(payment.amount)}</div>
                            </td>
                            <td className="p-4 border-b border-gray-100">
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                ✓ {payment.status}
                              </Badge>
                            </td>
                            <td className="p-4 border-b border-gray-100">
                              <div className="text-gray-600 text-sm">{formatDate(payment.createdAt)}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Footer */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        Total {monthlyRevenue[selectedMonth].payments.length} payments in {selectedMonth}
                      </span>
                      <span className="font-bold text-green-600 text-lg">
                        Total: {formatCurrency(monthlyRevenue[selectedMonth].totalRevenue)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
