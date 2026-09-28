"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setFormData, resetFormData } from "../ReduxSlices/UserSlice";
import { registerUserThunk } from "../ReduxSlices/UserSlice";

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { formdata, loading } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),

    role: z.string({
      required_error: "Please select a role.",
    }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formdata?.name,
      email: formdata?.email,
      password: formdata?.password,
      role: formdata?.role,
    },
  });

  const handleFormChange = (field: string, value: string) => {
    form.setValue(field, value);
    dispatch(setFormData({ [field]: value }));
  };

  // const onSubmit = async (data: FormValues) => {
  //   try {
  //     localStorage.setItem("user", JSON.stringify(data));
  //      dispatch(registerUserThunk(data)).then(()=>{
  //     toast({
  //       title: "Account created",
  //       description: "Your account has been created successfully.",
  //     });
  //       router.push("/login");
  //   }).catch (Error) {
  //     console.error("Error registering:", Error);
  //   }

  //   } catch (error) {
  //     console.error("Error registering:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to create your account. Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const onSubmit = (data: FormValues) => {
    dispatch(registerUserThunk(data))
      .then((res) => {
         
        // Make sure it's fulfilled and has payload
        if (
          res.type === "user/registerUserThunk/fulfilled" &&
          res.payload?.statuscode === 201
        ) {
          toast({
            title: "Account created",
            description: "Your account has been created successfully.",
          });
          
          router.push("/login");
          dispatch(resetFormData());
        } else {
          // Handle rejected payload here if needed
          toast({
            title: "Error",
            description:
              res.payload ||
              "Something went wrong while creating your account.",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        // NOTE: This `.catch()` only catches JS/dispatch-level errors, not rejected thunk
        toast({
          title: "Error",
          description:
            error?.message ||
            "Failed to create your account. Please try again.",
          variant: "destructive",
        });
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-100"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-primary" />
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your full name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFormChange("name", e.target.value);
                    }}
                    className="border-gray-300 focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-primary" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your email address"
                    type="email"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFormChange("email", e.target.value);
                    }}
                    className="border-gray-300 focus-visible:ring-primary"
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
                <FormLabel className="flex items-center">
                  <Lock className="mr-2 h-4 w-4 text-primary" />
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Create a password"
                    type="password"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFormChange("password", e.target.value);
                    }}
                    className="border-gray-300 focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <UserCheck className="mr-2 h-4 w-4 text-primary" />I am
                  registering as
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFormChange("role", value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="border-gray-300 focus-visible:ring-primary">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="attendee">
                      Attendee (Join Events)
                    </SelectItem>
                    <SelectItem value="organizer">
                      Organizer (Host Events)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 flex items-center justify-center gap-2"
            disabled={isSubmitting || loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Log in
            </Link>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
