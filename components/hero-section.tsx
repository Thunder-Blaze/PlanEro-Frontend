"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/placeholder.svg?height=800&width=1200')`,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-lg mb-4 font-light">find</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
            ONE-OF-A-KIND <span className="block">VENUES</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-sm text-gray-900 rounded-lg p-8 max-w-2xl mx-auto mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Plan Your Dream Event</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Weddings, galas, birthdays, and more. PlanEro helps you find venues, vendors, and ideas you can't find
            anywhere else.
          </p>
          <Button
            size="lg"
            className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg"
            onClick={() => router.push("/venues")}
          >
            START PLANNING
          </Button>
        </motion.div>
      </div>

      {/* Photo Credit */}
      <div className="absolute bottom-4 right-4 text-white/70 text-sm">Photo by John & Joseph Photography</div>
    </section>
  )
}
