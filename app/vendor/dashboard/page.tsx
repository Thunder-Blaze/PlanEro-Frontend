"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  Users, 
  Eye, 
  Settings, 
  Plus, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/loading-spinner"

interface VendorStats {
  totalViews: number
  totalInquiries: number
  servicesCount: number
  profileCompleteness: number
  isApproved: boolean
  isPublished: boolean
}

interface Vendor {
  id: number
  businessName: string
  location: string
  bio: string
  websiteUrl: string[]
  profilePictureUrl: string
  email: string
  phoneNumber: string
  addressId: number
  approved: boolean
  published: boolean
}

export default function VendorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [stats, setStats] = useState<VendorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push("/auth/signin?callbackUrl=/vendor/dashboard")
      return
    }
    
    fetchVendorData()
  }, [session, status, router])

  const fetchVendorData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch vendor profile from API
      const response = await fetch('/api/vendors/profile')
      
      if (response.status === 404) {
        // Vendor profile not found, redirect to onboarding
        router.push("/vendor/onboarding")
        return
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch vendor data: ${response.statusText}`)
      }
      
      const vendorData = await response.json()
      setVendor(vendorData)
      
      // Generate stats
      setStats({
        totalViews: Math.floor(Math.random() * 1000) + 100,
        totalInquiries: Math.floor(Math.random() * 50) + 10,
        servicesCount: 0,
        profileCompleteness: calculateProfileCompleteness(vendorData),
        isApproved: vendorData.approved,
        isPublished: vendorData.published
      })
      
    } catch (err) {
      console.error("Error fetching vendor data:", err)
      setError(err instanceof Error ? err.message : "Failed to load vendor data")
    } finally {
      setLoading(false)
    }
  }

  const calculateProfileCompleteness = (vendor: Vendor): number => {
    let completeness = 0
    const fields = [
      vendor.businessName,
      vendor.location,
      vendor.bio,
      vendor.email,
      vendor.phoneNumber,
      vendor.profilePictureUrl
    ]
    
    fields.forEach(field => {
      if (field && field.trim() !== '') {
        completeness += 16.67 // 100/6 fields
      }
    })
    
    return Math.round(completeness)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button 
              onClick={fetchVendorData} 
              variant="outline" 
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!vendor || !stats) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Complete Your Vendor Profile</h3>
              <p className="text-muted-foreground mb-4">
                Start by setting up your vendor profile to showcase your services.
              </p>
              <Button asChild>
                <Link href="/vendor/onboarding">
                  <Plus className="h-4 w-4 mr-2" />
                  Setup Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {vendor.businessName}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={stats.isApproved ? "default" : "secondary"}>
            {stats.isApproved ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Approved
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Pending Approval
              </>
            )}
          </Badge>
          <Badge variant={stats.isPublished ? "default" : "outline"}>
            {stats.isPublished ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Profile page views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInquiries}</div>
            <p className="text-xs text-muted-foreground">
              Customer inquiries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.servicesCount}</div>
            <p className="text-xs text-muted-foreground">
              Active services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profileCompleteness}%</div>
            <p className="text-xs text-muted-foreground">
              Completeness
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion */}
      {stats.profileCompleteness < 100 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Complete Your Profile
            </CardTitle>
            <CardDescription>
              A complete profile helps customers find and trust your services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Profile Completion</span>
                  <span>{stats.profileCompleteness}%</span>
                </div>
                <Progress value={stats.profileCompleteness} className="h-2" />
              </div>
              <Button asChild>
                <Link href="/vendor/profile">
                  Complete Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Manage Profile
            </CardTitle>
            <CardDescription>
              Update your business information and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/vendor/profile">
                Edit Profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add Services
            </CardTitle>
            <CardDescription>
              Create and manage your service offerings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/vendor/services">
                Manage Services
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              View Analytics
            </CardTitle>
            <CardDescription>
              Track your performance and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/vendor/analytics">
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status Messages */}
      {!stats.isApproved && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  Profile Under Review
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Your vendor profile is being reviewed by our team. You'll be notified once it's approved.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!stats.isPublished && stats.isApproved && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    Ready to Publish
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your profile is approved! Publish it to start receiving customer inquiries.
                  </p>
                </div>
              </div>
              <Button size="sm">
                Publish Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
