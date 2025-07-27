"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import toast from "react-hot-toast"
import Link from "next/link"

// Mock data - replace with actual API calls
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
  },
  {
    id: "3",
    name: "Historic Ballroom",
    location: "Chicago, IL",
    price: 6500,
    image: "/placeholder.svg?height=300&width=400",
    category: "Wedding Venues",
    capacity: 300,
    description: "Grand historic ballroom with vintage charm",
  },
  {
    id: "4",
    name: "Beachfront Resort",
    location: "Malibu, CA",
    price: 12000,
    image: "/placeholder.svg?height=300&width=400",
    category: "Destination Weddings",
    capacity: 100,
    description: "Exclusive beachfront venue with ocean views",
  },
]

export function VenuesSection() {
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
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">VENUES WORTH BOOKING</h2>
          <p className="text-lg text-muted-foreground">Venues book up fast — find yours faster.</p>
        </motion.div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" className="rounded-full bg-transparent">
              Wedding Venues
            </Button>
            <Button variant="outline" className="rounded-full bg-transparent">
              Corporate Events
            </Button>
            <Button variant="outline" className="rounded-full bg-transparent">
              Birthday Parties
            </Button>
            <Button variant="outline" className="rounded-full bg-transparent">
              Baby Showers
            </Button>
            <Button variant="outline" className="rounded-full bg-transparent">
              Fundraisers
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {venues.map((venue, index) => (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
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
                  <p className="text-sm text-muted-foreground mb-2">{venue.location}</p>
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

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/venues">View All Venues</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
