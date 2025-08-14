"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Building2, 
  Globe, 
  Camera, 
  Save, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"
import toast from "react-hot-toast"

const profileSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  bio: z.string().min(50, "Bio must be at least 50 characters").max(1000, "Bio must be less than 1000 characters"),
  websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  profilePictureUrl: z.string().optional(),
})

const accountSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
})

const settingsSchema = z.object({
  isPublished: z.boolean(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
})

type ProfileForm = z.infer<typeof profileSchema>
type AccountForm = z.infer<typeof accountSchema>
type SettingsForm = z.infer<typeof settingsSchema>

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

interface User {
  id: number
  fullName: string
  email: string
  role: string
}

export default function VendorProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  })

  const accountForm = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
  })

  const settingsForm = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
    }
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (session?.user && status === "authenticated") {
      fetchData()
    }
  }, [session, status, router])

  const fetchData = async () => {
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
        profileForm.reset({
          businessName: vendorData.businessName,
          location: vendorData.location,
          bio: vendorData.bio,
          websiteUrl: vendorData.websiteUrl || "",
          profilePictureUrl: vendorData.profilePictureUrl || "",
        })
        settingsForm.reset({
          isPublished: vendorData.isPublished,
          emailNotifications: true,
          smsNotifications: false,
        })
      }

      // Fetch user account info
      const userResponse = await fetch(`/api/users/profile`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
        accountForm.reset({
          fullName: userData.fullName,
          email: userData.email,
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  const onProfileSubmit = async (data: ProfileForm) => {
    try {
      setSaving(true)
      
      const response = await fetch(`/api/vendors/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success("Profile updated successfully!")
        fetchData() // Refresh data
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const onAccountSubmit = async (data: AccountForm) => {
    try {
      setSaving(true)
      
      const response = await fetch(`/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success("Account updated successfully!")
        fetchData() // Refresh data
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update account")
      }
    } catch (error) {
      console.error("Error updating account:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const onSettingsSubmit = async (data: SettingsForm) => {
    try {
      setSaving(true)
      
      const response = await fetch(`/api/vendors/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success("Settings updated successfully!")
        fetchData() // Refresh data
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update settings")
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const getStatusInfo = () => {
    if (!vendor) return { icon: AlertCircle, text: "No Profile", variant: "secondary" as const }
    
    if (!vendor.isApproved) {
      return { 
        icon: AlertCircle, 
        text: "Pending Approval", 
        variant: "secondary" as const,
        description: "Your profile is under review"
      }
    }
    if (!vendor.isPublished) {
      return { 
        icon: EyeOff, 
        text: "Not Published", 
        variant: "outline" as const,
        description: "Your profile is approved but not visible to the public"
      }
    }
    return { 
      icon: CheckCircle, 
      text: "Live", 
      variant: "default" as const,
      description: "Your profile is live and visible to customers"
    }
  }

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your vendor profile and account settings</p>
          </div>
          <Badge variant={statusInfo.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {statusInfo.text}
          </Badge>
        </div>

        {/* Status Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={vendor?.profilePictureUrl} />
                <AvatarFallback>
                  <Building2 className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{vendor?.businessName || "No Business Name"}</h3>
                <p className="text-muted-foreground">{vendor?.location}</p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusIcon className="h-4 w-4" />
                  <span className="text-sm">{statusInfo.description}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Business Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
                <CardDescription>
                  Update your business information that customers will see
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        {...profileForm.register("businessName")}
                        className={profileForm.formState.errors.businessName ? "border-red-500" : ""}
                      />
                      {profileForm.formState.errors.businessName && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.businessName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        {...profileForm.register("location")}
                        className={profileForm.formState.errors.location ? "border-red-500" : ""}
                      />
                      {profileForm.formState.errors.location && (
                        <p className="text-sm text-red-500">
                          {profileForm.formState.errors.location.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      {...profileForm.register("websiteUrl")}
                      className={profileForm.formState.errors.websiteUrl ? "border-red-500" : ""}
                    />
                    {profileForm.formState.errors.websiteUrl && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.websiteUrl.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profilePictureUrl">Profile Picture URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="profilePictureUrl"
                        placeholder="https://example.com/logo.jpg"
                        {...profileForm.register("profilePictureUrl")}
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Business Description *</Label>
                    <Textarea
                      id="bio"
                      placeholder="Describe your business and services..."
                      className="min-h-32"
                      {...profileForm.register("bio")}
                    />
                    {profileForm.formState.errors.bio && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.bio.message}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <Button type="submit" disabled={saving}>
                    {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your personal account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      {...accountForm.register("fullName")}
                      className={accountForm.formState.errors.fullName ? "border-red-500" : ""}
                    />
                    {accountForm.formState.errors.fullName && (
                      <p className="text-sm text-red-500">
                        {accountForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...accountForm.register("email")}
                      className={accountForm.formState.errors.email ? "border-red-500" : ""}
                    />
                    {accountForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {accountForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <Button type="submit" disabled={saving}>
                    {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Visibility & Notifications</CardTitle>
                <CardDescription>
                  Control how your profile appears and manage notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label>Profile Visibility</Label>
                        <p className="text-sm text-muted-foreground">
                          Make your profile visible to the public
                        </p>
                      </div>
                      <Switch
                        {...settingsForm.register("isPublished")}
                        disabled={!vendor?.isApproved}
                      />
                    </div>

                    {!vendor?.isApproved && (
                      <p className="text-sm text-muted-foreground">
                        Profile visibility will be available after admin approval
                      </p>
                    )}

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch {...settingsForm.register("emailNotifications")} />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via SMS
                        </p>
                      </div>
                      <Switch {...settingsForm.register("smsNotifications")} />
                    </div>
                  </div>

                  <Separator />

                  <Button type="submit" disabled={saving}>
                    {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
