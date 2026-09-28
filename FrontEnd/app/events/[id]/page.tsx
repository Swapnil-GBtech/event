"use client"

import { Suspense, useEffect, useState } from "react"
import EventDetail from "@/components/events/EventDetail"
import EventDetailLoading from "@/components/events/EventDetailLoading"
 

interface EventPageProps {
  params: {
    id: string
  }
}

export default function EventPage({ params }: EventPageProps) {
  const [eventdata, setEventData] = useState({})

  return (
    <div className="pt-24 pb-16">
      <Suspense fallback={<EventDetailLoading />}>
        <EventDetail/>
      </Suspense>
    </div>
  )
}
