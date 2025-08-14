import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /vendors/{id}
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: params.id },
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

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(vendor)

  } catch (error) {
    console.error("Error fetching vendor:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
