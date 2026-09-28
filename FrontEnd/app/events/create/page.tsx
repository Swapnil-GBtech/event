import EventForm from "@/components/events/EventForm"

export const metadata = {
  title: "Create Event | EventHub",
  description: "Create a new event on EventHub",
}

// create event page

export default function CreateEventPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
          <EventForm />
        </div>
      </div>
    </div>
  )
}
