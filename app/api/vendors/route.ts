import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"

// POST /vendors - Create vendor
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { businessName, location, pincode, bio, websiteUrl, profilePictureUrl, expenseLevel } = body

    if (!businessName || !location || !pincode || !expenseLevel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const vendor = await prisma.vendor.create({
      data: {
        businessName,
        location,
        pincode,
        bio,
        websiteUrl,
        profilePictureUrl,
        expenseLevel,
        userId: session.user.id,
      }
    })

    return NextResponse.json(vendor, { status: 201 })

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
    const pincode = searchParams.get('pincode')
    const eventType = searchParams.get('eventType')

    const skip = (pgNo - 1) * pgSize

    const where: any = {
      isApproved: true,
      isPublished: true,
    }

    if (pincode) {
      where.pincode = pincode
    }

    if (eventType) {
      where.services = {
        some: {
          eventType: eventType
        }
      }
    }

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        skip,
        take: pgSize,
        include: {
          services: true,
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        }
      }),
      prisma.vendor.count({ where })
    ])

    return NextResponse.json({
      vendors,
      pagination: {
        page: pgNo,
        size: pgSize,
        total,
        pages: Math.ceil(total / pgSize)
      }
    })

  } catch (error) {
    console.error("Error fetching vendors:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
