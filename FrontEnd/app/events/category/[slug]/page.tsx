import type { Metadata } from "next"
import CategoryHeader from "@/components/events/CategoryHeader"
import CategoryEvents from "@/components/events/CategoryEvents"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)

  return {
    title: `${categoryName} Events | EventHub`,
    description: `Browse all ${params.slug} events on EventHub`,
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <CategoryHeader slug={params.slug} />
      <CategoryEvents slug={params.slug} />
    </div>
  )
}
