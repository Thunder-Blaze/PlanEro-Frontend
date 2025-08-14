"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, MapPin, Users } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import Link from "next/link"

// Mock data - replace with actual API calls
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
  },
  // Add more venues...
]

export default function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterCategory, setFilterCategory] = useState("all")

  const { addItem } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { user } = useAuth()

  const handleAddToCart = (venue: (typeof venues)[0]) => {
    addItem({
      id: venue.id,
      name: venue.name,
      price: venue.price,
      image: venue.image,
      type: "venue",
      quantity: 1,
    })
    toast.success("Added to cart!")
  }

  const handleToggleFavorite = (venue: (typeof venues)[0]) => {
    if (!user) {
      toast.error("Please log in to add favorites")
      return
    }

    if (isFavorite(venue.id)) {
      removeFromFavorites(venue.id)
      toast.success("Removed from favorites")
    } else {
      addToFavorites({
        id: venue.id,
        name: venue.name,
        price: venue.price,
        image: venue.image,
        type: "venue",
      })
      toast.success("Added to favorites!")
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Venue</h1>
          <p className="text-lg text-muted-foreground">Discover unique venues for your special event</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Input placeholder="Search venues..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="wedding">Wedding Venues</SelectItem>
              <SelectItem value="corporate">Corporate Events</SelectItem>
              <SelectItem value="birthday">Birthday Parties</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Clear Filters</Button>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue, index) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={venue.image || "/placeholder.svg"}
                    alt={venue.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-2 right-2 bg-white/80 hover:bg-white ${
                      isFavorite(venue.id) ? "text-red-500" : "text-gray-600"
                    }`}
                    onClick={() => handleToggleFavorite(venue)}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite(venue.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">{venue.category}</span>
                  </div>
                  <Link href={`/venues/${venue.id}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">{venue.name}</h3>
                  </Link>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {venue.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Users className="h-4 w-4 mr-1" />
                    Up to {venue.capacity} guests
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{venue.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold">${venue.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground ml-1">/ event</span>
                    </div>
                    <Button size="sm" onClick={() => handleAddToCart(venue)} className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
