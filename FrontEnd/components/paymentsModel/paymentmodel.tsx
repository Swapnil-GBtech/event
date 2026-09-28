
"use client"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar, MapPin, Clock, User, Mail, Phone, CreditCard, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { CreateOrder, VerifyPayment } from "../ApiServices/ApiServices"

interface PaymentModalProps {
  eventdata: any
  setPaymentData: (data: any) => void
  handleRegisterEvent: (id: string) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

const PaymentModal = ({ eventdata, setPaymentData, handleRegisterEvent }: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false)
  const { auth } = useAuth()
  const { toast } = useToast()
  const [orderformData, setOrderFormData] = useState({})
  const [getOrderData, setGetOrderData] = useState({})

  // Initialize order form data
  useEffect(() => {
    if (eventdata && auth) {
      setOrderFormData({
        amount: eventdata?.Price || 0,
        ordername: eventdata?.Event_title || "",
        username: auth?.name || "",
        organizationId: auth?.createdBy || eventdata?.organizationId || "",
        eventId: eventdata?._id || "",
        role: auth?.role || "",
        userId: auth?.id || auth?._id || "",
      })
    }
  }, [auth, eventdata])

  // Control dialog visibility
  useEffect(() => {
    setIsDialogOpen(Object.keys(eventdata).length > 0)
  }, [eventdata])

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

    return () => {
      // Cleanup on unmount
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (script) {
        document.body.removeChild(script)
      }
    }
  }, [])

  

  // Create order API call
  const handleCreateOrder = async () => {
    if (!orderformData || !eventdata) {
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

        // Close dialog before opening Razorpay
        setIsDialogOpen(false)

        // Small delay to ensure dialog is closed
        setTimeout(() => {
          handlePayment(orderData)
        }, 300)
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
        amount: orderData?.amount*100 , // Convert to paise
        currency: "INR",
        name: "Event Management System",
        description: `Registration for ${eventdata?.Event_title}`,
        order_id: orderData?.id || orderData?.orderId,
        prefill: {
          name: auth?.name || "User",
          email: auth?.email || "",
          contact: auth?.phone || "",
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
            setIsDialogOpen(true)
            toast({
              title: "Payment Cancelled",
              description: "You can try again when ready.",
              variant: "destructive",
            })
          },
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on("payment.failed", (response: any) => {
        console.error("Payment Failed:", response.error)
        setIsLoading(false)
        setIsCreatingOrder(false)

        toast({
          title: "Payment Failed",
          description: response.error?.description || "Payment failed. Please try again.",
          variant: "destructive",
        })

        setIsDialogOpen(true)
      })

      rzp.open()
    } catch (error: any) {
      console.error("Payment initialization error:", error)
      setIsLoading(false)
      setIsCreatingOrder(false)

      toast({
        title: "Payment Error",
        description: error?.message || "Failed to initialize payment. Please try again.",
        variant: "destructive",
      })

      setIsDialogOpen(true)
    }
  }

  // Handle successful payment
  const handlePaymentSuccess = async (response: any, orderData: any) => {
    try {
      setIsVerifyingPayment(true)

      toast({
        title: "Payment Successful!",
        description: "Verifying payment and registering for event...",
      })

      // Verify payment with backend
      const verificationData = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        amount: orderData.amount,
        currency: "INR",
        username: auth?.name,
        ordername: eventdata?.Event_title,
        organizationId: eventdata?.organizationId || auth?.createdBy,
        eventId: eventdata?._id,
        role: auth?.role,
        userId: auth?.id || auth?._id,
      }

      const paymentResponse = await VerifyPayment(verificationData)

      if (paymentResponse?.success || paymentResponse?.statusCode === 200 || paymentResponse?.statuscode === 200) {
        // Register for event
        await handleRegisterEvent(eventdata?._id)

        toast({
          title: "Registration Complete!",
          description: "You have successfully registered for the event.",
        })
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
    } finally {
      setIsLoading(false)
      setIsCreatingOrder(false)
      setIsVerifyingPayment(false)
      setPaymentData({}) // Close modal
    }
  }

  // Handle modal close
  const handleClose = () => {
    if (isLoading || isCreatingOrder || isVerifyingPayment) {
      toast({
        title: "Please Wait",
        description: "Payment is being processed. Please don't close this window.",
        variant: "destructive",
      })
      return
    }

    setIsDialogOpen(false)
    setPaymentData({})
    setIsLoading(false)
    setIsCreatingOrder(false)
    setIsVerifyingPayment(false)
  }

  const processingFee = 0
  const totalAmount = (eventdata?.Price || 0) + processingFee

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl">Confirm Registration</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isLoading || isCreatingOrder || isVerifyingPayment}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={eventdata?.image || "/placeholder.svg?height=120&width=120&query=event"}
                  alt={eventdata?.Event_title}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xl mb-2 line-clamp-2">{eventdata?.Event_title}</h3>
                  <Badge variant="outline" className="mb-2">
                    {eventdata?.Category?.Category_name || eventdata?.category}
                  </Badge>
                  {eventdata?.Description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-2">{eventdata.Description}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  {eventdata?.Date && <span>{format(new Date(eventdata.Date), "EEEE, MMMM d, yyyy")}</span>}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>{eventdata?.Time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="line-clamp-1">{eventdata?.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <CreditCard className="h-4 w-4 flex-shrink-0" />
                  <span>₹{eventdata?.Price}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Your Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Name:</span>
                  <span className="truncate">{auth?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Email:</span>
                  <span className="truncate">{auth?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Phone:</span>
                  <span>{auth?.phone}</span>
                </div>
                {auth?.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="font-medium">Address:</span>
                    <span className="line-clamp-2">{auth.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Payment Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Event Registration Fee</span>
                <span>₹{eventdata?.Price}</span>
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
                    {isVerifyingPayment && "Verifying payment and registering..."}
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
              disabled={isLoading || isCreatingOrder || isVerifyingPayment || !eventdata?.Price}
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
      </DialogContent>
    </Dialog>
  )
}

export default PaymentModal



