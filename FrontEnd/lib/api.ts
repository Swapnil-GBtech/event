import type { User, Event, Category, Booking, Testimonial } from "@/lib/types"

// Mock data for users
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@events.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Event Organizer",
    email: "organizer@events.com",
    role: "organizer",
  },
  {
    id: "3",
    name: "Event Attendee",
    email: "attendee@events.com",
    role: "attendee",
  },
]

// Mock data for events
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Summer Music Festival",
    description:
      "Join us for a weekend of amazing music performances from top artists across multiple genres. Enjoy food, drinks, and a great atmosphere with fellow music lovers.",
    date: "2023-07-15T18:00:00.000Z",
    location: "Central Park, New York",
    category: "concert",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    organizer: "Music Events Inc.",
    organizerId: "2",
    attendees: 1250,
  },
  {
    id: "2",
    title: "Tech Conference 2023",
    description:
      "The premier tech conference featuring keynotes from industry leaders, workshops, networking opportunities, and the latest in technology innovations.",
    date: "2023-09-10T09:00:00.000Z",
    location: "Convention Center, San Francisco",
    category: "conference",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    organizer: "TechEvents Co.",
    organizerId: "2",
    attendees: 3500,
  },
  {
    id: "3",
    title: "Sarah & Michael's Wedding",
    description:
      "Celebrate the union of Sarah and Michael with a beautiful ceremony followed by dinner and dancing. Please RSVP by August 1st.",
    date: "2023-08-20T16:00:00.000Z",
    location: "Rosewood Gardens, Los Angeles",
    category: "wedding",
    price: 0,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    organizer: "Sarah Johnson",
    organizerId: "2",
    attendees: 150,
  },
  {
    id: "4",
    title: "Business Leadership Seminar",
    description:
      "A one-day intensive seminar on effective leadership strategies for modern businesses. Learn from top executives and network with peers.",
    date: "2023-06-05T10:00:00.000Z",
    location: "Grand Hotel, Chicago",
    category: "seminar",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    organizer: "Business Growth Institute",
    organizerId: "1",
    attendees: 200,
  },
  {
    id: "5",
    title: "New Year's Eve Gala",
    description:
      "Ring in the new year with an elegant gala featuring gourmet dining, live entertainment, dancing, and a champagne toast at midnight.",
    date: "2023-12-31T20:00:00.000Z",
    location: "Luxury Hotel Ballroom, Miami",
    category: "party",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    organizer: "Elite Events",
    organizerId: "1",
    attendees: 500,
  },
  {
    id: "6",
    title: "Charity Run for Education",
    description:
      "Join our annual 5K run/walk to raise funds for educational programs in underserved communities. All proceeds go directly to local schools.",
    date: "2023-10-15T08:00:00.000Z",
    location: "Riverside Park, Boston",
    category: "charity",
    price: 25,
    image:
      "https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    organizer: "Education Foundation",
    organizerId: "2",
    attendees: 750,
  },
]

// Mock data for bookings
const mockBookings: Booking[] = [
  {
    id: "1",
    userId: "3",
    eventId: "1",
    bookingDate: "2023-06-01T10:30:00.000Z",
    status: "confirmed",
    event: mockEvents[0],
  },
  {
    id: "2",
    userId: "3",
    eventId: "2",
    bookingDate: "2023-07-15T14:45:00.000Z",
    status: "confirmed",
    event: mockEvents[1],
  },
  {
    id: "3",
    userId: "3",
    eventId: "5",
    bookingDate: "2023-11-20T09:15:00.000Z",
    status: "confirmed",
    event: mockEvents[4],
  },
]

// Mock data for categories
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Weddings",
    slug: "weddings",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: "2",
    name: "Concerts",
    slug: "concerts",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: "3",
    name: "Conferences",
    slug: "conferences",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: "4",
    name: "Seminars",
    slug: "seminars",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  },
  {
    id: "5",
    name: "Festivals",
    slug: "festivals",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  },
]

// Mock data for testimonials
const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Event Organizer",
    content:
      "EventHub has completely transformed how I manage events. The platform is intuitive, powerful, and has saved me countless hours of work. I can't imagine going back to my old methods!",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Corporate Event Manager",
    content:
      "We've used EventHub for our last five corporate conferences, and the results have been outstanding. The analytics and attendee management features are particularly impressive.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Wedding Planner",
    content:
      "As a wedding planner, attention to detail is everything. EventHub helps me stay organized and ensures nothing falls through the cracks. My clients love the professional experience!",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
]

// Mock stats data
const mockStats = {
  totalEvents: 1250,
  upcomingEvents: 450,
  totalAttendees: 75000,
  locations: 120,
  pastEvents: 800,
}

// Mock dashboard stats
const mockDashboardStats = {
  totalEvents: 1250,
  totalUsers: 5430,
  totalOrganizers: 320,
  totalAttendees: 5110,
}

