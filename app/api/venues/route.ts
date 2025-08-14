import { NextResponse } from "next/server"

// Mock data - replace with actual database queries
const venues = [
  {
    id: "1",
    name: "Elegant Garden Venue",
    location: "Beverly Hills, CA",
    price: 5000,
    image: "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    category: "Wedding Venues",
    capacity: 150,
    description: "Beautiful outdoor garden venue perfect for intimate weddings",
    rating: 4.8,
    reviews: 124,
    amenities: ["Outdoor ceremony space", "Bridal suite", "Catering kitchen", "Parking"],
    images: [
      "https://media.istockphoto.com/id/908077986/photo/wedding-ceremony.jpg?s=612x612&w=0&k=20&c=dkRXHQpOr4lkyHtE3RV4qpgp3QloHtkfYtQ6qzFN4xw=",
      "https://media.istockphoto.com/id/908077986/photo/wedding-ceremony.jpg?s=612x612&w=0&k=20&c=dkRXHQpOr4lkyHtE3RV4qpgp3QloHtkfYtQ6qzFN4xw=",
      "https://media.istockphoto.com/id/908077986/photo/wedding-ceremony.jpg?s=612x612&w=0&k=20&c=dkRXHQpOr4lkyHtE3RV4qpgp3QloHtkfYtQ6qzFN4xw=",
    ],
  },
  {
    id: "2",
    name: "Modern Rooftop Space",
    location: "Manhattan, NY",
    price: 8000,
    image: "https://media.istockphoto.com/id/175559502/photo/classy-wedding-setting.jpg?s=612x612&w=0&k=20&c=8CluymAckSE1Qxluoy0f0pHR-2yKq7X-Qj5yTsbzMrs=",
    category: "Corporate Events",
    capacity: 200,
    description: "Stunning rooftop venue with panoramic city views",
    rating: 4.9,
    reviews: 89,
    amenities: ["City skyline views", "Climate controlled", "AV equipment", "Bar service"],
    images: [
      "https://media.istockphoto.com/id/908077986/photo/wedding-ceremony.jpg?s=612x612&w=0&k=20&c=dkRXHQpOr4lkyHtE3RV4qpgp3QloHtkfYtQ6qzFN4xw=",
      "https://media.istockphoto.com/id/908077986/photo/wedding-ceremony.jpg?s=612x612&w=0&k=20&c=dkRXHQpOr4lkyHtE3RV4qpgp3QloHtkfYtQ6qzFN4xw=",
      "https://media.istockphoto.com/id/908077986/photo/wedding-ceremony.jpg?s=612x612&w=0&k=20&c=dkRXHQpOr4lkyHtE3RV4qpgp3QloHtkfYtQ6qzFN4xw=",
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
