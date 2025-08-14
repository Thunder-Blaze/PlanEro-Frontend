import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, role, name, image } = await request.json()

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ["HOST", "VENDOR", "ADMIN"]
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      )
    }

    // Check if user exists
    let user = await prisma.user.findUnique({ 
      where: { email }
    })
    
    if (!user) {
      // Create new user for OAuth sign-in
      user = await prisma.user.create({
        data: {
          name: name || email.split("@")[0],
          email,
          role,
          image: image || "",
        }
      })
    } else {
      // Update existing user's role
      user = await prisma.user.update({
        where: { email },
        data: {
          role,
          ...(name && !user.name && { name }),
          ...(image && !user.image && { image }),
        }
      })
    }

    return NextResponse.json({
      message: "Role updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })

  } catch (error) {
    console.error("Error updating role:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
