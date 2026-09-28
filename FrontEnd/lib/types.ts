export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "organizer" | "attendee"
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  category: string
  price: number
  image: string
  organizer: string
  organizerId: string
  attendees: number
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
}

export interface Booking {
  id: string
  userId: string
  eventId: string
  bookingDate: string
  status: "confirmed" | "cancelled"
  event: Event
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar: string
}
