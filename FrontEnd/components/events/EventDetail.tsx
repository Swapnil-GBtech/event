// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { format, set } from "date-fns"
// import { Calendar, MapPin, Users, Clock, Tag, Edit, Trash2, Share2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { useParams } from "next/navigation"
// import { useAuth } from "@/lib/auth/auth-provider"
// import { getEventById } from "@/components/ApiServices/ApiServices"
// import { Loader2 } from "lucide-react"
// import { addRegisterEvent } from "@/components/ApiServices/ApiServices"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { useToast } from "@/components/ui/use-toast"
// // import { fetchEvent, deleteEvent } from "@/lib/api"


// import { useRouter } from "next/navigation"
// import PaymentModel from "../paymentsModel/paymentmodel"


// interface EventDetailProps {
//   id: string,
//   eventdata: any
// }

// export default function EventDetail() {
//   const [eventdata, setEventData] = useState<any>({})
//   const params = useParams()
//   const id = params.id
//   const [loader, setloader] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false)
//   const { toast } = useToast()
//   const router = useRouter()
//   const { auth, refreshUser } = useAuth()
//   const[payentData,setPaymentData] = useState({})

//   useEffect(() => {
//     getEventById(auth?._id,id).then((data) => {
//       setEventData(data?.data)
//       setIsLoading(false)
//     })
//   }, [id])


//   const handleRegisterEvent = async (id: string) => {
//     try {
//       setloader(true)
//       const response = await addRegisterEvent(id)

//        console.log("response", response)
//       if (response?.data) {
//         toast({
//           title: "Event Registered",
//           description: "You have successfully registered for the event.",
//         })
//           await refreshUser()
//         setloader(false)
//       } else {
//         setloader(false)
//         toast({
//           title: "Error",
//           description: "Failed to register for the event. Please try again.",
//         })
//       }
//       return response?.data
//     } catch (error) {
//       setloader(false)
//         toast({
//           title: "Error",
//           description: error?.response?.data?.message || "Something went wrong",
//           variant: "destructive",
//         })
//     }
//   }


//   if (isLoading) {
//     return <div className="min-h-screen flex items-center justify-center">
//       <Loader2 className="animate-spin h-16 w-16" />
//     </div>
//   }

//   if (!eventdata) {
//     return (
//       <div className="container mx-auto px-4 text-center py-16">
//         <h2 className="text-2xl font-semibold mb-4">Event not found</h2>
//         <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
//         <Button asChild>
//           <Link href="/events">Back to Events</Link>
//         </Button>
//       </div>
//     )
//   }



//   return (
//     <>
//        <div>
//          <div>
//          <div className="container mx-auto px-4">
//         <div className="max-w-5xl mx-auto">
//           <div className="relative h-96 rounded-lg overflow-hidden mb-8">
//             <Image
//               src={eventdata?.image || "/placeholder.svg?height=800&width=1200"}
//               alt={eventdata?.Event_title}
//               fill
//               className="object-cover"
//               priority
//             />
//           </div>

//           <div className="flex flex-col md:flex-row gap-8">
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-4">
//                 <Badge variant="outline" className="text-primary border-primary">
//                   {eventdata?.Category?.Category_name}
//                 </Badge>
//                 <Badge variant="outline" className="text-green-600 border-green-600">
//                   {new Date(eventdata?.Date) > new Date() ? "Upcoming" : "Past"}
//                 </Badge>
//               </div>

//               <h1 className="text-3xl md:text-4xl font-bold mb-4">{eventdata?.Event_title}</h1>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                 <div className="flex items-center text-gray-600">
//                   <Calendar className="h-5 w-5 mr-2 text-primary" />
//                   <span>{format(new Date(eventdata?.Date), "EEEE, MMMM d, yyyy")}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <Clock className="h-5 w-5 mr-2 text-primary" />
//                   <span>{format(new Date(eventdata?.Date), "h:mm a")}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <MapPin className="h-5 w-5 mr-2 text-primary" />
//                   <span>{eventdata?.Date}</span>
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <Users className="h-5 w-5 mr-2 text-primary" />
//                   {/* <span>{eventdata.attendees} attending</span> */}
//                 </div>
//                 <div className="flex items-center text-gray-600">
//                   <Tag className="h-5 w-5 mr-2 text-primary" />
//                   <span>${eventdata?.Price.toFixed(2)}</span>
//                 </div>
//               </div>

