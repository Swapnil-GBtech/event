import type { Metadata } from "next"
import RegisterForm from "@/components/auth/RegisterForm"

export const metadata: Metadata = {
  title: "Register | EventHub",
  description: "Create a new account on EventHub",
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
        <RegisterForm />
      </div>
    </div>
  )
}
