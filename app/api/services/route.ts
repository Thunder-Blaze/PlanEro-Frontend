import { NextResponse } from "next/server"

// Mock services data
const services = [
  {
    id: "1",
    name: "Elite Wedding Photography",
    category: "photographers",
    location: "Los Angeles, CA",
    price: 2500,
    image: "/placeholder.svg?height=300&width=400",
    description: "Award-winning wedding photography with artistic flair",
    rating: 4.9,
    reviews: 156,
    portfolio: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  {
    id: "2",
    name: "Gourmet Catering Co.",
    category: "caterers",
    location: "San Francisco, CA",
    price: 85,
    priceUnit: "per person",
    image: "/placeholder.svg?height=300&width=400",
    description: "Farm-to-table catering with seasonal menus",
    rating: 4.8,
    reviews: 203,
    portfolio: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  {
    id: "3",
    name: "Harmony String Quartet",
    category: "musicians",
    location: "Chicago, IL",
    price: 1200,
    image: "/placeholder.svg?height=300&width=400",
    description: "Classical and contemporary music for ceremonies and receptions",
    rating: 4.7,
    reviews: 89,
    portfolio: [
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

  let filteredServices = [...services]

  // Filter by category
  if (category && category !== "all") {
    filteredServices = filteredServices.filter((service) => service.category === category)
  }

  // Filter by search query
  if (search) {
    filteredServices = filteredServices.filter(
      (service) =>
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.location.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()),
    )
  }

  // Sort services
  if (sortBy) {
    switch (sortBy) {
      case "price-low":
        filteredServices.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredServices.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filteredServices.sort((a, b) => b.rating - a.rating)
        break
      default:
        filteredServices.sort((a, b) => a.name.localeCompare(b.name))
    }
  }

  return NextResponse.json(filteredServices)
}