// Mock organizer stats
const mockOrganizerStats = {
  totalEvents: 24,
  upcomingEvents: 8,
  totalAttendees: 3200,
  averageAttendees: 133,
}

// Mock attendee stats
const mockAttendeeStats = {
  upcomingEvents: 3,
  pastEvents: 12,
  totalBookings: 15,
}

// Auth API functions
export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, this would be a POST request to your API
  const user = mockUsers.find((user) => user.email === email)

  if (
    !user ||
    (email === "admin@events.com" && password !== "admin123") ||
    (email === "organizer@events.com" && password !== "org123") ||
    (email === "attendee@events.com" && password !== "user123")
  ) {
    throw new Error("Invalid credentials")
  }

  // Set a cookie to simulate session
  document.cookie = `session=${user.role}_${user.id}; path=/; max-age=86400`

  return user
}

export const logoutUser = async (): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Clear the session cookie
  document.cookie = "session=; path=/; max-age=0"
}

export const getCurrentUser = async (): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, this would be a GET request to your API
  const cookies = document.cookie.split(";")
  const sessionCookie = cookies.find((cookie) => cookie.trim().startsWith("session="))

  if (!sessionCookie) {
    return null
  }

  const sessionValue = sessionCookie.split("=")[1]

  if (sessionValue.includes("admin")) {
    return mockUsers.find((user) => user.role === "admin") || null
  } else if (sessionValue.includes("organizer")) {
    return mockUsers.find((user) => user.role === "organizer") || null
  } else if (sessionValue.includes("attendee")) {
    return mockUsers.find((user) => user.role === "attendee") || null
  }

  return null
}

// Events API functions
export const fetchEvents = async (page = 1, limit = 6): Promise<Event[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, this would be a fetch call to your API
  // with pagination parameters
  const start = (page - 1) * limit
  const end = start + limit
  return mockEvents.slice(start, end)
}

export const fetchEvent = async (id: string): Promise<Event> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const event = mockEvents.find((event) => event.id === id)
  if (!event) {
    throw new Error("Event not found")
  }

  return event
}

export const createEvent = async (eventData: Omit<Event, "id" | "attendees">): Promise<Event> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In a real app, this would be a POST request to your API
  const newEvent: Event = {
    ...eventData,
    id: Math.random().toString(36).substring(2, 9),
    attendees: 0,
  }

  // In a real app, this would add to a database
  mockEvents.push(newEvent)

  return newEvent
}

export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const eventIndex = mockEvents.findIndex((event) => event.id === id)
  if (eventIndex === -1) {
    throw new Error("Event not found")
  }

  // Update the event
  mockEvents[eventIndex] = {
    ...mockEvents[eventIndex],
    ...eventData,
  }

  return mockEvents[eventIndex]
}

export const deleteEvent = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const eventIndex = mockEvents.findIndex((event) => event.id === id)
  if (eventIndex === -1) {
    throw new Error("Event not found")
  }

  // Remove the event
  mockEvents.splice(eventIndex, 1)
}

export const duplicateEvent = async (id: string): Promise<Event> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const event = mockEvents.find((event) => event.id === id)
  if (!event) {
    throw new Error("Event not found")
  }

  // Create a duplicate with a new ID and slightly modified title
  const newEvent: Event = {
    ...event,
    id: Math.random().toString(36).substring(2, 9),
    title: `${event.title} (Copy)`,
    attendees: 0,
  }

  mockEvents.push(newEvent)

  return newEvent
}

// Categories API functions
export const fetchCategories = async (): Promise<Category[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return mockCategories
}

export const deleteCategory = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const categoryIndex = mockCategories.findIndex((category) => category.id === id)
  if (categoryIndex === -1) {
    throw new Error("Category not found")
  }

  // Remove the category
  mockCategories.splice(categoryIndex, 1)
}

// Bookings API functions
export const fetchAttendeeBookings = async (userId: string): Promise<Booking[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return mockBookings.filter((booking) => booking.userId === userId)
}

export const cancelBooking = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const bookingIndex = mockBookings.findIndex((booking) => booking.id === id)
  if (bookingIndex === -1) {
    throw new Error("Booking not found")
  }

  // Update the booking status
  mockBookings[bookingIndex].status = "cancelled"
}

// Organizer API functions
export const fetchOrganizerEvents = async (organizerId: string): Promise<Event[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return mockEvents.filter((event) => event.organizerId === organizerId)
}

// Stats API functions
export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  return mockTestimonials
}

export const fetchStats = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  return mockStats
}

export const fetchDashboardStats = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  return mockDashboardStats
}

export const fetchOrganizerStats = async (organizerId: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  return mockOrganizerStats
}

export const fetchAttendeeStats = async (attendeeId: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  return mockAttendeeStats
}

export const submitContactForm = async (formData: any): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In a real app, this would send the form data to your API
  console.log("Form submitted:", formData)
}
