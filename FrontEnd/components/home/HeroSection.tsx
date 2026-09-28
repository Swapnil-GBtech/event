// "use client"

// import { useState, useEffect, useRef } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { ChevronRight } from 'lucide-react'
// import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
// import { useAuth } from "@/lib/auth/auth-provider"
// import { Badge } from "@/components/ui/badge"
// import { cn } from "@/lib/utils"

// const carouselImages = [
//   {
//     url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
//     alt: "Concert event with crowd and stage lights",
//     title: "Unforgettable Experiences",
//     subtitle: "Create memories that last a lifetime",
//   },
//   {
//     url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
//     alt: "Corporate conference with attendees",
//     title: "Professional Gatherings",
//     subtitle: "Connect with industry leaders and peers",
//   },
//   {
//     url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
//     alt: "Wedding celebration with decorations",
//     title: "Celebrate Special Moments",
//     subtitle: "Your perfect day deserves perfect planning",
//   },
// ]

// export default function HeroSection() {

//   const [hydrated, setHydrated] = useState(false)
//   const [currentSlide, setCurrentSlide] = useState(0)
//   const [isTransitioning, setIsTransitioning] = useState(false)
//   const { auth } = useAuth()
//   const containerRef = useRef(null)
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end start"],
//   })

//   const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
//   const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
//   const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

