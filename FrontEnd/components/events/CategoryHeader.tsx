"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { fetchCategories } from "@/lib/api"
import type { Category } from "@/lib/types"

interface CategoryHeaderProps {
  slug: string
}

export default function CategoryHeader({ slug }: CategoryHeaderProps) {
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getCategory = async () => {
      try {
        setIsLoading(true)
        const categories = await fetchCategories()
        const foundCategory = categories.find((cat) => cat.slug === slug)
        setCategory(foundCategory || null)
      } catch (error) {
        console.error("Error fetching category:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getCategory()
  }, [slug])

  const categoryName = category?.name || slug.charAt(0).toUpperCase() + slug.slice(1)

  return (
    <section className="bg-gradient-to-r from-primary to-purple-600 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {isLoading ? (
            <div className="h-12 w-48 bg-white/20 rounded-lg animate-pulse mx-auto mb-4"></div>
          ) : (
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{categoryName} Events</h1>
          )}
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Discover and book amazing {categoryName.toLowerCase()} events happening near you.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
