import { NextRequest, NextResponse } from "next/server"
import { authApi, ApiError } from "@/lib/api"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate role and map to external API format
    const validRoles = ["HOST", "VENDOR", "ADMIN"]
    const userRole = role && validRoles.includes(role) ? role : "HOST"
    
    // Map internal roles to external API roles
    const externalRole = userRole === "HOST" ? "USER" : (userRole as "USER" | "VENDOR")

    try {
      // Register user with external API
      const authResponse = await authApi.signup({
        username: email, // Using email as username
        password,
        role: externalRole,
      })

      // Return success response with token
      return NextResponse.json({
        message: "User registered successfully",
        user: {
          email,
          name,
          role: userRole,
        },
        token: authResponse.token,
        username: authResponse.username,
      }, { status: 201 })

    } catch (apiError: unknown) {
      // Handle API errors (user already exists, etc.)
      if (apiError instanceof ApiError) {
        return NextResponse.json(
          { error: apiError.message },
          { status: apiError.status }
        )
      }
      
      return NextResponse.json(
        { error: "Registration failed" },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
