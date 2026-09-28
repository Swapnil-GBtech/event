"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X, PlusCircle, LogOut, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch } from "@/lib/store"
import { logoutUserThunk } from "../ReduxSlices/UserSlice"


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const [users, setUsers] = useState(null)
  const { auth, refreshUser } = useAuth()

  const dispatch = useAppDispatch();

  const { toast } = useToast();
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  // const users  = JSON.parse(localStorage.getItem("user"))

  const canCreateEvent = auth && (auth?.role === "admin" || auth?.role === "organizer")


  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
    } else {
      setUsers(JSON.parse(user))
    }
  }, [auth])



  const handlelogoutUser = async () => {
    const response = await dispatch(logoutUserThunk())
    if (response?.payload?.statuscode == 201) {

      toast({
        title: "Logout Successful",
        description: "You have successfully logged out.",
      });
      await refreshUser();
      router.push("/login")
    } else {
      toast({
        title: "Error",
        description: "Something went wrong while logging out.",
        variant: "destructive",
      });
    }

  }


  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  }

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md",
        isScrolled || pathname !== "/"
          ? "bg-white/90 shadow-md py-2"
          : "bg-gradient-to-b from-black/50 to-transparent py-4",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <motion.span
              className="font-satisfy text-3xl text-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              EventHub
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Events", "Contact", auth ? "Dashboard" : null, auth?.role == "attendee" ? "Favorites" : null]
              .filter(Boolean)
              .map((item, i) => {
                const path = item === "Home"
                  ? "/"
                  : `${auth?.role === "admin"
                    ? "/dashboard"
                    : auth?.role === "organizer"
                      ? "/organizerdashboard"
                      : "/attendeedashboard"
                  }`;

                return (
                  item && (
                    <motion.div key={item} custom={i} variants={menuItemVariants}>
                      <Link
                        href={path}
                        className={cn(
                          "text-foreground transition-colors relative group",
                          isActive(path) ? "text-primary font-medium" : "hover:text-primary",
                          pathname === "/" && !isScrolled ? "text-white hover:text-white" : "",
                        )}
                      >
                        {item}
                        <span
                          className={cn(
                            "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                            isActive(path) ? "w-full" : "",
                          )}
                        ></span>
                      </Link>
                    </motion.div>
                  )
                )
              })}
          </nav> */}


          <nav className="hidden md:flex items-center space-x-8">
            {[
              { label: "Home", path: "/" },
              { label: "Events", path: "/events" },
              { label: "Contact", path: "/contact" },
              auth ? {
                label: "Dashboard",
                path: auth?.role === "admin"
                  ? "/dashboard"
                  : auth?.role === "organizer"
                    ? "/organizerdashboard"
                    : "/attendeedashboard"
              } : null,
              auth?.role === "attendee" ? { label: "Favorites", path: "/favorites" } : null,
            ]
              .filter(Boolean)
              .map((item, i) => {
                const isLinkActive = pathname === item.path;

                return (
                  <motion.div key={item.label} custom={i} variants={menuItemVariants}>
                    <Link
                      href={item.path}
                      className={cn(
                        "text-foreground transition-colors relative group",
                        isLinkActive ? "text-primary font-medium" : "hover:text-primary",
                        pathname === "/" && !isScrolled ? "text-white hover:text-white" : "",
                      )}
                    >
                      {item.label}
                      <span
                        className={cn(
                          "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                          isLinkActive ? "w-full" : "",
                        )}
                      ></span>
                    </Link>
                  </motion.div>
                )
              })}
          </nav>


          <div className="hidden md:flex items-center space-x-4">
            {/* <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search
                className={cn(
                  "h-5 w-5 transition-colors",
                  pathname === "/" && !isScrolled ? "text-white" : "text-foreground",
                )}
              />
            </motion.div> */}

            {/* {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "200px" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  type="text"
                  placeholder="Search events..."
                  className="h-9 w-full focus-visible:ring-primary"
                  autoFocus
                />
              </motion.div>
            )} */}

            {auth ? (
              <>


                {/* {canCreateEvent && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="default" className="rounded-full">
                      <Link href="/events/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Event
                      </Link>
                    </Button>
                  </motion.div>
                )} */}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${auth?.name}`} />
                        <AvatarFallback>{auth?.name ? getInitials(auth?.name) : "U"}</AvatarFallback>
                      </Avatar>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{auth?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{auth?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     
                    {
                      auth?.role =="attendee" && (
                         <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                      )
                    }

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handlelogoutUser}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    asChild
                    className={cn(
                      pathname === "/" && !isScrolled ? "text-white hover:text-white hover:bg-white/20" : "",
                    )}
                  >
                    <Link href="/login">
                      Login
                    </Link>
                  </Button>
                </motion.div>
                
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X
                size={24}
                className={cn(pathname === "/" && !isScrolled && !isMenuOpen ? "text-white" : "text-foreground")}
              />
            ) : (
              <Menu
                size={24}
                className={cn(pathname === "/" && !isScrolled && !isMenuOpen ? "text-white" : "text-foreground")}
              />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden py-4 bg-white absolute top-full left-0 right-0 shadow-md"
          >
            <nav className="flex flex-col space-y-4 px-4">
              {["Home", "Events", "Contact", auth ? "Dashboard" : null, auth ? "Favorites" : null]
                .filter(Boolean)
                .map((item, i) => {
                  const path = item === "Home" ? "/" : `/${item?.toLowerCase()}`
                  return (
                    item && (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Link
                          href={path}
                          className={cn(
                            "text-foreground transition-colors block py-2",
                            isActive(path) ? "text-primary font-medium" : "hover:text-primary",
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item}
                        </Link>
                      </motion.div>
                    )
                  )
                })}



              {auth ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${auth?.name}`} />
                          <AvatarFallback>{auth?.name ? getInitials(auth?.name) : "U"}</AvatarFallback>
                        </Avatar>
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{auth?.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{auth?.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          Profile
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handlelogoutUser}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {canCreateEvent && (
                    <Button asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Link href="/events/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Event
                      </Link>
                    </Button>
                  )}

                  <Button variant="outline" className="w-full justify-start" onClick={() => handlelogoutUser()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <a href="/register">Register</a>
                  </Button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
