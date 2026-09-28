"use client"

import { use, useState } from "react"
 import SuperAdminDashboard from "@/components/SuperAdminDashBoard/superadmindashboard"
 import { useAppDispatch } from "@/lib/store"
import { logoutUserThunk } from "@/components/ReduxSlices/UserSlice"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-provider"

export default function App() {
 
  const {refreshUser} = useAuth()

  const {toast} = useToast()
  const router = useRouter()

  const dispatch = useAppDispatch() 
  const [adminInfo, setAdminInfo] = useState({
    name: "Super Admin",
    email: "admin@eventmaster.com",
  })


     const handlelogoutUser = async ()=>{
            const response = await dispatch(logoutUserThunk())
            if(response?.payload?.statuscode==201){
             toast({
               title: "Logout Successful",
               description: response?.message || "You have successfully logged out.",
             });
             await refreshUser();
             router.push("/login")
            }else{
             toast({
               title: "Error",
               description: "Something went wrong while logging out.",
               variant: "destructive",
             }); 
            }
            
         }
  
  return <SuperAdminDashboard adminInfo={adminInfo} onLogout={handlelogoutUser} />
}
