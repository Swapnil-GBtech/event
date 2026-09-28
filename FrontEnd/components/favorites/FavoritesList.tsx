"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import EventCard from "@/components/events/EventCard"
import type { Event } from "@/lib/types"
import { fetchEvents } from "@/lib/api"
import { useAuth } from "@/lib/auth/auth-provider"
import { useToast } from "../ui/use-toast"
import { AddTofaverate } from "../ApiServices/ApiServices"
 
import { useAppDispatch } from "@/lib/store"
 
import { Loader2 } from "lucide-react"

export default function FavoritesList() {
  const [favorites, setFavorites] = useState<Event[]>([])
  const[favorate,setfavorate] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const[loading,setLoading] = useState(false)
  const dispatch = useAppDispatch();

  const{toast} = useToast()

  const { auth ,setAuth} = useAuth();

    const[favariteId,setFavariteId] = useState("")

  


  //  useEffect(() => {
  //    const handleFavoriteToggle = async () => {
  //      if (!favariteId) return;
  //      try {
  //        setLoading(true);
  //        const res = await AddTofaverate(favariteId._id);
  //        if (res?.data) {
  //          toast({
  //            title: "Event Added to Favorites",
  //            description: res?.message,
  //          });
   
  //          setfavorate(res.data);
  //          setAuth((prev)=>({
  //               ...prev,
  //               favorate_events:res?.data?.favorate_events
  //          }))
  //          setLoading(false);
  //        } else {
  //          toast({
  //            title: "Error",
  //            description: res?.data?.message || "Something went wrong while toggling favorite.",
  //            variant: "destructive",
  //          });
  //        }
  //      } catch (err) {
  //        toast({
  //          title: "Error",
  //          description: err?.response?.data?.message || "Something went wrong.",
  //          variant: "destructive",
  //        });
  //      } finally {
  //        setLoading(false);
  //      }
  //    };
   
  //    handleFavoriteToggle();
  //  }, [favariteId?._id]);



  useEffect(() => {
  const handleRemoveFavorite = async () => {
    if (!favariteId) return;

    try {
      setLoading(true);

      const res = await AddTofaverate(favariteId._id); // toggle = remove here

      if (res?.data) {
        toast({
          title: "Removed from Favorites",
          description: res?.message,
        });

        // ✅ update only frontend UI — remove from current list
        setAuth((prev) => ({
          ...prev,
          favorate_events: prev.favorate_events.filter(
            (e) => e._id !== favariteId._id
          ),
        }));

        setfavorate(res.data); // optional
      } else {
        toast({
          title: "Error",
          description:
            res?.data?.message || "Something went wrong while removing favorite.",
          variant: "destructive",
        });
      }
    } catch (err) {
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

  handleRemoveFavorite();
}, [favariteId?._id]);



    if(loading){
         return <div className="flex justify-center items-center">
             <Loader2 className="animate-spin h-16 w-16" />
         </div>
    }
    

  const handleToggleFavorite = (event: Event) => {
    // Get current favorites from local storage
    const storedFavorites = localStorage.getItem("favoriteEvents")
    const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : []

    // Remove from favorites
    const updatedFavoriteIds = favoriteIds.filter((id: string) => id !== event.id)
    localStorage.setItem("favoriteEvents", JSON.stringify(updatedFavoriteIds))

    // Update UI
    setFavorites(favorites.filter((fav) => fav.id !== event.id))

    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"))
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {auth?.favorate_events?.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {auth?.favorate_events?.map((event:any) => (
            <EventCard
              key={event._id}
              event={event}
              title="remove"
              setFavariteId={setFavariteId}
              onToggleFavorite={() => handleToggleFavorite(event)}
              isFavorite={true}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-4 rounded-full">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-4">No favorite events yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start adding events to your favorites by clicking the heart icon on any event card.
          </p>
          <Button asChild>
            <a href="/events">Browse Events</a>
          </Button>
        </div>
      )}
    </div>

  )
}
