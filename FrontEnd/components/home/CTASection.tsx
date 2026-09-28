"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth/auth-provider"

export default function CTASection() {
  const { user } = useAuth()
  const canCreateEvent = user && (user.role === "admin" || user.role === "organizer")

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-primary to-purple-700 rounded-3xl p-8 md:p-16 text-white text-center relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
            <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl"></div>
            <div className="absolute -bottom-32 left-1/3 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Ready to Create Your Next Event?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl mb-10 max-w-2xl mx-auto text-white/90"
            >
              Join thousands of event organizers who trust EventHub for their event management needs. Start planning
              your next successful event today!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {canCreateEvent ? (
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="rounded-full px-8 py-6 text-base h-auto group bg-white text-primary hover:bg-white/90"
                >
                  <Link href="/events/create">
                    <Calendar className="mr-2 h-5 w-5" />
                    Create Event Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                    className="rounded-full px-8 py-6 text-base h-auto group bg-white text-primary hover:bg-white/90"
                  >
                    <Link href="/events">
                      Explore Events
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="rounded-full px-8 py-6 text-base h-auto bg-white border-white text-purple-600 hover:bg-purple-700 hover:text-white"
                  >
                    <Link href="/login">Sign Up Free</Link>
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
