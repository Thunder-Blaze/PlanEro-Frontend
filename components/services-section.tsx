"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, ChefHat, Music, Flower, Car, Cake } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const services = [
  {
    id: "photographers",
    name: "Photographers",
    icon: Camera,
    description: "Capture every precious moment",
    count: "500+ professionals",
    href: "/services/photographers",
  },
  {
    id: "caterers",
    name: "Caterers",
    icon: ChefHat,
    description: "Delicious cuisine for any event",
    count: "300+ caterers",
    href: "/services/caterers",
  },
  {
    id: "musicians",
    name: "Musicians & DJs",
    icon: Music,
    description: "Perfect soundtrack for your event",
    count: "200+ artists",
    href: "/services/musicians",
  },
  {
    id: "florists",
    name: "Florists",
    icon: Flower,
    description: "Beautiful floral arrangements",
    count: "150+ florists",
    href: "/services/florists",
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: Car,
    description: "Luxury transportation services",
    count: "100+ providers",
    href: "/services/transportation",
  },
  {
    id: "bakers",
    name: "Bakers",
    icon: Cake,
    description: "Custom cakes and desserts",
    count: "80+ bakers",
    href: "/services/bakers",
  },
]

export function ServicesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">PROFESSIONAL SERVICES</h2>
          <p className="text-lg text-muted-foreground">
            Connect with top-rated professionals to make your event perfect
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-muted-foreground mb-3">{service.description}</p>
                    <p className="text-sm text-primary font-medium mb-4">{service.count}</p>
                    <Button variant="outline" asChild className="w-full bg-transparent">
                      <Link href={service.href}>Browse {service.name}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
