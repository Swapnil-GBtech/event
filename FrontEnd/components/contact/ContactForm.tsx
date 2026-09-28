"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { submitContactForm } from "@/lib/api"
import { User, Mail, MessageSquare, Phone, HelpCircle } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  subject: z.string().min(1, {
    message: "Please select a subject.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true)
      await submitContactForm(data)
      toast({
        title: "Message sent",
        description: "We've received your message and will get back to you soon.",
      })
      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100"
    >
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Send Us a Message
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-primary" />
                  Your Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    className="border-gray-300 focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-primary" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                      className="border-gray-300 focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-primary" />
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your phone number"
                      {...field}
                      className="border-gray-300 focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <HelpCircle className="mr-2 h-4 w-4 text-primary" />
                  Subject
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-gray-300 focus-visible:ring-primary">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="support">Customer Support</SelectItem>
                    <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4 text-primary" />
                  Your Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your message here"
                    className="min-h-32 border-gray-300 focus-visible:ring-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Form>
    </motion.div>
  )
}
