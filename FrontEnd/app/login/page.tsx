import LoginForm from "@/components/auth/LoginForm"
import Image from "next/image"

export const metadata = {
  title: "Login | EventHub",
  description: "Login to your EventHub account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
          alt="Event"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h1 className="text-4xl md:text-5xl font-satisfy mb-4">EventHub</h1>
            <p className="text-xl md:text-2xl">Host. Join. Celebrate.</p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
