"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  Calendar,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  Activity,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PaymentHistory({paymentshistry}:any) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterMonth, setFilterMonth] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const filteredPayments = paymentshistry?.filter((payment:any) => {
    const matchesSearch =
      payment.ordername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || payment.status === filterStatus
    const matchesMonth = filterMonth === "all" || payment.monthName.toLowerCase() === filterMonth.toLowerCase()

    return matchesSearch && matchesStatus && matchesMonth
  })

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPayments = filteredPayments.slice(startIndex, endIndex)

  // Reset to first page when filters change
  const handleFilterChange = (setter: (value: string) => void, value: string) => {
    setter(value)
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
            <p className="text-muted-foreground">Track and manage all your payment transactions</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by order name, username, or order ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={(value) => handleFilterChange(setFilterStatus, value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterMonth} onValueChange={(value) => handleFilterChange(setFilterMonth, value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
      </div>

      {/* Colorful Summary Cards at Top */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Transactions</p>
                <p className="text-3xl font-bold">{filteredPayments.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Activity className="h-6 w-6" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Successful Payments</p>
                <p className="text-3xl font-bold">{filteredPayments.filter((p) => p.status === "paid").length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Amount</p>
                <p className="text-3xl font-bold">{formatAmount(totalAmount)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Cards */}
      <div className="grid gap-4">
        {currentPayments.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No payments found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          currentPayments?.map((payment:any) => (
            <Card key={payment?._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{payment?.ordername}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {payment?.username}
                    </CardDescription>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-2xl font-bold text-green-600">{formatAmount(payment?.amount)}</div>
                    <Badge
                      variant={payment?.status === "paid" ? "default" : "secondary"}
                      className={payment?.status === "paid" ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {payment.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      Payment ID
                    </div>
                    <div className="font-mono text-xs bg-muted px-2 py-1 rounded">{payment?.paymentId}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      Order ID
                    </div>
                    <div className="font-mono text-xs bg-muted px-2 py-1 rounded">{payment?.orderId}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Transaction Date
                    </div>
                    <div className="font-medium">{formatDate(payment.createdAt)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredPayments.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredPayments.length)} of {filteredPayments.length}{" "}
            payments
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
