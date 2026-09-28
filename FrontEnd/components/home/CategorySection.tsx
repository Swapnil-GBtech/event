"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
 
export default function CategorySection({evetsdata, isLoading}:{evetsdata:Event[],isLoading:boolean}) {
 
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore events by category to find exactly what you're looking for, from concerts and conferences to
            weddings and parties.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {evetsdata?.slice(0,5)?.map((category) => (
              <motion.div key={category._id} variants={item}>
                <Link href={`/events/${category._id}`} className="block">
                  <div className="relative h-40 rounded-lg overflow-hidden group">
                    <Image
                      src={category?.image || "/placeholder.svg"}
                      alt={category?.Category?.Category_name|| "Event Category Image"} 
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                      <h3 className="text-white font-semibold text-lg">{category?.Category?.Category_name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
