 
"use client"

import { useState, useEffect } from "react"
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  Grid3X3,
  List,
  MapPin,
  Plus,
  Search,
  Settings,
  Trash2,
  TrendingUp,
  Users,
  XCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getAllEventsThunk } from "../ReduxSlices/CreateEventSlice"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { useAuth } from "@/lib/auth/auth-provider"
import { deleteEvent } from "../ApiServices/ApiServices"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useToast } from "../ui/use-toast"
import { getAllOrganizerAndAttendee } from "../ApiServices/ApiServices"

/* --------------------------------- UTILS ---------------------------------- */
const formatCurrency = (amt: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amt)

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })

const statusColor = (s: string) => {
  switch (s) {
    case "delayed":
      return "bg-orange-600 text-orange-100 border-green-200"
    case "upcoming":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

/* ================================ COMPONENT =============================== */
function EventManagement() {
  /* filters & view */
  const [search, setSearch] = useState("")
  const [cat, setCat] = useState("all")
  const [status, setStatus] = useState("all")
  const [view, setView] = useState<"grid" | "table">("grid")
  const [isloading, setIsLoading] = useState(false)
  const [deleteUser, setDeleteUser] = useState(null)
  const [page, setPage] = useState(1)

  const dispatch = useAppDispatch()
  const { auth } = useAuth()
  const { toast } = useToast()
  const { allevents, loading } = useAppSelector((state) => state.createEvents)
  const [user, setUsers] = useState([])
  const router = useRouter()

  // Page size based on view
  const pageSize = view === "table" ? 10 : 6

  useEffect(() => {
    dispatch(getAllEventsThunk(auth?._id))
  }, [dispatch, auth])

  useEffect(() => {
    setPage(1) // Reset to first page when filters change
  }, [search, cat, status, view])

  const handleDeleteEvenet = async (eventId: string) => {
    if (!eventId) return
    try {
      setIsLoading(true)
      const response = await deleteEvent(auth?._id, eventId)
      console.log("response", response)
      if (response?.statuscode == 200) {
        toast({
          title: "Success",
          description: response?.message || "Event deleted successfully",
        })
        setIsLoading(false)
        dispatch(getAllEventsThunk())
        setDeleteUser(null)
      } else {
        setIsLoading(false)
        toast({
          title: "Error",
          description: response?.message || "Failed to delete event",
          variant: "destructive",
        })
      }
      dispatch(getAllEventsThunk())
      setDeleteUser(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive",
      })
    }
  }

  /* filtered events */
  const filtered =
    allevents?.filter((e) => {
      const mSearch =
        e.Event_title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase()) ||
        e.Category?.Category_name.toLowerCase().includes(search.toLowerCase())
      const mCat = cat === "all" || e.Category?.Category_name === cat
      const mStatus = status === "all" || e.eventstatus === status
      return mSearch && mCat && mStatus
    }) || []

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const sliceStart = (page - 1) * pageSize
  const current = filtered.slice(sliceStart, sliceStart + pageSize)

  /* dashboard totals from API data */
  const totals = {
    events: allevents?.length || 0,
    attendees: allevents?.reduce((a, e) => a + (e.attendee?.length || 0), 0) || 0,
    revenue: allevents?.reduce((a, e) => a + (e.Price || 0) * (e.attendee?.length || 0), 0) || 0,
    commission: allevents?.reduce((a, e) => a + (e.Price || 0) * (e.attendee?.length || 0) * 0.1, 0) || 0, // 10% commission
  }

  const fetchUsers = async () => {
    const response = await getAllOrganizerAndAttendee(auth._id)
    if (response?.statuscode == 200) {
      setUsers(response?.data?.Users)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [auth])

  // Get unique categories from API data
  const categories = [...new Set(allevents?.map((e) => e.Category?.Category_name).filter(Boolean))] || []

  /* ------------------------------- RENDER -------------------------------- */
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all events</p>
        </div>
        <Button onClick={() => router.push("/events/create")} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Events", val: totals.events, icon: <Calendar className="h-4 w-4 text-blue-600" /> },
          {
            label: "Total Attendees",
            val: totals.attendees.toLocaleString(),
            icon: <Users className="h-4 w-4 text-green-600" />,
          },
          
        ].map((c) => (
          <Card key={c.label} className="bg-white shadow-sm border-0">
            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
              <CardTitle className="text-sm text-gray-600">{c.label}</CardTitle>
              {c.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{c.val}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* search & filters */}
      <Card className="bg-white shadow-sm border-0">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* filters */}
            <div className="flex gap-3 w-full lg:w-auto">
              <Select value={cat} onValueChange={setCat}>
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full lg:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {/* view switch + export */}
              <div className="flex bg-gray-100 p-1 rounded-md">
                <Button
                  variant={view === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("grid")}
                  className="h-8"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("table")}
                  className="h-8"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
 
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          <span className="ml-2 text-gray-600">Loading events...</span>
        </div>
      )}

      {/* No events state */}
      {!loading && filtered.length === 0 && (
        <Card className="bg-white shadow-sm border-0">
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              {search || cat !== "all" || status !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first event"}
            </p>
            {!search && cat === "all" && status === "all" && (
              <Button onClick={() => router.push("/events/create")} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* events list */}
      {!loading && filtered.length > 0 && (
        <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "table")}>
          {/* GRID ------------------------------------------------------------- */}
          <TabsContent value="grid" className="space-y-6">
            {/* cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {current.map((e) => (
                <Card key={e?._id} className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                  {/* image */}
                  <div className="relative">
                    <img
                      src={e?.image || "/placeholder.svg"}
                      alt={e?.Event_title}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(ev) => {
                        ;(ev.target as HTMLImageElement).src =
                          `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(e?.Event_title)}`
                      }}
                    />
                    <Badge className={`absolute top-3 right-3 ${statusColor(e?.eventstatus)}`}>{e?.eventstatus}</Badge>
                  </div>
                  {/* body */}
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{e.Event_title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{e.Description}</p>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(e?.Date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {e?.Time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {e?.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {e?.attendee?.length || 0} attendees
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {formatCurrency(e?.Price || 0)}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Link href={`/events/${e._id}`} className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <Link href={`/events/edit/${e._id}`} className="flex items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteUser(e)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* pagination for grid */}
            {totalPages > 1 && (
              <Pager
                page={page}
                setPage={setPage}
                total={totalPages}
                totalItems={filtered.length}
                pageSize={pageSize}
              />
            )}
          </TabsContent>

          {/* TABLE ------------------------------------------------------------ */}
          <TabsContent value="table">
            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      {["Event Details", "Category", "Date & Time", "Price", "Attendees", "Status", "Actions"].map(
                        (h) => (
                          <TableHead key={h} className="font-semibold text-gray-900">
                            {h}
                          </TableHead>
                        ),
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {current.map((e) => (
                      <TableRow key={e._id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={e?.image || "/placeholder.svg"}
                              alt={e?.Event_title}
                              className="w-12 h-12 object-cover rounded"
                              onError={(ev) => {
                                ;(ev.target as HTMLImageElement).src =
                                  `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(e?.Event_title)}`
                              }}
                            />
                            <div>
                              <p className="font-medium text-gray-900">{e?.Event_title}</p>
                              <p className="text-xs text-gray-600 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {e?.location}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {e.Category?.Category_name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-gray-900">{formatDate(e.Date)}</p>
                          <p className="text-xs text-gray-600">{e.Time}</p>
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">{formatCurrency(e?.Price || 0)}</TableCell>
                        <TableCell className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          {e.attendee?.length || 0}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColor(e?.eventstatus)}>{e?.eventstatus}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem>
                                <Link href={`/events/${e._id}`} className="flex items-center">
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link href={`/events/edit/${e._id}`} className="flex items-center">
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setDeleteUser(e)} className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {/* pagination for table */}
            {totalPages > 1 && (
              <Pager
                page={page}
                setPage={setPage}
                total={totalPages}
                totalItems={filtered.length}
                pageSize={pageSize}
              />
            )}
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">Are you sure?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertTriangle className="w-16 h-16 text-red-600" />
            <p className="text-sm text-muted-foreground text-center">
              This action cannot be undone. This will permanently delete the event{" "}
              <span className="font-semibold">{deleteUser?.Event_title}</span> and remove all its data from the system.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteUser(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => deleteUser && handleDeleteEvenet(deleteUser?._id)}
                className="bg-red-600 hover:bg-red-700"
              >
                {isloading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  "Delete Event"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ----------------------------- Pager helper ------------------------------ */
type PagerProps = {
  page: number
  setPage: (n: number) => void
  total: number
  totalItems: number
  pageSize: number
}

function Pager({ page, setPage, total, totalItems, pageSize }: PagerProps) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <Card className="bg-white shadow-sm border-0">
      <CardContent className="p-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {start}–{end} of {totalItems}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-white"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>

          {/* Show page numbers with ellipsis for large page counts */}
          {total <= 7 ? (
            // Show all pages if 7 or fewer
            Array.from({ length: total }, (_, i) => i + 1).map((n) => (
              <Button
                key={n}
                variant={n === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(n)}
                className={n === page ? "bg-blue-600 text-white" : "bg-white"}
              >
                {n}
              </Button>
            ))
          ) : (
            // Show pages with ellipsis
            <>
              {page > 3 && (
                <>
                  <Button variant="outline" size="sm" onClick={() => setPage(1)} className="bg-white">
                    1
                  </Button>
                  {page > 4 && <span className="px-2 text-gray-500">...</span>}
                </>
              )}

              {Array.from({ length: Math.min(5, total) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(total - 4, page - 2)) + i
                if (pageNum > total) return null
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className={pageNum === page ? "bg-blue-600 text-white" : "bg-white"}
                  >
                    {pageNum}
                  </Button>
                )
              })}

              {page < total - 2 && (
                <>
                  {page < total - 3 && <span className="px-2 text-gray-500">...</span>}
                  <Button variant="outline" size="sm" onClick={() => setPage(total)} className="bg-white">
                    {total}
                  </Button>
                </>
              )}
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(total, p + 1))}
            disabled={page === total}
            className="bg-white"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default EventManagement
