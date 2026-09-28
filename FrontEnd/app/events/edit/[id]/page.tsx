'use client'
import { Suspense } from "react"
import EventFormEdit from "@/components/events/EventFormEdit"
import EventFormLoading from "@/components/events/EventFormLoading"
import { updateEventsThunk } from "@/components/ReduxSlices/CreateEventSlice"
import { useAppDispatch,useAppSelector } from "@/lib/store"
import { useAuth } from "@/lib/auth/auth-provider"
import { useState,useEffect } from "react"
import { useParams } from 'next/navigation'

export default function EditEventPage() {
    const dispatch = useAppDispatch()
    const { auth } = useAuth()
      const param = useParams()

const [editdata, setEditData] = useState({
  Event_title: "",
  Description: "",
  eventdate: "",
  Time: "",
  location: "",
  Category: "",
  Price: "",
  Organizer: "",
  image: null,
});
    
useEffect(() => {
  const fetchEventData = async () => {
    const res = await dispatch(updateEventsThunk({
     id: param.id,
     formData: {
     
     }  
}))

    const event = res?.payload?.data
    setEditData({
      Event_title: event?.Event_title || "",
      Description: event?.Description || "",
      eventdate: event?.Date || "",
      Time: event?.Time || "",
      location: event?.location || "",
      Category: event?.Category || "",
      Price: event?.Price || "",
      Organizer: event?.Organizer || "",
      image: event?.image || null,
    });
  };

  fetchEventData();
}, [dispatch, param.id]);

 
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Edit Event</h1>
          <Suspense fallback={<EventFormLoading />}>
            <EventFormEdit   editdata={editdata} setEditdata={setEditData} id={param.id}/>
          </Suspense>
        </div>
      </div>
    </div>
  )
}
