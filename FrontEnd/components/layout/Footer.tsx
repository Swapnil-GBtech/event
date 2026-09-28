"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function Footer() {
  const categories = [
    { name: "Weddings", href: "/categories/weddings" },
    { name: "Concerts", href: "/categories/concerts" },
    { name: "Conferences", href: "/categories/conferences" },
    { name: "Seminars", href: "/categories/seminars" },
    { name: "Festivals", href: "/categories/festivals" },
  ]

  const links = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ]

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="font-satisfy text-3xl text-primary">EventHub</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Host. Join. Celebrate. Your one-stop solution for all event management needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Event Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={`/events?category=${category.name.toLowerCase()}`}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe to Newsletter</h3>
            <p className="text-gray-400 mb-4">Stay updated with our latest events and offers.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                // Handle form submission
                toast({
                  title: "Subscribed!",
                  description: "Thank you for subscribing to our newsletter!",
                })
                e.currentTarget.reset()
              }}
            >
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none bg-gray-800 border-gray-700 text-white"
                  required
                />
                <Button type="submit" className="rounded-l-none">
                  <Send size={16} />
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
