import { NextResponse } from "next/server"

// Mock data - replace with actual database queries
const venues = [
  {
    id: "1",
    name: "Elegant Garden Venue",
    location: "Beverly Hills, CA",
    price: 5000,
    image: "/placeholder.svg?height=300&width=400",
    category: "Wedding Venues",
    capacity: 150,
    description: "Beautiful outdoor garden venue perfect for intimate weddings",
    rating: 4.8,
    reviews: 124,
    amenities: ["Outdoor ceremony space", "Bridal suite", "Catering kitchen", "Parking"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  {
    id: "2",
    name: "Modern Rooftop Space",
    location: "Manhattan, NY",
    price: 8000,
    image: "/placeholder.svg?height=300&width=400",
    category: "Corporate Events",
    capacity: 200,
    description: "Stunning rooftop venue with panoramic city views",
    rating: 4.9,
    reviews: 89,
    amenities: ["City skyline views", "Climate controlled", "AV equipment", "Bar service"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const sortBy = searchParams.get("sortBy")

  let filteredVenues = [...venues]

  // Filter by category
  if (category && category !== "all") {
    filteredVenues = filteredVenues.filter((venue) => venue.category.toLowerCase().includes(category.toLowerCase()))
  }

  // Filter by search query
  if (search) {
    filteredVenues = filteredVenues.filter(
      (venue) =>
        venue.name.toLowerCase().includes(search.toLowerCase()) ||
        venue.location.toLowerCase().includes(search.toLowerCase()) ||
        venue.description.toLowerCase().includes(search.toLowerCase()),
    )
  }

  // Sort venues
  if (sortBy) {
    switch (sortBy) {
      case "price-low":
        filteredVenues.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredVenues.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filteredVenues.sort((a, b) => b.rating - a.rating)
        break
      default:
        filteredVenues.sort((a, b) => a.name.localeCompare(b.name))
    }
  }

  return NextResponse.json(filteredVenues)
}

export async function POST(request: Request) {
  // TODO: Implement venue creation
  const body = await request.json()

  // Mock response
  const newVenue = {
    id: Date.now().toString(),
    ...body,
    rating: 0,
    reviews: 0,
    images: [],
  }

  return NextResponse.json(newVenue, { status: 201 })
}
