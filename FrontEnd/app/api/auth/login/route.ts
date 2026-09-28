import { NextResponse } from "next/server"
import { z } from "zod"

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const { email, password } = result.data

    // In a real app, you would:
    // 1. Check if user exists
    // 2. Verify password
    // 3. Generate JWT token

    // For demo purposes, we'll just return success with mock data
    // In a real app, you'd check against your database
    if (email === "admin@example.com" && password === "password") {
      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: "user_1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
        token: "mock_jwt_token",
      })
    } else if (email === "organizer@example.com" && password === "password") {
      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: "user_2",
          name: "Event Organizer",
          email: "organizer@example.com",
          role: "organizer",
        },
        token: "mock_jwt_token",
      })
    } else if (email === "attendee@example.com" && password === "password") {
      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: "user_3",
          name: "Event Attendee",
          email: "attendee@example.com",
          role: "attendee",
        },
        token: "mock_jwt_token",
      })
    } else {
      // For any other credentials, return error
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed", message: "An unexpected error occurred" }, { status: 500 })
  }
}
