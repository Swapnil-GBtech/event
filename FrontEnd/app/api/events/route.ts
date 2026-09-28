import { NextResponse } from "next/server"
import { z } from "zod"
import { events } from "@/lib/data"

// GET all events with optional filtering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  let filteredEvents = [...events]

  // Filter by category
  const category = searchParams.get("category")
  if (category) {
    filteredEvents = filteredEvents.filter((event) => event.category.toLowerCase() === category.toLowerCase())
  }

  // Filter by date range
  const filter = searchParams.get("filter")
  if (filter) {
    const now = new Date()

    if (filter === "today") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      filteredEvents = filteredEvents.filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate >= today && eventDate < tomorrow
      })
    } else if (filter === "this-weekend") {
      const today = new Date()
      const dayOfWeek = today.getDay() // 0 = Sunday, 6 = Saturday

      const daysUntilWeekend = dayOfWeek === 0 || dayOfWeek === 6 ? 0 : 5 - dayOfWeek

      const weekendStart = new Date(today)
      weekendStart.setDate(today.getDate() + daysUntilWeekend)
      weekendStart.setHours(0, 0, 0, 0)

      const weekendEnd = new Date(weekendStart)
      weekendEnd.setDate(weekendStart.getDate() + 2) // Weekend is 2 days

      filteredEvents = filteredEvents.filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate >= weekendStart && eventDate < weekendEnd
      })
    } else if (filter === "this-month") {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

      filteredEvents = filteredEvents.filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate >= firstDayOfMonth && eventDate < firstDayOfNextMonth
      })
    } else if (filter === "popular") {
      // Sort by attendees count (descending)
      filteredEvents.sort((a, b) => b.attendees - a.attendees)
      // Take top 10
      filteredEvents = filteredEvents.slice(0, 10)
    }
  }

  // Search by title or description
  const search = searchParams.get("search")
  if (search) {
    const searchLower = search.toLowerCase()
    filteredEvents = filteredEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(searchLower) || event.description.toLowerCase().includes(searchLower),
    )
  }

  return NextResponse.json({ events: filteredEvents })
}

// POST to create a new event
const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string(),
  time: z.string(),
  location: z.string().min(3, "Location must be at least 3 characters"),
  category: z.string(),
  price: z.number().min(0, "Price cannot be negative"),
  image: z.string().optional(),
  organizerId: z.string(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const result = eventSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    // In a real app, you would save to database
    const newEvent = {
      id: `event_${Date.now()}`,
      ...result.data,
      attendees: 0,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        event: newEvent,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create event error:", error)
    return NextResponse.json(
      { error: "Failed to create event", message: "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
