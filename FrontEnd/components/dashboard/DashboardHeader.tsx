import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function DashboardHeader() {
  return (
    <div className="bg-gray-50 py-8 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your events and view analytics</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link href="/events/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
