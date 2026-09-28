"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

interface StatsCardProps {
  title: string
  value: number
  icon: React.ElementType
  description: string
  color: string
  gradient: string
}

export default function StatsCard({ title, value, icon: Icon, description, color, gradient }: StatsCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className={`h-2 bg-gradient-to-r ${gradient}`} />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <div className={`${color} p-2 rounded-full bg-opacity-10`}>
            <Icon className={`h-5 w-5 ${color.replace("bg-", "text-")}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</div>
          <p className="text-sm text-gray-500">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
