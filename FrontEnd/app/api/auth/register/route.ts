import { NextResponse } from "next/server"
import { z } from "zod"

// Validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["attendee", "organizer"]).default("attendee"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const { name, email, password, role } = result.data

    // In a real app, you would:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Store in database
    // 4. Generate JWT token

    // For demo purposes, we'll just return success
    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        user: { id: "user_" + Date.now(), name, email, role },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed", message: "An unexpected error occurred" }, { status: 500 })
  }
}
