import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"

// PUT /vendor - Update vendor
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: "Vendor ID is required" },
        { status: 400 }
      )
    }

    // Check if user owns this vendor
    const existingVendor = await prisma.vendor.findUnique({
      where: { id }
    })

    if (!existingVendor || existingVendor.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Vendor not found or unauthorized" },
        { status: 404 }
      )
    }

    const vendor = await prisma.vendor.update({
      where: { id },
      data: updateData,
      include: {
        services: true,
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(vendor)

  } catch (error) {
    console.error("Error updating vendor:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
