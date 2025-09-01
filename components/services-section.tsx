"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, ChefHat, Music, Flower, Car, Cake, ArrowRight } from "lucide-react"
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
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <span className="text-primary font-medium text-sm">PROFESSIONAL SERVICES</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Expert Event Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Connect with top-rated professionals to make your event perfect. From photographers to caterers, 
            we have verified experts for every aspect of your celebration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 h-full shadow-lg bg-card hover:bg-accent/5 overflow-hidden">
                  <CardContent className="p-8 text-center relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70"></div>
                    </div>
                    
                    {/* Icon Container */}
                    <div className="mb-6 relative">
                      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg relative">
                        <IconComponent className="h-10 w-10 text-primary" />
                        
                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-2xl bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                      {service.description}
                    </p>
                    <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-3 py-1 mb-6">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <p className="text-sm text-primary font-semibold">{service.count}</p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      asChild 
                      className="w-full bg-transparent border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 py-3 font-semibold"
                    >
                      <Link href={service.href}>
                        Browse {service.name}
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Button 
            size="lg" 
            asChild
            className="px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Link href="/services">
              View All Services
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
