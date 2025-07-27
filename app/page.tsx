import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { VenuesSection } from "@/components/venues-section"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Suspense } from "react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <main>
          <HeroSection />
          <VenuesSection />
          <ServicesSection />
        </main>
      </Suspense>
      <Footer />
    </div>
  )
}