//   // Unified transition system
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (!isTransitioning) {
//         setIsTransitioning(true)
//         // Change slide immediately when transition starts
//         setTimeout(() => {
//           setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
//         }, 0)

//         // Reset transition state after animation completes
//         setTimeout(() => {
//           setIsTransitioning(false)
//         }, 1000)
//       }
//     }, 6000)

//     return () => clearInterval(interval)
//   }, [isTransitioning])


//   useEffect(() => {
//     setHydrated(true)
//   }, [])

//   // Handle manual slide changes
//   const handleSlideChange = (index: number) => {
//     if (index !== currentSlide && !isTransitioning) {
//       setIsTransitioning(true)
//       setTimeout(() => {
//         setCurrentSlide(index)
//       }, 0)

//       setTimeout(() => {
//         setIsTransitioning(false)
//       }, 1000)
//     }
//   }

//   const canCreateEvent = auth && (auth?.role === "admin" || auth?.role === "organizer")

//   const progressBarVariants = {
//     initial: { width: 0 },
//     animate: { width: "100%", transition: { duration: 6, ease: "linear" } },
//   }

//   // Unified transition duration and easing
//   const transitionDuration = 1.0
//   const transitionEasing = [0.4, 0.0, 0.2, 1]

//   // Image transition variants
//   const imageVariants = {
//     initial: { opacity: 0 },
//     animate: {
//       opacity: 1,
//       transition: {
//         duration: transitionDuration,
//         ease: transitionEasing,
//       },
//     },
//     exit: {
//       opacity: 0,
//       transition: {
//         duration: transitionDuration,
//         ease: transitionEasing,
//       },
//     },
//   }

//   // Synchronized content variants for all text elements
//   const contentVariants = {
//     initial: {
//       opacity: 0,
//       y: 20,
//     },
//     animate: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: transitionDuration,
//         ease: transitionEasing,
//         staggerChildren: 0.1,
//       },
//     },
//     exit: {
//       opacity: 0,
//       y: -20,
//       transition: {
//         duration: transitionDuration,
//         ease: transitionEasing,
//         staggerChildren: 0.05,
//       },
//     },
//   }

//   // Individual element variants for staggered animation
//   const elementVariants = {
//     initial: {
//       opacity: 0,
//       y: 20,
//     },
//     animate: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: transitionDuration,
//         ease: transitionEasing,
//       },
//     },
//     exit: {
//       opacity: 0,
//       y: -20,
//       transition: {
//         duration: transitionDuration * 0.8,
//         ease: transitionEasing,
//       },
//     },
//   }

//   return (
//     <section ref={containerRef} className="relative h-screen overflow-hidden bg-black">
//       {/* Carousel - Using framer-motion for perfect synchronization */}
//       <motion.div style={{ opacity, scale }} className="absolute inset-0 overflow-hidden">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={`image-${currentSlide}`}
//             variants={imageVariants}
//             initial="initial"
//             animate="animate"
//             exit="exit"
//             className="absolute inset-0"
//           >
//             <Image
//               src={carouselImages[currentSlide].url || "/placeholder.svg"}
//               alt={carouselImages[currentSlide].alt}
//               fill
//               priority
//               className="object-cover"
//             />
//           </motion.div>
//         </AnimatePresence>

//         {/* Overlay gradient - always visible */}
//         <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
//       </motion.div>

//       {/* Carousel Indicators */}
//       <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
//        {carouselImages?.map((_, index) => (
//   <button
//     key={index}
//     onClick={() => handleSlideChange(index)}
//     disabled={isTransitioning}
//     className={cn(
//       "w-3 h-3 rounded-full transition-all duration-300 relative overflow-hidden",
//       currentSlide === index ? "bg-primary w-12" : "bg-white/50 hover:bg-white/80",
//       isTransitioning && "pointer-events-none",
//     )}
//   >
//     <motion.div
//       key={`progress-${index}`}
//       variants={progressBarVariants}
//       initial="initial"
//       animate={currentSlide === index && !isTransitioning ? "animate" : "initial"}
//       className={cn(
//         "absolute inset-0 origin-left",
//         currentSlide === index ? "bg-primary" : "bg-transparent"
//       )}
//     />
//   </button>
// ))}


//       </div>

//       {/* Content - All elements synchronized */}
//       <motion.div style={{ y }} className="relative h-full flex items-center">
//         <div className="container mx-auto px-4">
//           <div className="max-w-3xl text-white">
//             {/* All content elements synchronized with image transitions */}
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={`content-${currentSlide}`}
//                 variants={contentVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//                 className="space-y-6"
//               >
//                 {/* Badge */}
//                 <motion.div variants={elementVariants}>
//                   <Badge className="px-4 py-1 text-sm bg-primary/80 hover:bg-primary">
//                     The Ultimate Event Platform
//                   </Badge>
//                 </motion.div>

//                 {/* Main title and subtitle */}
//                 <motion.div variants={elementVariants} className="space-y-4">
//                   <h1 className="text-5xl md:text-7xl font-bold leading-tight">
//                     {carouselImages[currentSlide].title}
//                   </h1>
//                   <p className="text-xl md:text-2xl text-gray-200">
//                     {carouselImages[currentSlide].subtitle}
//                   </p>
//                 </motion.div>

//                 {/* Description text */}
//                 <motion.p
//                   variants={elementVariants}
//                   className="text-lg md:text-xl text-gray-300"
//                 >
//                   Your one-stop solution for seamless event management. From planning to execution, we've got you covered.
//                 </motion.p>

//                 {/* Buttons */}
//                 <motion.div
//                   variants={elementVariants}
//                   className="flex flex-col sm:flex-row gap-4 pt-2"
//                 >
//                   <Button size="lg" asChild className="rounded-full text-base px-8 h-12">
//                     <Link href="/events">
//                       Explore Events
//                       <ChevronRight className="ml-2 h-4 w-4" />
//                     </Link>
//                   </Button>
//                   {canCreateEvent && (
//                     <Button
//                       size="lg"
//                       variant="outline"
//                       className="rounded-full bg-transparent text-white border-white hover:bg-white hover:text-gray-900 text-base px-8 h-12"
//                       asChild
//                     >
//                       <Link href="/events/create">Create Event</Link>
//                     </Button>
//                   )}
//                 </motion.div>
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>
//       </motion.div>
//     </section>
//   )
// }






"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight, X } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth/auth-provider"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    alt: "Concert event with crowd and stage lights",
    title: "Unforgettable Experiences",
    subtitle: "Create memories that last a lifetime",
  },
  {
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    alt: "Corporate conference with attendees",
    title: "Professional Gatherings",
    subtitle: "Connect with industry leaders and peers",
  },
  {
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    alt: "Wedding celebration with decorations",
    title: "Celebrate Special Moments",
    subtitle: "Your perfect day deserves perfect planning",
  },
]

