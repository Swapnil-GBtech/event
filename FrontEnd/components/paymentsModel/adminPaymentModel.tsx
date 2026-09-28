 
"use client"
import { useEffect, useState } from "react"
import type React from "react"
import { Calendar, MapPin, User, Mail, Phone, CreditCard, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { CreateOrder, VerifyPayment } from "../ApiServices/ApiServices"

interface PaymentSheetProps {
  formdata: any
  handleCreateAdmin: () => void
  isSheetOpen: boolean
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleAdminPayments: () => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

const AdminPaymentSheet = ({ formdata, handleCreateAdmin, isSheetOpen, setIsSheetOpen,handleAdminPayments }: PaymentSheetProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false)
  const { auth } = useAuth()
  const { toast } = useToast()
  const [orderformData, setOrderFormData] = useState({})
  const [getOrderData, setGetOrderData] = useState({})

  // Default user data as provided
  const defaultUserData = {
    email: "zeenat@gmail.com",
    name: "Samar Ali",
    organization: "WebXlerner",
    password: "123456",
    phone: "9027130674",
    price: "999",
    role: "admin",
    subscriptionType: "Monthly",
  }

  // Use provided formdata or fallback to default data
  const userData = formdata && Object.keys(formdata).length > 0 ? formdata : defaultUserData

  console.log("formdata", userData)

  useEffect(() => {
    if (userData && auth) {
      setOrderFormData({
        amount: userData?.price || 999,
        ordername: userData?.subscriptionType || "Monthly",
        username: userData?.name || "Samar Ali",
        organizationId: auth?._id || userData?.organization || "WebXlerner",
        eventId: userData?._id || "",
        role: userData?.role || "admin",
        userId: auth?.id || auth?._id || "",
      })
    }
  }, [auth, userData])

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true)
          return
        }
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
      })
    }

    loadRazorpayScript()

    // Add custom CSS to ensure Razorpay appears on top
    const style = document.createElement("style")
    style.textContent = `
      .razorpay-container {
        z-index: 999999 !important;
      }
      .razorpay-checkout-frame {
        z-index: 999999 !important;
      }
      .razorpay-backdrop {
        z-index: 999998 !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (script) {
        document.body.removeChild(script)
      }
      // Remove custom style
      const customStyle = document.querySelector("style")
      if (customStyle && customStyle.textContent?.includes("razorpay-container")) {
        document.head.removeChild(customStyle)
      }
    }
  }, [])

  // Create order API call
  const handleCreateOrder = async () => {
    if (!orderformData || !userData) {
      toast({
        title: "Error",
        description: "Missing required data. Please try again.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreatingOrder(true)
      setIsLoading(true)

      const response = await CreateOrder(orderformData)

      if (response?.data || response?.success) {
        const orderData = response?.data || response
        setGetOrderData(orderData)

        toast({
          title: "Order Created",
          description: "Redirecting to payment gateway...",
        })

        // Close the sheet first, then open Razorpay after a delay
        setIsSheetOpen(false)

        // Wait for sheet to close completely before opening Razorpay
        setTimeout(() => {
          handlePayment(orderData)
        }, 500) // Increased delay to ensure sheet is fully closed
      } else {
        throw new Error(response?.message || "Failed to create order")
      }
    } catch (error: any) {
      console.error("Error creating order:", error)
      setIsLoading(false)
      setIsCreatingOrder(false)
      toast({
        title: "Order Creation Failed",
        description: error?.message || "Failed to create order. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle Razorpay payment
  const handlePayment = async (orderData: any) => {
    try {
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please refresh and try again.")
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: orderData?.amount * 100, // Convert to paise
        currency: "INR",
        name: "WebXlerner Admin Panel",
        description: `${userData?.subscriptionType} Subscription for ${userData?.name}`,
        order_id: orderData?.id || orderData?.orderId,
        prefill: {
          name: userData?.name || "Samar Ali",
          email: userData?.email || "zeenat@gmail.com",
          contact: userData?.phone || "9027130674",
        },
        theme: {
          color: "#3B82F6",
        },
        handler: async (response: any) => {
          await handlePaymentSuccess(response, orderData)
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
            setIsCreatingOrder(false)
            // Reopen the sheet if payment is cancelled
            setIsSheetOpen(true)
            toast({
              title: "Payment Cancelled",
              description: "You can try again when ready.",
              variant: "destructive",
            })
          },
          // Ensure Razorpay modal has highest z-index
          escape: false,
          animation: true,
          backdrop_close: false,
        },
        // Additional options to ensure proper z-index
        config: {
          display: {
            language: "en",
          },
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on("payment.failed", (response: any) => {
        console.error("Payment Failed:", response.error)
        setIsLoading(false)
        setIsCreatingOrder(false)
        // Reopen the sheet if payment fails
        setIsSheetOpen(true)
        toast({
          title: "Payment Failed",
          description: response.error?.description || "Payment failed. Please try again.",
          variant: "destructive",
        })
      })

      // Ensure all overlays are hidden before opening Razorpay
      document.body.style.overflow = "hidden"
      rzp.open()
    } catch (error: any) {
      console.error("Payment initialization error:", error)
      setIsLoading(false)
      setIsCreatingOrder(false)
      setIsSheetOpen(true) // Reopen sheet on error
      toast({
        title: "Payment Error",
        description: error?.message || "Failed to initialize payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle successful payment
  const handlePaymentSuccess = async (response: any, orderData: any) => {
    try {
      setIsVerifyingPayment(true)

      // Restore body scroll
      document.body.style.overflow = "auto"

      toast({
        title: "Payment Successful!",
        description: "Verifying payment and creating admin account...",
      })

      // Verify payment with backend
      const verificationData = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        amount: orderData.amount,
        currency: "INR",
        username: userData?.name,
        ordername: userData?.subscriptionType,
        organizationId:  auth?._id,
        role:userData?.role
      }

      const paymentResponse = await VerifyPayment(verificationData)

      if (paymentResponse?.success || paymentResponse?.statusCode === 200 || paymentResponse?.statuscode === 200) {
        // Create admin account
        await handleCreateAdmin()
        await handleAdminPayments()
        toast({
          title: "Account Created Successfully!",
          description: "Your admin account has been created and activated.",
        })
        setIsSheetOpen(false)
      } else {
        throw new Error(paymentResponse?.message || "Payment verification failed")
      }
    } catch (verifyError: any) {
      console.error("Payment verification failed:", verifyError)
      toast({
        title: "Verification Failed",
        description: verifyError?.message || "Payment verification failed. Please contact support.",
        variant: "destructive",
      })
      setIsSheetOpen(true) // Reopen sheet on verification error
    } finally {
      setIsLoading(false)
      setIsCreatingOrder(false)
      setIsVerifyingPayment(false)
      // Restore body scroll
      document.body.style.overflow = "auto"
    }
  }

  // Handle sheet close
  const handleClose = () => {
    if (isLoading || isCreatingOrder || isVerifyingPayment) {
      toast({
        title: "Please Wait",
        description: "Payment is being processed. Please don't close this window.",
        variant: "destructive",
      })
      return
    }
    setIsSheetOpen(false)
    setIsLoading(false)
    setIsCreatingOrder(false)
    setIsVerifyingPayment(false)
  }

  const processingFee = 0
  const totalAmount = (Number.parseInt(userData?.price) || 999) + processingFee

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-[400px] md:w-[600px] lg:w-[700px] xl:w-[800px] max-w-none sm:max-w-none md:max-w-none lg:max-w-none xl:max-w-none rounded-l-3xl rounded-bl-3xl overflow-y-auto z-50"
        
      >
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center justify-between text-xl">
            <span>Confirm Admin Registration</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isLoading || isCreatingOrder || isVerifyingPayment}
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          {/* User Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Admin Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Name:</span>
                  <span className="truncate">{userData?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Email:</span>
                  <span className="truncate">{userData?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Phone:</span>
                  <span>{userData?.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Organization:</span>
                  <span>{userData?.organization}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Role:</span>
                  <span className="capitalize">{userData?.role}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Subscription:</span>
                  <span>{userData?.subscriptionType}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Payment Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{userData?.subscriptionType} Subscription</span>
                <span>₹{userData?.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Processing Fee</span>
                <span className="text-sm">₹{processingFee}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between items-center font-semibold text-xl">
                <span>Total Amount</span>
                <span className="text-primary">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Processing Status */}
          {(isCreatingOrder || isVerifyingPayment) && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">
                    {isCreatingOrder && "Creating order..."}
                    {isVerifyingPayment && "Verifying payment and creating admin account..."}
                  </p>
                  <p className="text-sm text-blue-700">Please don't close this window</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
              disabled={isLoading || isCreatingOrder || isVerifyingPayment}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateOrder}
              className="flex-1"
              disabled={isLoading || isCreatingOrder || isVerifyingPayment || !userData?.price}
            >
              {isLoading || isCreatingOrder || isVerifyingPayment ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isCreatingOrder && "Creating Order..."}
                  {isVerifyingPayment && "Verifying..."}
                  {isLoading && !isCreatingOrder && !isVerifyingPayment && "Processing..."}
                </div>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ₹{totalAmount}
                </>
              )}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p className="flex items-center justify-center gap-1">🔒 Your payment is secured by Razorpay</p>
            <p>By proceeding, you agree to our terms and conditions</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AdminPaymentSheet


