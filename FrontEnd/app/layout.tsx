import type React from "react"
import type { Metadata } from "next"
import { Poppins, Satisfy } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth/auth-provider"
import StoreProvider from "@/components/provider/storeprovider"
import LayoutShell from "@/components/LayoutShell/LayOutShell"
 
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const satisfy = Satisfy({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-satisfy",
})

export const metadata: Metadata = {
  title: "EventHub - Host. Join. Celebrate.",
  description: "Modern event management system for all your celebration needs",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>)
  
{
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${satisfy.variable} font-poppins`}>
         <StoreProvider> 
            <AuthProvider>
              <LayoutShell>{children}</LayoutShell>
          <Toaster />
        </AuthProvider>
        </StoreProvider>
        
      </body>
    </html>
  )
}
