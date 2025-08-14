import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"

// POST /service - Create service
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
    const { name, vendorId, eventType, available, metadata, cost, images } = body

    if (!name || !vendorId || !eventType || cost === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user owns this vendor
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId }
    })

    if (!vendor || vendor.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Vendor not found or unauthorized" },
        { status: 404 }
      )
    }

    const service = await prisma.service.create({
      data: {
        name,
        vendorId,
        eventType,
        available: available ?? true,
        metadata,
        cost,
        images,
      },
      include: {
        vendor: true
      }
    })

    return NextResponse.json(service, { status: 201 })

  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// GET /service - Search services or get services by vendor
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')
    const pgNo = parseInt(searchParams.get('pgNo') || '1')
    const pgSize = parseInt(searchParams.get('pgSize') || '10')
    const priceEnum = searchParams.get('priceEnum')
    const location = searchParams.get('location')
    const eventType = searchParams.get('eventType')

    const skip = (pgNo - 1) * pgSize

    if (vendorId) {
      // Get services by vendor ID
      const services = await prisma.service.findMany({
        where: { vendorId },
        include: {
          vendor: true
        }
      })
      return NextResponse.json(services)
    }

    // Search services
    const where: any = {
      available: true,
      vendor: {
        isApproved: true,
        isPublished: true,
      }
    }

    if (eventType) {
      where.eventType = eventType
    }

    if (location) {
      where.vendor.location = {
        contains: location
      }
    }

    if (priceEnum) {
      where.vendor.expenseLevel = priceEnum
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: pgSize,
        include: {
          vendor: true
        }
      }),
      prisma.service.count({ where })
    ])

    return NextResponse.json({
      services,
      pagination: {
        page: pgNo,
        size: pgSize,
        total,
        pages: Math.ceil(total / pgSize)
      }
    })

  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
