"use client"

import { useState, useEffect } from "react"
import { User, UserPlus, MoreHorizontal, Edit, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {getAllUsersThunk} from "../ReduxSlices/UserSlice"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { useAuth } from "@/lib/auth/auth-provider"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User as UserType } from "@/lib/types"

// Mock users data
const mockUsers: UserType[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@events.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Event Organizer",
    email: "organizer@events.com",
    role: "organizer",
  },
  {
    id: "3",
    name: "Event Attendee",
    email: "attendee@events.com",
    role: "attendee",
  },
  {
    id: "4",
    name: "John Smith",
    email: "john@example.com",
    role: "organizer",
  },
  {
    id: "5",
    name: "Emily Johnson",
    email: "emily@example.com",
    role: "attendee",
  },
  {
    id: "6",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "attendee",
  },
  {
    id: "7",
    name: "Sarah Davis",
    email: "sarah@example.com",
    role: "organizer",
  },
]

export default function UsersTable() {
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const {auth} = useAuth();
  const dispatch = useAppDispatch();
  const {allUsers,loading} = useAppSelector((state) => state.user);

  // console.log("allUsers",allUsers)

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "attendee" as "admin" | "organizer" | "attendee",
    password: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    dispatch(getAllUsersThunk())
  }, [dispatch, auth])
   

  // useEffect(() => {
  //   // Simulate API call
  //   const getUsers = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 1000))
  //     setUsers(mockUsers)
  //     setIsLoading(false)
  //   }

  //   getUsers()
  // }, [])

  const handleDelete = async () => {
    if (!selectedUser) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser))
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setSelectedUser(null)
    }
  }

  const handleAddUser = async () => {
    try {
      // Validate form
      if (!newUser.name || !newUser.email || !newUser.password) {
        toast({
          title: "Missing fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Add new user with random ID
      const newId = Math.random().toString(36).substring(2, 9)
      setUsers((prev) => [
        ...prev,
        {
          id: newId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      ])

      toast({
        title: "User added",
        description: "The new user has been successfully added.",
      })

      // Reset form and close dialog
      setNewUser({
        name: "",
        email: "",
        role: "attendee",
        password: "",
      })
      setShowAddUserDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add the user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const confirmDelete = (id: string) => {
    setSelectedUser(id)
    setShowDeleteDialog(true)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>
      case "organizer":
        return <Badge className="bg-blue-500">Organizer</Badge>
      case "attendee":
        return <Badge variant="outline">Attendee</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 flex justify-between items-center border-b">
        <h3 className="text-lg font-medium">Users</h3>
        <Button size="sm" onClick={() => setShowAddUserDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
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
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers?.map((user) => (
                <TableRow key={user?._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      {user?.name}
                    </div>
                  </TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>{getRoleBadge(user?.role)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => confirmDelete(user?._id)}
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
              This action cannot be undone. This will permanently delete the user and remove all associated data.
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

      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. Fill in all the required information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value: "admin" | "organizer" | "attendee") => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="organizer">Organizer</SelectItem>
                  <SelectItem value="attendee">Attendee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
