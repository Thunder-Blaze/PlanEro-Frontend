import { NextRequest, NextResponse } from "next/server"
import { authApi, TokenManager, ApiError } from "@/lib/api"

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || TokenManager.getToken()
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      )
    }

    try {
      // Fetch profile from external API
      const profile = await authApi.getProfile(token)
      
      return NextResponse.json({
        name: profile.username,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        vendor: profile.vendor,
      })
    } catch (apiError) {
      console.error("External API error:", apiError)
      if (apiError instanceof ApiError) {
        return NextResponse.json(
          { error: apiError.message },
          { status: apiError.status }
        )
      }
      
      return NextResponse.json(
        { error: "Failed to fetch profile from external API" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || TokenManager.getToken()
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // For now, we'll just return the updated data
    // In a full implementation, you might want to update the profile via the external API
    return NextResponse.json({
      message: "Profile updated successfully",
      user: body
    })

  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    )
  }
}
