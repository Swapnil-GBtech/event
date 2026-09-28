"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth/auth-provider"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { getAllCategoryThunk, createCategoryThunk, deleteCategoryThunk,updateCategoryThunk } from "../ReduxSlices/CategorySlice"
import { CategoryModel } from "../CategroyDialogModel/model"
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
import { Loader2 } from "lucide-react"
import { set } from "react-hook-form"

export default function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const[categoryId,setCategoryId] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const[editcategory,setEditCategory] = useState("")
  const[action,setAction] = useState("")
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast()

  const { auth } = useAuth();
  const dispatch = useAppDispatch();
  const { allcategory, loading } = useAppSelector((state) => state.category);


  useEffect(() => {
    dispatch(getAllCategoryThunk())
  }, [dispatch, auth]);

     
  const handleSubmitCategory = () => {
     if(action=="add"){
         const newCategory = { name: category,organizationId:auth?._id };
           console.log("newCategory", newCategory);
      dispatch(createCategoryThunk(newCategory)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast({
          title: "Category created",
          description: "Your category has been successfully created.",
        })
      }
      dispatch(getAllCategoryThunk());
      setOpen(false);
    })
    setCategory("");
     }else{

         console.log("editcategory",editcategory);
      dispatch(updateCategoryThunk({ categoryId, name: editcategory })).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast({
            title: "Category updated",
            description: "Your category has been successfully updated.",
          })
        }
        dispatch(getAllCategoryThunk());
        setOpen(false);
      })
      setCategory("");
     }
  }





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


  const confirmDelete = () => {
    dispatch(deleteCategoryThunk(categoryId)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast({
          title: "Category deleted",
          description: "Your category has been successfully deleted.",
        })
      }
      dispatch(getAllCategoryThunk());
    })
  }

  return (
    <>
      <CategoryModel
        open={open}
        setOpen={setOpen}
        loading={loading}
        setCategory={setCategory}
        action={action}
        category={category}
        editcategory={editcategory}
        setEditCategory={setEditCategory}
        setAction={setAction}
        handleSubmitCategory={handleSubmitCategory}
      />
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 flex justify-between items-center border-b">
          <h3 className="text-lg font-medium">Categories</h3>
          <Button
            onClick={() => {setOpen(true),setAction("add")}}
            size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allcategory?.map((category) => (
                  <TableRow key={category?._id}>
                    <TableCell className="font-medium">{category?.Category_name}</TableCell>
                    <TableCell>{category?.Category_name}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                           onClick={() => {setOpen(true),setAction("edit"),setEditCategory(category?.Category_name),setCategoryId(category?._id)}}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => { setShowDeleteDialog(true); setCategoryId(category?._id)} }
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the category and may affect events using this
                category.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                {
                  loading ? <div className="flex items-center justify-center">
                       <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                       <span>Deleting...</span> 
                  </div> : "Delete"
                }
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}
