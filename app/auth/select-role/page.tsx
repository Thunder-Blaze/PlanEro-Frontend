"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Building2, Crown, ArrowRight } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import toast from "react-hot-toast"

const accountTypes = [
  {
    value: "HOST",
    title: "Event Host",
    description: "I'm planning an event and looking for vendors",
    icon: User,
    features: ["Browse vendors", "Send inquiries", "Manage bookings", "Save favorites"],
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    value: "VENDOR", 
    title: "Vendor",
    description: "I offer event services and want to showcase my business",
    icon: Building2,
    features: ["Create business profile", "Manage services", "Upload portfolio", "Track analytics"],
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    iconColor: "text-green-600"
  },
  {
    value: "ADMIN",
    title: "Administrator", 
    description: "I manage the platform (admin access required)",
    icon: Crown,
    features: ["Approve vendors", "Manage users", "Platform analytics", "Content moderation"],
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    iconColor: "text-purple-600"
  }
]

export default function SelectAccountType() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (session?.user) {
      // Check if user already has a role assigned
      if (session.user.role && session.user.role !== "undefined") {
        // User already has a role, redirect appropriately
        redirectBasedOnRole(session.user.role)
        return
      }

      // Get user info from URL params (passed from OAuth callback)
      const email = searchParams.get("email")
      const name = searchParams.get("name")
      const image = searchParams.get("image")
      const provider = searchParams.get("provider")

      if (email) {
        setUserInfo({ email, name, image, provider })
      } else if (session.user.email) {
        setUserInfo({
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          provider: "oauth"
        })
      }
    }
  }, [session, status, router, searchParams])

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case "VENDOR":
        router.push("/vendor/dashboard")
        break
      case "ADMIN":
        router.push("/admin/dashboard")
        break
      default:
        router.push("/")
    }
  }

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      toast.error("Please select an account type")
      return
    }

    setLoading(true)

    try {
      // Update user role in database
      const response = await fetch("/api/auth/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userInfo?.email || session?.user?.email,
          role: selectedRole,
          name: userInfo?.name || session?.user?.name,
          image: userInfo?.image || session?.user?.image,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message || "Failed to update account type")
        return
      }

      toast.success("Account type updated successfully!")

      // Force session refresh by signing out and back in
      await signOut({ redirect: false })
      
      // Small delay to ensure signout completes
      setTimeout(() => {
        // Redirect based on selected role
        redirectBasedOnRole(selectedRole)
      }, 1000)

    } catch (error) {
      console.error("Error updating role:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to PlanEro!</h1>
          <p className="text-lg text-gray-600">
            Please select your account type to get started
          </p>
          {userInfo && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="text-sm text-gray-500">
                Signed in as <span className="font-medium">{userInfo.email}</span>
              </div>
              {userInfo.provider && (
                <Badge variant="outline" className="text-xs">
                  via {userInfo.provider}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Account Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {accountTypes.map((type) => {
            const IconComponent = type.icon
            const isSelected = selectedRole === type.value
            
            return (
              <Card
                key={type.value}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? `ring-2 ring-primary ${type.color}` 
                    : `${type.color} hover:shadow-md`
                }`}
                onClick={() => setSelectedRole(type.value)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}>
                    <IconComponent className={`h-6 w-6 ${type.iconColor}`} />
                  </div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {isSelected && (
                    <div className="mt-4 flex items-center justify-center">
                      <Badge variant="default" className="bg-primary">
                        Selected
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button 
            onClick={handleRoleSelection}
            disabled={!selectedRole || loading}
            size="lg"
            className="min-w-48"
          >
            {loading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <ArrowRight className="h-4 w-4 mr-2" />
            )}
            Continue
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            You can change your account type later in your profile settings
          </p>
        </div>
      </div>
    </div>
  )
}
