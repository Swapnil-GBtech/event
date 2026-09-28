"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OtpModel from "../Otp/Otp"
import ForgetPasswordModal from "../forgetpassword/forgetPassword"


import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth/auth-provider"

import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setloginformdata, resetloginformdata, resetFormData } from "../ReduxSlices/UserSlice"
import { Loader2 } from "lucide-react"
import { loginUserThunk } from "../ReduxSlices/UserSlice"
import { set } from "date-fns"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),

})

type FormValues = z.infer<typeof formSchema>

export default function LoginForm() {
  const { loginformdata, loading } = useAppSelector((state) => state.user)
  const [openotpModel, setopenotpModel] = useState(false)

  const [openforgetPasswordModal, setopenforgetPasswordModal] = useState(false)


  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: loginformdata.email,
      password: loginformdata.password,
    },
  })

  const handleloginFormChange = (field: string, value: string) => {
    form.setValue(field, value);
    dispatch(setloginformdata({ [field]: value }));
  }


  const HandleCloseOtpModel = () => {
    setopenotpModel(false)
  }

  const HandleCloseForgetPasswordModel = () => {
    setopenforgetPasswordModal(false)
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await dispatch(loginUserThunk(data)).unwrap();
        
      if (res?.statuscode === 200) {
        toast({
          title: "OTP Sent Successfully",
          description:
            res?.message || "An OTP has been sent to your email. Please verify to continue.",
        });
        localStorage.setItem("user", JSON.stringify(res?.data));
        setopenotpModel(true);
        dispatch(resetFormData())
        
      } 

    } catch (error: any) {
       console.log("error",error)
      setopenotpModel(false)
      toast({
        title: "Error",
        description:
           error || "Something went wrong during login.",
        variant: "destructive",
      });
    }
  };


  return (
    <>
      {openotpModel && <OtpModel openotpModel={openotpModel} HandleCloseOtpModel={HandleCloseOtpModel} />}
      {openforgetPasswordModal && <ForgetPasswordModal openforgetPasswordModal={openforgetPasswordModal} HandleCloseForgetPasswordModel={HandleCloseForgetPasswordModel} />}
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login to EventHub</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsContent value="login" className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.email@example.com"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleloginFormChange("email", e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••" {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleloginFormChange("password", e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full flex justify-center items-center bg-primary "
                    disabled={loading}>
                    {loading ? <div className="flex items-center justify-center gap-1">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>loading...</span>
                    </div> : "Login"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <Link
              onClick={() => setopenforgetPasswordModal(true)}
              href="#" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