export default function HeroSection() {
  const [hydrated, setHydrated] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    address: "",
  })
  const { auth } = useAuth()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  // Show popup when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true)
    }, 2000) // Show popup after 2 seconds

    return () => clearTimeout(timer)
  }, [])

  // Unified transition system
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true)
        // Change slide immediately when transition starts
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
        }, 0)
        // Reset transition state after animation completes
        setTimeout(() => {
          setIsTransitioning(false)
        }, 1000)
      }
    }, 6000)

    return () => clearInterval(interval)
  }, [isTransitioning])

  useEffect(() => {
    setHydrated(true)
  }, [])

  // Handle manual slide changes
  const handleSlideChange = (index: number) => {
    if (index !== currentSlide && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide(index)
      }, 0)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 1000)
    }
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Add your form submission logic here
    setShowPopup(false)
  }

  const canCreateEvent = auth && (auth?.role === "admin" || auth?.role === "organizer")

  const progressBarVariants = {
    initial: { width: 0 },
    animate: { width: "100%", transition: { duration: 6, ease: "linear" } },
  }

  // Unified transition duration and easing
  const transitionDuration = 1.0
  const transitionEasing = [0.4, 0.0, 0.2, 1]

  // Image transition variants
  const imageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: transitionDuration,
        ease: transitionEasing,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: transitionDuration,
        ease: transitionEasing,
      },
    },
  }

  // Synchronized content variants for all text elements
  const contentVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: transitionDuration,
        ease: transitionEasing,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: transitionDuration,
        ease: transitionEasing,
        staggerChildren: 0.05,
      },
    },
  }

  // Individual element variants for staggered animation
  const elementVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: transitionDuration,
        ease: transitionEasing,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: transitionDuration * 0.8,
        ease: transitionEasing,
      },
    },
  }

  // Popup animation variants
  const popupVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      x: 100,
      y: -50,
    },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      x: 100,
      y: -50,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  }

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-black">
      {/* Carousel - Using framer-motion for perfect synchronization */}
      <motion.div style={{ opacity, scale }} className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`image-${currentSlide}`}
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
          >
            <Image
              src={carouselImages[currentSlide].url || "/placeholder.svg"}
              alt={carouselImages[currentSlide].alt}
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* Overlay gradient - always visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </motion.div>

      {/* Host Event Popup Form */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            variants={popupVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed mt-6 top-6 right-6 z-50 w-80 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white mb-1">Host Your Event</h3>
                <p className="text-sm text-gray-300">Get started with your event planning</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-white text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNo" className="text-white text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNo"
                    type="tel"
                    value={formData.phoneNo}
                    onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-white text-sm font-medium">
                    Address
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                    placeholder="Enter your address"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Submit Request
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carousel Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {carouselImages?.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            disabled={isTransitioning}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300 relative overflow-hidden",
              currentSlide === index ? "bg-primary w-12" : "bg-white/50 hover:bg-white/80",
              isTransitioning && "pointer-events-none",
            )}
          >
            <motion.div
              key={`progress-${index}`}
              variants={progressBarVariants}
              initial="initial"
              animate={currentSlide === index && !isTransitioning ? "animate" : "initial"}
              className={cn("absolute inset-0 origin-left", currentSlide === index ? "bg-primary" : "bg-transparent")}
            />
          </button>
        ))}
      </div>

      {/* Content - All elements synchronized */}
      <motion.div style={{ y }} className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl text-white">
            {/* All content elements synchronized with image transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentSlide}`}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                {/* Badge */}
                <motion.div variants={elementVariants}>
                  <Badge className="px-4 py-1 text-sm bg-primary/80 hover:bg-primary">
                    The Ultimate Event Platform
                  </Badge>
                </motion.div>

                {/* Main title and subtitle */}
                <motion.div variants={elementVariants} className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-bold leading-tight">{carouselImages[currentSlide].title}</h1>
                  <p className="text-xl md:text-2xl text-gray-200">{carouselImages[currentSlide].subtitle}</p>
                </motion.div>

                {/* Description text */}
                <motion.p variants={elementVariants} className="text-lg md:text-xl text-gray-300">
                  Your one-stop solution for seamless event management. From planning to execution, we've got you
                  covered.
                </motion.p>

                {/* Buttons */}
                <motion.div variants={elementVariants} className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button size="lg" asChild className="rounded-full text-base px-8 h-12">
                    <Link href="/events">
                      Explore Events
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  {canCreateEvent && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full bg-transparent text-white border-white hover:bg-white hover:text-gray-900 text-base px-8 h-12"
                      asChild
                    >
                      <Link href="/events/create">Create Event</Link>
                    </Button>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