//               <Separator className="mb-8" />

//               <div className="mb-8">
//                 <h2 className="text-2xl font-semibold mb-4">About This eventdata</h2>
//                 <div className="prose max-w-none">
//                   <p className="text-gray-700 whitespace-pre-line">{eventdata?.Description}</p>
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-4 mb-8 cursor-pointer">

//                 <Button variant="outline">
//                   <Share2 className="mr-2 h-4 w-4" />
//                   Share
//                 </Button>
//               </div>
//             </div>

//             <div className="w-full md:w-80 bg-gray-50 p-6 rounded-lg h-fit">
//               <h3 className="text-xl font-semibold mb-4">Event Details</h3>
//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-medium text-gray-700">Date & Time</h4>
//                   <p className="text-gray-600">{format(new Date(eventdata?.Date), "EEEE, MMMM d, yyyy")}</p>
//                   <p className="text-gray-600">{format(new Date(eventdata?.Date), "h:mm a")}</p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-700">Location</h4>
//                   <p className="text-gray-600">{eventdata?.location}</p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-700">Price</h4>
//                   <p className="text-gray-600">${eventdata?.Price.toFixed(2)}</p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-gray-700">Organizer</h4>
//                   <p className="text-gray-600">{eventdata?.Organizer?.name}</p>
//                 </div>
//               </div>

//               <Separator className="my-6" />
//               <Button
//                 // onClick={() => handleRegisterEvent(eventdata?._id)}
//                 onClick={()=>setPaymentData(eventdata)}
//                 disabled={auth?.registered_attendees?.some((event) => event._id === eventdata?._id)}
//                 className="w-full"
//               >
//                 {loader ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <Loader2 className="animate-spin h-4 w-4" />
//                     <span>Registering...</span>
//                   </div>
//                 ) : auth?.registered_attendees?.some((event) => event._id === eventdata?._id) ? (
//                   <span className="text-muted">Registered</span>
//                 ) : (
//                   <span className="text-primary text-white">Register</span>
//                 )}
//               </Button>

//             </div>
//           </div>
//         </div>
//       </div>
//       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the event "{eventdata?.Event_title}" and remove it from
//               our servers.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction className="bg-destructive text-destructive-foreground">
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//        </div>

//          {
//           Object.keys(payentData).length > 0 && (
//             <PaymentModel eventdata={payentData} setPaymentData={setPaymentData} />
//           )
//          }
//        </div>

//     </>
//   )
// }





"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, MapPin, Users, Clock, Tag, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useParams } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-provider"
import { getEventById, addRegisterEvent } from "@/components/ApiServices/ApiServices"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import PaymentModel from "../paymentsModel/paymentmodel"

