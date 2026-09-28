
"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form, FormControl, FormDescription, FormField,
  FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { getAllCategoryThunk, } from "../ReduxSlices/CategorySlice"
import { getAllOrganizerThunk } from "../ReduxSlices/UserSlice"
import { updateEventsThunk, getAllEventsThunk } from "../ReduxSlices/CreateEventSlice"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  Event_title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  Description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  eventdate: z.date({ required_error: "A date is required." }),
  Time: z.string({ required_error: "A time is required." }),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
  Category: z.string({ required_error: "Please select a category." }),
  Price: z.number().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a valid number.",
  }),
  image: z
    .instanceof(File)
    .optional()
    .or(z.literal(null))
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Image must be less than 5MB",
    })
    .refine((file) =>
      !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type), {
      message: "Only JPG, PNG or WEBP images are allowed",
    }),
 
})


type FormValues = z.infer<typeof formSchema>

type Props = {
  editdata: Partial<FormValues & { Date?: string, image?: string }>
  setEditData: React.Dispatch<React.SetStateAction<Partial<FormValues>>>
  id: string
}

export default function EventFormEdit({ editdata, setEditData, id }: Props) {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { auth } = useAuth();
  const dispatch = useAppDispatch();
  const { allOrganizer } = useAppSelector((state) => state.user);
  const { category, allcategory } = useAppSelector((state) => state.category);
  const { events, createEventFormData, loading } = useAppSelector((state) => state.createEvents);
  const { toast } = useToast()

  useEffect(() => {
    dispatch(getAllOrganizerThunk());
    dispatch(getAllCategoryThunk());
  }, [auth])


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Event_title: "",
      Description: "",
      eventdate: new Date(),
      Time: "",
      location: "",
      Category: "",
      Price: "",
      image: null,
      
    }
  })

 useEffect(() => {
  if (editdata) {
    form.reset({
      Event_title: editdata?.Event_title || "",
      Description: editdata?.Description || "",
      eventdate: editdata?.Date ? new Date(editdata.Date) : new Date(),
      Time: editdata?.Time || "",
      location: editdata?.location || "",
      Category: editdata?.Category?._id || "",
      Price: editdata?.Price || "",
      image: null,
       
    });
  }
}, [editdata, form]);




 const onSubmit = async (data: FormValues) => {
  setIsSubmitting(true);
  const formData = new FormData();

  formData.append('Event_title', data.Event_title);
  formData.append('Description', data.Description);
   formData.append('eventdate', data.eventdate.toISOString());
  

  formData.append('Time', data.Time);
  formData.append('location', data.location);
  formData.append('Category', data.Category);
  formData.append('Price', data.Price);
 

  if (data.image instanceof File) {
    formData.append("file", data.image); // <-- match backend field name
  }

  dispatch(updateEventsThunk({ id, formData })).then((res) => {
    setIsSubmitting(false);
    if (res.meta.requestStatus === "fulfilled") {
      toast({
        title: "Event Updated",
        description: "Your event has been successfully updated.",
      });
      dispatch(getAllEventsThunk());
    } else {
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
      });
    }
  });
};


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Event Title */}
        <FormField
          control={form.control}
          name="Event_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="Description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your event" className="min-h-32" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <FormField
  control={form.control}
  name="eventdate"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>Date</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "pl-3 text-left",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )}
/>


          <FormField
            control={form.control}
            name="Time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="time"
                      {...field} />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Event location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    name="Category"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          !editdata?.Category?.Category_name ? "Select a Organizer" : editdata?.Category?.Category_name
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allcategory?.map((category: { id: string, Category_name: string }) => (
                        <SelectItem key={category?._id} value={category?._id}>
                          {category?.Category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Price & Organizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="Price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                    <Input
                      type="number" min="0" step="0.01" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="organizer"
            render={({ field }) => {

               console.log("fields......",field.value)
                return  <FormItem>
                <FormLabel>Organizer</FormLabel>
                <FormControl>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder= {
                              !editdata?.Organizer?.name ? "Select a Organizer" : editdata?.Organizer?.name
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allOrganizer?.data?.map((organizer: any) => (
                        <SelectItem key={organizer._id} value={organizer._id}>
                          {organizer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            } }
          /> */}

        </div>


        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Image</FormLabel>
              <FormControl>
                <div>
                  {/* Preview logic */}
                  {field.value instanceof File ? (
                    <img
                      src={URL.createObjectURL(field.value)}
                      alt="New Preview"
                      className="w-full h-48 object-cover mb-2 rounded"
                    />
                  ) : typeof editdata.image === "string" && editdata.image.startsWith("http") ? (
                    <img
                      src={editdata.image}
                      alt="Existing Preview"
                      className="w-full h-48 object-cover mb-2 rounded"
                    />
                  ) : null}

                  {/* File input */}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      field.onChange(file);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <div className="flex items-center justify-center space-x-2">
              <Loader2 className="animate-spin h-4 w-4" />
              <span>Loading...</span>
            </div>
              :
              "Update Event"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

