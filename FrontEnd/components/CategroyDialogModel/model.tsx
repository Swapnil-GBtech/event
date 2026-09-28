import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import React from "react"

export function CategoryModel({
  open,
  setOpen,
  loading,
  setCategory,
  category,
  action,
  setAction,
  editcategory,
  setEditCategory,
  handleSubmitCategory
}: {
  open: boolean,
  setOpen: () => React.SetStateAction<boolean>,
  loading: Boolean,
  setCategory: () => React.SetStateAction<string>,
  action: string
  setAction: () => React.SetStateAction<string>,
  editcategory: string,
  setEditCategory: () => React.SetStateAction<string>,
  category: string,
  handleSubmitCategory: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={action == "add" ? category : editcategory}
                onChange={(e) => {
                  action == "add" ? setCategory(e.target.value) : setEditCategory(e.target.value)
                }}
                defaultValue="Pedro Duarte" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleSubmitCategory}
              type="submit"
            >
              {loading ? (
                <div className="flex justify-center items-center gap-2">
                  <Loader2 className="animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : action === "add" ? "Add Category" : "Update Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
