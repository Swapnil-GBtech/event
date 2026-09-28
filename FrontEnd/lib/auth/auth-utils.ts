import { cookies } from "next/headers"
import type { User } from "@/lib/types"

// This is a server-side function to get the session
export async function getServerSession() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return null
  }

  // In a real app, you would verify the session token with your backend
  // For this demo, we'll simulate a user based on the cookie value

  if (sessionCookie.value.includes("admin")) {
    return {
      user: {
        id: "1",
        name: "Admin User",
        email: "admin@events.com",
        role: "admin",
      } as User,
    }
  } else if (sessionCookie.value.includes("organizer")) {
    return {
      user: {
        id: "2",
        name: "Event Organizer",
        email: "organizer@events.com",
        role: "organizer",
      } as User,
    }
  } else if (sessionCookie.value.includes("attendee")) {
    return {
      user: {
        id: "3",
        name: "Event Attendee",
        email: "attendee@events.com",
        role: "attendee",
      } as User,
    }
  }

  return null
}