export default function EventDetail() {
  const [eventdata, setEventData] = useState<any>({})
  const params = useParams()
  const id = params.id
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const { auth, refreshUser } = useAuth()
  const [paymentData, setPaymentData] = useState({})

  useEffect(() => {
    if (id) {
      getEventById(id).then((data) => {
        setEventData(data?.data)
        setIsLoading(false)
      })
    }
  }, [id])

  const handleRegisterClick = () => {
    if (!auth) {
      toast({
        title: "Authentication Required",
        description: "Please login to register for events.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    // Check if user is already registered
    if (auth?.registered_attendees?.some((event: any) => event._id === eventdata?._id)) {
      toast({
        title: "Already Registered",
        description: "You are already registered for this event.",
      })
      return
    }

    // Open payment modal
    setPaymentData(eventdata)
  }



  const handleRegisterEvent = async (id: string) => {
    try {

      const response = await addRegisterEvent(id)
      if (response?.data) {
        toast({
          title: "Event Registered",
          description: "You have successfully registered for the event.",
        })
        await refreshUser()
      } else {
        toast({
          title: "Error",
          description: "Failed to register for the event. Please try again.",
        })
      }
      return response?.data
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      })
    }
  }



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-16 w-16" />
      </div>
    )
  }

  if (!eventdata) {
    return (
      <div className="container mx-auto px-4 text-center py-16">
        <h2 className="text-2xl font-semibold mb-4">Event not found</h2>
        <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/events">Back to Events</Link>
        </Button>
      </div>
    )
  }

  const isRegisteredDisable = () => {
    if (auth?.role == "organizer" || auth?.role == "admin" || auth?.role == "super Admin") return true
    const isRegistered = auth?.registered_attendees?.some((event: any) => event._id === eventdata?._id)
    return isRegistered
  }

  const getButtonText = () => {
    if (auth?.role == "organizer" || auth?.role == "admin" || auth?.role == "super Admin") {
      return auth?.role == "admin" ? "Admin Can not Apply any events" : "Organizer Can not Apply any events"
    }
    const isRegistered = auth?.registered_attendees?.some((event: any) => event._id === eventdata?._id)

    if (isRegistered) return "Already Registered in this event"
    return `Register Now - ₹${eventdata?.Price}`;
  }


  const isRegistered = auth?.registered_attendees?.some((event: any) => event._id === eventdata?._id)

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={eventdata?.image || "/placeholder.svg?height=800&width=1200"}
              alt={eventdata?.Event_title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-primary border-primary">
                  {eventdata?.Category?.Category_name}
                </Badge>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {new Date(eventdata?.Date) > new Date() ? "Upcoming" : "Past"}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{eventdata?.Event_title}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  <span>{format(new Date(eventdata?.Date), "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <span>{eventdata?.Time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <span>{eventdata?.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  <span>{eventdata?.attendee?.length || 0} attending</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Tag className="h-5 w-5 mr-2 text-primary" />
                  <span>₹{eventdata?.Price}</span>
                </div>
              </div>

              <Separator className="mb-8" />

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{eventdata?.Description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            <div className="w-full md:w-80 bg-gray-50 p-6 rounded-lg h-fit">
              <h3 className="text-xl font-semibold mb-4">Event Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Date & Time</h4>
                  <p className="text-gray-600">{format(new Date(eventdata?.Date), "EEEE, MMMM d, yyyy")}</p>
                  <p className="text-gray-600">{eventdata?.Time}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Location</h4>
                  <p className="text-gray-600">{eventdata?.location}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Price</h4>
                  <p className="text-gray-600">₹{eventdata?.Price}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Category</h4>
                  <p className="text-gray-600">{eventdata?.Category?.Category_name}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Organizer</h4>
                  <p className="text-gray-600">{eventdata?.organizer?.name}</p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* <Button onClick={handleRegisterClick} disabled={isRegistered} className="w-full" size="lg">
                {isRegistered && auth?.role !== "admin" && auth?.role !== "organizer" ? (
                  <span className="text-muted-foreground">Already Registered</span>
                ) : (
                  <span>Register Now - ₹{eventdata?.Price}</span>
                )}
              </Button>

              {isRegistered && (
                <p className="text-sm text-green-600 text-center mt-2">✓ You are registered for this event</p>
              )} */}




              <Button
                onClick={handleRegisterClick}
                disabled={isRegisteredDisable()}
                className="w-full"
                size="lg"
              >
                <span className={isRegisteredDisable() ? "text-muted-foreground text-white" : ""}>
                  {getButtonText()}
                </span>
              </Button>

              {/* Show success message only for attendee */}
              {auth?.role === "attendee" && isRegistered && (
                <p className="text-sm text-green-600 text-center mt-2">
                  ✓ You are registered for this event
                </p>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModel eventdata={paymentData} setPaymentData={setPaymentData} handleRegisterEvent={handleRegisterEvent} />
    </>
  )
}

