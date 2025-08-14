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
  websiteUrl?: string
  profilePictureUrl?: string
  userId: number
  isApproved: boolean
  isPublished: boolean
}

export default function VendorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [stats, setStats] = useState<VendorStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (session?.user && status === "authenticated") {
      fetchVendorData()
    }
  }, [session, status, router])

  const fetchVendorData = async () => {
    try {
      setLoading(true)
      // Fetch vendor profile
      const vendorResponse = await fetch(`/api/vendors/profile`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (vendorResponse.ok) {
        const vendorData = await vendorResponse.json()
        setVendor(vendorData)
      }

      // Fetch vendor stats
      const statsResponse = await fetch(`/api/vendors/stats`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Vendor Profile</CardTitle>
            <CardDescription>
              You need to set up your vendor profile to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/vendor/onboarding">
              <Button>Get Started</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusBadge = () => {
    if (!vendor.isApproved) {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Pending Approval
      </Badge>
    }
    if (!vendor.isPublished) {
      return <Badge variant="outline" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Not Published
      </Badge>
    }
    return <Badge variant="default" className="flex items-center gap-1">
      <CheckCircle className="h-3 w-3" />
      Live
    </Badge>
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {vendor.businessName}</p>
        </div>
        <div className="flex items-center gap-4">
          {getStatusBadge()}
          <Link href="/vendor/profile">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Alert */}
      {!vendor.isApproved && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Profile Under Review</p>
                <p className="text-sm text-yellow-700">
                  Your vendor profile is currently being reviewed by our team. This typically takes 24-48 hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{stats?.totalViews || 0}</p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inquiries</p>
                <p className="text-2xl font-bold">{stats?.totalInquiries || 0}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Services</p>
                <p className="text-2xl font-bold">{stats?.servicesCount || 0}</p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile Complete</p>
                <p className="text-2xl font-bold">{stats?.profileCompleteness || 0}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completeness */}
      {stats && stats.profileCompleteness < 100 && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              A complete profile helps customers find and trust your services.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Profile Completeness</span>
                <span>{stats.profileCompleteness}%</span>
              </div>
              <Progress value={stats.profileCompleteness} className="h-2" />
            </div>
            <div className="flex gap-2">
              <Link href="/vendor/profile">
                <Button size="sm">Update Profile</Button>
              </Link>
              <Link href="/vendor/services">
                <Button variant="outline" size="sm">Add Services</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/vendor/services">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Services</h3>
                  <p className="text-sm text-muted-foreground">Add or edit your services</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/vendor/gallery">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Photo Gallery</h3>
                  <p className="text-sm text-muted-foreground">Showcase your work</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/vendor/analytics">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Analytics</h3>
                  <p className="text-sm text-muted-foreground">View detailed insights</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
