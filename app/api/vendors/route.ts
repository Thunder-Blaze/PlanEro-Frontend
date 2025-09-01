import { NextRequest, NextResponse } from "next/server"
import { vendorApi, TokenManager, ApiError } from "@/lib/api"

// POST /vendors - Create vendor
export async function POST(request: NextRequest) {
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
    const { businessName, location, bio, websiteUrl, profilePictureUrl, phoneNumber, addressId, email } = body

    if (!businessName || !location || !email) {
      return NextResponse.json(
        { error: "Missing required fields: businessName, location, email" },
        { status: 400 }
      )
    }

    try {
      // Create vendor through external API
      const vendorData = {
        businessName,
        location,
        bio: bio || "",
        websiteUrl: websiteUrl ? [websiteUrl] : [],
        profilePictureUrl: profilePictureUrl || "",
        email,
        phoneNumber: phoneNumber || "",
        addressId: addressId || 0,
        approved: false,
        published: false,
      }
      
      const vendor = await vendorApi.createVendor(vendorData, token)

      return NextResponse.json(vendor, { status: 201 })
      
    } catch (apiError) {
      console.error("External API error:", apiError)
      if (apiError instanceof ApiError) {
        return NextResponse.json(
          { error: apiError.message },
          { status: apiError.status }
        )
      }
      
      return NextResponse.json(
        { error: "Failed to create vendor" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Error creating vendor:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// GET /vendors - Search vendors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pgNo = parseInt(searchParams.get('pgNo') || '1')
    const pgSize = parseInt(searchParams.get('pgSize') || '10')

    try {
      // Fetch from external API
      const allVendors = await vendorApi.getAllVendors()
      
      // Filter approved and published vendors
      const filteredVendors = allVendors.filter(vendor => vendor.approved && vendor.published)
      
      // Apply pagination
      const skip = (pgNo - 1) * pgSize
      const paginatedVendors = filteredVendors.slice(skip, skip + pgSize)
      
      return NextResponse.json({
        vendors: paginatedVendors,
        pagination: {
          page: pgNo,
          size: pgSize,
          total: filteredVendors.length,
          pages: Math.ceil(filteredVendors.length / pgSize)
        }
      })
      
    } catch (apiError) {
      console.error("External API error:", apiError)
      
      // Return empty result if API is down
      return NextResponse.json({
        vendors: [],
        pagination: {
          page: pgNo,
          size: pgSize,
          total: 0,
          pages: 0
        }
      })
    }

  } catch (error) {
    console.error("Error fetching vendors:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
