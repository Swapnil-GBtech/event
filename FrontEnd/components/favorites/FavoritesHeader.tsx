"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"

export default function FavoritesHeader() {
  return (
    <section className="bg-gradient-to-r from-primary to-purple-600 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Heart className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Your Favorite Events</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Manage your collection of saved events and never miss out on the experiences you love.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
