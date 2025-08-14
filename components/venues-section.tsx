"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Users, Sparkles, Building2, Heart, Cake } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

// Venue categories with their details
const venueCategories = [
  {
    id: "wedding-venues",
    name: "Wedding Venues",
    description: "Romantic venues perfect for your special day",
    icon: Heart,
    image: "/placeholder.svg?height=300&width=400",
    venueCount: 45,
    priceRange: "$3,000 - $15,000",
    color: "from-pink-500/20 to-rose-500/20"
  },
  {
    id: "corporate-events",
    name: "Corporate Events",
    description: "Professional spaces for meetings and conferences",
    icon: Building2,
    image: "/placeholder.svg?height=300&width=400",
    venueCount: 32,
    priceRange: "$2,000 - $12,000",
    color: "from-blue-500/20 to-indigo-500/20"
  },
  {
    id: "birthday-parties",
    name: "Birthday Parties",
    description: "Fun venues to celebrate another year of life",
    icon: Cake,
    image: "/placeholder.svg?height=300&width=400",
    venueCount: 28,
    priceRange: "$500 - $5,000",
    color: "from-yellow-500/20 to-orange-500/20"
  },
  {
    id: "special-occasions",
    name: "Special Occasions",
    description: "Unique venues for all your celebrations",
    icon: Sparkles,
    image: "/placeholder.svg?height=300&width=400",
    venueCount: 38,
    priceRange: "$1,000 - $8,000",
    color: "from-purple-500/20 to-violet-500/20"
  },
  {
    id: "social-gatherings",
    name: "Social Gatherings",
    description: "Casual spaces for family and friends",
    icon: Users,
    image: "/placeholder.svg?height=300&width=400",
    venueCount: 25,
    priceRange: "$800 - $6,000",
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    id: "formal-events",
    name: "Formal Events",
    description: "Elegant venues for sophisticated occasions",
    icon: Calendar,
    image: "/placeholder.svg?height=300&width=400",
    venueCount: 22,
    priceRange: "$4,000 - $20,000",
    color: "from-slate-500/20 to-gray-500/20"
  }
]

export function VenuesSection() {
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
          <p className="text-lg text-muted-foreground">Browse by category to find your perfect venue.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venueCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/venues/category/${category.id}`}>
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                        <category.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      {category.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Available venues:</span>
                        <span className="font-semibold">{category.venueCount}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Price range:</span>
                        <span className="font-semibold">{category.priceRange}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <Button className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                        Browse {category.name}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/venues">View All Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
