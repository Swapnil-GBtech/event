"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchTestimonials } from "@/lib/api"
import type { Testimonial } from "@/lib/types"

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right

  useEffect(() => {
    const getTestimonials = async () => {
      try {
        const data = await fetchTestimonials()
        setTestimonials(data)
      } catch (error) {
        console.error("Error fetching testimonials:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getTestimonials()
  }, [])

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 8000)
    return () => clearInterval(interval)
  }, [testimonials.length, currentIndex])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say about their experience with us.
            </p>
          </div>
          <div className="max-w-4xl mx-auto bg-gray-200 h-64 rounded-lg animate-pulse"></div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Don't just take our word for it. Here's what our clients have to say about their experience with us.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 text-primary/10">
            <Quote size={80} strokeWidth={1} />
          </div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 text-primary/10 transform rotate-180">
            <Quote size={80} strokeWidth={1} />
          </div>

          <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <div className="relative z-10">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex flex-col md:flex-row items-center gap-8"
                >
                  <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-primary/20 shadow-lg flex-shrink-0">
                    <Image
                      src={currentTestimonial.avatar || "/placeholder.svg?height=100&width=100"}
                      alt={currentTestimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-6 relative">
                      <p className="text-xl md:text-2xl italic text-gray-700 leading-relaxed">
                        "{currentTestimonial.content}"
                      </p>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">{currentTestimonial.name}</h4>
                    <p className="text-primary font-medium">{currentTestimonial.role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-primary w-6" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 md:px-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className="rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white -translate-x-1/2 md:-translate-x-1/4 opacity-70 hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous testimonial</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white translate-x-1/2 md:translate-x-1/4 opacity-70 hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next testimonial</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
