
import type { Metadata } from "next"
import FavoritesHeader from "@/components/favorites/FavoritesHeader"
import FavoritesList from "@/components/favorites/FavoritesList"

export const metadata: Metadata = {
  title: "Favorite Events | EventHub",
  description: "View and manage your favorite events on EventHub",
}

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <FavoritesHeader />
      <FavoritesList />
    </div>
  )
}
