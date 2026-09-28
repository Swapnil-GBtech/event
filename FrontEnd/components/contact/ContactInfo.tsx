"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100"
    >
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Contact Information
      </h3>

      <div className="space-y-6">
        <div className="flex items-start">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">Our Location</h4>
            <p className="text-gray-600 mt-1">123 Event Street, Suite 500</p>
            <p className="text-gray-600">San Francisco, CA 94103</p>
            <Button variant="link" className="p-0 h-auto mt-1 text-primary" asChild>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
                View on map <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">Phone Number</h4>
            <p className="text-gray-600 mt-1">Main: (123) 456-7890</p>
            <p className="text-gray-600">Support: (123) 456-7891</p>
            <Button variant="link" className="p-0 h-auto mt-1 text-primary" asChild>
              <a href="tel:+11234567890" className="flex items-center">
                Call us now
              </a>
            </Button>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">Email Address</h4>
            <p className="text-gray-600 mt-1">info@eventhub.com</p>
            <p className="text-gray-600">support@eventhub.com</p>
            <Button variant="link" className="p-0 h-auto mt-1 text-primary" asChild>
              <a href="mailto:info@eventhub.com" className="flex items-center">
                Email us
              </a>
            </Button>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">Business Hours</h4>
            <p className="text-gray-600 mt-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
            <p className="text-gray-600">Sunday: Closed</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-gray-100 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Connect With Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="bg-primary/10 hover:bg-primary/20 transition-colors p-2 rounded-full">
              <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="bg-primary/10 hover:bg-primary/20 transition-colors p-2 rounded-full">
              <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="bg-primary/10 hover:bg-primary/20 transition-colors p-2 rounded-full">
              <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.017z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
