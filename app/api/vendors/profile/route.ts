import { NextRequest, NextResponse } from "next/server"
import { auth } from "../../auth/[...nextauth]/route"
import { vendorApi, TokenManager, ApiError } from "@/lib/api"

// GET /api/vendors/profile - Get current vendor profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get token from session or Authorization header
    const authHeader = request.headers.get('authorization')
    const token = (session as any)?.apiToken || authHeader?.replace('Bearer ', '') || TokenManager.getToken()
    
    if (!token) {
      return NextResponse.json(
        { error: "No authentication token found" },
        { status: 401 }
      )
    }

    try {
      // Get vendor profile from external API
      const vendors = await vendorApi.getAllVendors()
      
      // Find vendor by user email (assuming email is unique)
      const vendor = vendors.find(v => v.email === session.user?.email)
      
      if (!vendor) {
        return NextResponse.json(
          { error: "Vendor profile not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(vendor)
      
    } catch (apiError) {
      console.error("External API error:", apiError)
      if (apiError instanceof ApiError) {
        return NextResponse.json(
          { error: apiError.message },
          { status: apiError.status }
        )
      }
      
      return NextResponse.json(
        { error: "Failed to fetch vendor profile" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Error fetching vendor profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/vendors/profile - Update vendor profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get token from session or Authorization header
    const authHeader = request.headers.get('authorization')
    const token = (session as any)?.apiToken || authHeader?.replace('Bearer ', '') || TokenManager.getToken()
    
    if (!token) {
      return NextResponse.json(
        { error: "No authentication token found" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { businessName, location, bio, websiteUrl, profilePictureUrl, phoneNumber } = body

    try {
      // First, get the current vendor profile to get the vendor ID
      const vendors = await vendorApi.getAllVendors()
      const existingVendor = vendors.find(v => v.email === session.user?.email)
      
      if (!existingVendor) {
        return NextResponse.json(
          { error: "Vendor profile not found" },
          { status: 404 }
        )
      }

      // Update vendor profile through external API
      const updatedVendorData = {
        id: existingVendor.id,
        businessName: businessName || existingVendor.businessName,
        location: location || existingVendor.location,
        bio: bio || existingVendor.bio,
        websiteUrl: websiteUrl ? [websiteUrl] : existingVendor.websiteUrl,
        profilePictureUrl: profilePictureUrl || existingVendor.profilePictureUrl,
        email: existingVendor.email,
        phoneNumber: phoneNumber || existingVendor.phoneNumber,
        addressId: existingVendor.addressId,
        approved: existingVendor.approved,
        published: existingVendor.published,
      }
      
      const updatedVendor = await vendorApi.updateVendor(existingVendor.id, updatedVendorData, token)

      return NextResponse.json(updatedVendor)
      
    } catch (apiError) {
      console.error("External API error:", apiError)
      if (apiError instanceof ApiError) {
        return NextResponse.json(
          { error: apiError.message },
          { status: apiError.status }
        )
      }
      
      return NextResponse.json(
        { error: "Failed to update vendor profile" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Error updating vendor profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
