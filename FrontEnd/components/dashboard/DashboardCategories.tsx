"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Category } from "@/lib/types"
import { fetchCategories, deleteCategory } from "@/lib/api"

export default function DashboardCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getCategories()
  }, [])

  const handleDelete = async () => {
    if (!selectedCategory) return

    try {
      await deleteCategory(selectedCategory)
      setCategories((prev) => prev.filter((category) => category.id !== selectedCategory))
      toast({
        title: "Category deleted",
        description: "The category has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setSelectedCategory(null)
    }
  }

  const confirmDelete = (id: string) => {
    setSelectedCategory(id)
    setShowDeleteDialog(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>Manage event categories</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-10 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                <span>{category.name}</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/categories/edit/${category.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => confirmDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/categories/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </CardFooter>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
