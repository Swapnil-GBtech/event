"use client"
import { Suspense, use } from "react"
import EventsHeader from "@/components/events/EventsHeader"
import EventsList from "@/components/events/EventsList"
import EventsLoading from "@/components/events/EventsLoading"
import { useState, useEffect } from "react"
import { filterEvents } from "@/components/ApiServices/ApiServices"
import { set } from "date-fns"
import { AddTofaverate } from "@/components/ApiServices/ApiServices"
import { useToast } from "@/components/ui/use-toast"
import { useAuth, } from "@/lib/auth/auth-provider"

export default function EventsPage() {

  const [categoryName, setCategoryName] = useState("All Events")
  const [favariteId, setFavariteId] = useState("")
  const [favarvoate, setfavorate] = useState([])
  const [pendingEvent, setPendingEvent] = useState(null);

  const { auth, setAuth } = useAuth()

  const { toast } = useToast()

  const [filterData, setFilterdata] = useState([])

  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")


useEffect(() => {
  const handleFavoriteToggle = async () => {
    if (!favariteId?._id) return;

    try {
      setLoading(true);

      const res = await AddTofaverate(favariteId._id);

      if (res?.data) {
        toast({
          title: res.message?.includes("removed")
            ? "Event Removed from Favorites"
            : "Event Added to Favorites",
          description: res.message,
        });

        setAuth((prev) => {
          const alreadyFavorited = prev.favorate_events.some(
            (e) => e._id === favariteId._id
          );

          const updatedFavorites = alreadyFavorited
            ? prev.favorate_events.filter((e) => e._id !== favariteId._id)
            : [...prev.favorate_events, favariteId];

          return {
            ...prev,
            favorate_events: updatedFavorites,
          };
        });

        setfavorate(res.data);
      } else {
        toast({
          title: "Error",
          description:
            res?.data?.message || "Something went wrong while toggling favorite.",
          variant: "destructive",
        });
      }
    } catch (err) {

        console.log("err", err)
      toast({
        title: "Error",
        description:
          err?.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  handleFavoriteToggle();
}, [favariteId]);



  useEffect(() => {
    if (categoryName) {
      setLoading(true)
      filterEvents(categoryName).then((res) => {
        setFilterdata(res?.data)
        setLoading(false)
      })
    }
  }, [categoryName])


  const filteredEvents =
    filterData?.filter(
      (event: any) =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []


  return (
    <div className="pt-24 pb-16">
      <EventsHeader setCategoryName={setCategoryName} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
      <Suspense fallback={<EventsLoading />}>
        <EventsList allevents={filteredEvents} loading={loading} setFavariteId={setFavariteId} setPendingEvent={setPendingEvent} />
      </Suspense>
    </div>
  )
}
