 
// "use client"

// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   type ReactNode,
//   useCallback,
// } from "react"
// import { getCurrentUser } from "@/components/ApiServices/ApiServices"

// interface User {
//   id: string
//   name: string
//   email: string
//   role: string
// }

// interface AuthContextType {
//   auth: User | null
//   setAuth: (user: User | null) => void
//   refreshUser: () => Promise<void>         
//   isLoading: boolean
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [auth, setAuth] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   //  create reusable refresh function

//    const authUser = localStorage.getItem("user")
   
//   const refreshUser = useCallback(async () => {
//     try {
//       setIsLoading(true)
//       const response = await getCurrentUser()
//       if (response?.data) {
//         setAuth(response.data)
//       } else {
//         setAuth(null)
//       }
//     } catch (error) {
//       console.error("Failed to fetch current user", error)
//       setAuth(null)
//     } finally {
//       setIsLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     if(authUser){
//       refreshUser()
//     }
//   }, [refreshUser])

//   return (
//     <AuthContext.Provider value={{ auth, setAuth, refreshUser, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }



"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react"
import { getCurrentUser } from "@/components/ApiServices/ApiServices"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  auth: User | null
  setAuth: (user: User | null) => void
  refreshUser: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getCurrentUser()
      if (response?.data) {
        setAuth(response.data)
      } else {
        setAuth(null)
      }
    } catch (error) {
      console.error("Failed to fetch current user", error)
      setAuth(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    //  Run only on client
    const authUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (authUser) {
      refreshUser()
    } else {
      setIsLoading(false)  
    }
  }, [refreshUser])

  return (
    <AuthContext.Provider value={{ auth, setAuth, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
