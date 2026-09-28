"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { set, z } from "zod"
import { CalendarIcon, Clock, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { createEvent } from "@/lib/api"
import { getAllOrganizerThunk } from "../ReduxSlices/UserSlice"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { getAllCategoryThunk } from "../ReduxSlices/CategorySlice"
import { useAuth } from "@/lib/auth/auth-provider"
import { createEventsThunk, updateEventsThunk, deleteEventThunk, resetFormData } from "../ReduxSlices/CreateEventSlice"
import { setFormData } from "../ReduxSlices/CreateEventSlice"
import { create } from "domain"


const formSchema = z.object({
  Event_title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  Description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  eventdate: z.date({
    required_error: "A date is required.",
  }),
  Time: z.string({
    required_error: "A time is required.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  Category: z.string({
    required_error: "Please select a category.",
  }),
  Price: z.string().refine(
    (val) => {
      const num = Number.parseFloat(val)
      return !isNaN(num) && num >= 0
    },
    {
      message: "Price must be a valid number.",
    },
  ),
  image: z
    .instanceof(File, { message: "Please upload an image file" })
    .refine((file) => file.size <= 2 * 1024 * 1024, "Max size 2 MB"),
})

type FormValues = z.infer<typeof formSchema>

export default function EventForm() {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagefile, setImageFile] = useState<File | null>(null)

  const router = useRouter()
  const { toast } = useToast()
  const { auth } = useAuth();

  const dispatch = useAppDispatch();
  const { allOrganizer } = useAppSelector((state) => state.user);
  const { category, allcategory } = useAppSelector((state) => state.category);
  const { events, createEventFormData, loading } = useAppSelector((state) => state.createEvents);



  useEffect(() => {
    dispatch(getAllOrganizerThunk());
    dispatch(getAllCategoryThunk());
  }, [auth])


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Event_title: createEventFormData?.Event_title || "",
      Description: createEventFormData?.Description || "",
      eventdate: createEventFormData?.eventdate || "",
      Time: createEventFormData?.Time || "",
      location: createEventFormData?.location || "",
      Category: createEventFormData?.Category || "",
      Price: createEventFormData?.Price || "",
      image:
        createEventFormData?.image && createEventFormData.image instanceof File
          ? createEventFormData.image
          : undefined, // ✅ Zod ke liye safe
    },
  });


  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(setFormData({ [name]: value }));
  };

   
  const onSubmit = () => {

      console.log("createEventFormData", createEventFormData);
    const formDate = new FormData()
    formDate.append("Event_title", createEventFormData?.Event_title)
    formDate.append("Description", createEventFormData?.Description)
    formDate.append("eventdate", createEventFormData?.eventdate)
    formDate.append("Time", createEventFormData?.Time)
    formDate.append("location", createEventFormData?.location)
    formDate.append("Category", createEventFormData?.Category)
    formDate.append("Price", createEventFormData?.Price)
    formDate.append("Organizer", createEventFormData?.Organizer)
    formDate.append("file", imagefile as File)
    formDate.append("organizationId", auth?._id)
    dispatch(createEventsThunk(formDate)).then((res) => {

      if (res.meta.requestStatus === "fulfilled") {
        toast({
          title: "Event created",
          description: "Your event has been successfully created.",
        })
      }
    })
    dispatch(resetFormData())
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="Event_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input
                  name="Event_title"
                  placeholder="Enter event title"
                  onChange={(e) => {
                    field.onChange(e);
                    handleChangeInput(e);
                  }}
                />
              </FormControl>
              <FormDescription>Choose a clear and descriptive title for your event.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  name="Description"
                  placeholder="Describe your event"
                  className="min-h-32"
                  onChange={(e) => {
                    field.onChange(e);
                    handleChangeInput(e);
                  }}
                />
              </FormControl>
              <FormDescription>
                Provide details about your event, what attendees can expect, and any other relevant information.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      name="eventdate"
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(selectDate) => {
                        field.onChange(selectDate);

                        if (selectDate) {
                          handleChangeInput({
                            target: {
                              name: "eventdate",
                              value: selectDate.toLocaleDateString("en-CA"),
                            },
                          });
                        }
                      }}

                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Select the date of your event.</FormDescription>
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
                      name="Time"
                      type="time"
                      placeholder="Select time"
                      onChange={(e) => {
                        field.onChange(e);
                        handleChangeInput(e);
                      }}
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50" />
                  </div>
                </FormControl>
                <FormDescription>Select the start time of your event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    name="location"
                    placeholder="Event location"
                    onChange={(e) => {
                      field.onChange(e);
                      handleChangeInput(e);
                    }}
                  />
                </FormControl>
                <FormDescription>Enter the venue or address of your event.</FormDescription>
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
                <Select
                  name="Category"
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleChangeInput({
                      target: {
                        name: "Category",
                        value: value,
                      },
                    })
                  }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
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
                <FormDescription>Select the category that best describes your event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                      name="Price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-8"
                      onChange={(e) => {
                        field.onChange(e);
                        handleChangeInput(e);
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription>Set the ticket price for your event. Use 0 for free events.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* <FormField
            control={form.control}
            name="Organizer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizer</FormLabel>
                <Select
                  name="Organizer"
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleChangeInput({
                      target: {
                        name: "Organizer",
                        value: value,
                      },
                    })
                  }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Organizer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {
                      allOrganizer?.data?.map((organizer) => (
                        <SelectItem key={organizer?._id} value={organizer._id}>
                          {organizer.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                <FormDescription>Select the category that best describes your event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input
                  name="image"
                  type="file"
                  accept="image/*"
                  placeholder="https://example.com/image.jpg"
                  onChange={(e) => {
                    field.onChange(e);
                    const file = e.target.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      field.onChange(file)
                      setImageFile(file);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Provide a URL for the event cover image. Use high-quality images for better visibility.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isSubmitting}>
            Reset
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/events")} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit" disabled={isSubmitting}>
            {loading ? <div className="flex justify-center items-center">
              <Loader2 className="animate-spin mr-2" />
              <span>createing...</span>
            </div> : "Create Event"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
