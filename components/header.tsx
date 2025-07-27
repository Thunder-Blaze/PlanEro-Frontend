"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Heart, ShoppingCart, User, Menu, X, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()
  const { items } = useCart()
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight">PARTYSLATE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/venues" className="text-sm font-medium hover:text-primary transition-colors">
              VENUES
            </Link>
            <Link href="/planners" className="text-sm font-medium hover:text-primary transition-colors">
              PLANNERS
            </Link>
            <Link href="/vendors" className="text-sm font-medium hover:text-primary transition-colors">
              VENDORS
            </Link>
            <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
              SERVICES
            </Link>
            <Link href="/ideas" className="text-sm font-medium hover:text-primary transition-colors">
              IDEAS
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Try 'Four Seasons'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:flex"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Favorites */}
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Heart className="h-4 w-4" />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => router.push("/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  {user.name}
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => router.push("/auth/signin")}>
                  LOG IN
                </Button>
                <Button size="sm" onClick={() => router.push("/auth/signup")}>
                  SIGN UP
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Try 'Four Seasons'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <nav className="space-y-2">
                <Link href="/venues" className="block py-2 text-sm font-medium">
                  VENUES
                </Link>
                <Link href="/planners" className="block py-2 text-sm font-medium">
                  PLANNERS
                </Link>
                <Link href="/vendors" className="block py-2 text-sm font-medium">
                  VENDORS
                </Link>
                <Link href="/services" className="block py-2 text-sm font-medium">
                  SERVICES
                </Link>
                <Link href="/ideas" className="block py-2 text-sm font-medium">
                  IDEAS
                </Link>
              </nav>

              <div className="flex items-center space-x-4 pt-4 border-t">
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                <Link href="/favorites">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </Link>

                {user ? (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => router.push("/profile")}>
                      Profile
                    </Button>
                    <Button variant="ghost" size="sm" onClick={signOut}>
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => router.push("/auth/signin")}>
                      LOG IN
                    </Button>
                    <Button size="sm" onClick={() => router.push("/auth/signup")}>
                      SIGN UP
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
