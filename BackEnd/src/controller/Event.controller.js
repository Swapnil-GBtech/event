import { asynchandler } from "../utils/AsyncHandler/AsyncHandler.js";
import { Event } from "../models/Event.model.js";
import ApiResponse from "../utils/ApiResponse/ApiResponse.js";
import ApiError from "../utils/ApiError/ApiError.js";
import { uploadOnCloudinery } from "../utils/Cloudinery/uploadCloudinery.js";
import { User } from "../models/User.model.js";

export const createEvent = asynchandler(async (req, res) => {
  try {
    const {
      Event_title,
      Description,
      eventdate,
      Time,
      location,
      Category,
      Price,
      organizationId
    } = req.body;
    if (
      !Event_title ||
      !Description ||
      !eventdate ||
      !Time ||
      !location ||
      !Category ||
      !Price 
    ) {
      throw new ApiError(400, "All fields are required");
    }

    if(!organizationId){
      throw new ApiError(400,"OrganizationId is required")
    }
    if (!req.file || !req.file.path) {
      throw new ApiError(400, "Image not found");
    }

    const fileUrl = await uploadOnCloudinery(req.file.path);

    if (!fileUrl) {
      throw new ApiError(400, "Image not uploaded");
    }

    const event = await Event.create({
      Event_title,
      Description,
      Date: eventdate,
      Time,
      location,
      Category,
      Price,
      image: fileUrl.secure_url,
      createdBy: organizationId
    });
    return res
      .status(201)
      .json(new ApiResponse(true, event, "Event created successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});




export const updateEvents = asynchandler(async (req, res) => {
  try {
    const {
      Event_title,
      Description,
      eventdate,
      Time,
      location,
      Category,
      Price,
      Organizer,
      
    } = req.body || {};

       const { eventId } = req.query;
    if (!eventId) {
      throw new ApiError(400, "Event ID is required");
    }
    

    const event = await Event.findById(eventId).populate({path:"Category"});
    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    // 2. Handle file upload (if any)
    if (req.file?.path) {
      const fileUrl = await uploadOnCloudinery(req.file.path);

      if (!fileUrl || !fileUrl.secure_url) {
        throw new ApiError(500, "Image upload failed");
      }

      event.image = fileUrl.secure_url;
    }

    // 3. Update only provided fields (optional chaining or fallback to old values)
    event.Event_title = Event_title ?? event.Event_title;
    event.Description = Description ?? event.Description;
    event.Date = eventdate ?? event.Date;
    event.Time = Time ?? event.Time;
    event.location = location ?? event.location;
    event.Category = Category ?? event.Category;
    event.Price = Price ?? event.Price;
    event.Organizer = Organizer ?? event.Organizer;

    await event.save();

    return res
      .status(200)
      .json(new ApiResponse(true, event, "Event updated successfully"));
  } catch (error) {
    console.error("Update Error:", error);
    throw new ApiError(500, error.message || "Server Error");
  }
});


export const deleteEvent = asynchandler(async (req, res) => {
  try {
    const {organizationId, eventId } = req.query;
    if (!eventId) {
      throw new ApiError(400, "eventId is required");
    }
    if(!organizationId){
      throw new ApiError(400,"organizationId is required")
    }

    const event = await Event.findByIdAndDelete({});
    if (!event) {
      throw new ApiError(400, "Event not found");
    }
    return res
      .status(201)
      .json(new ApiResponse(200, event, "Event deleted successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});



export const getEvents = asynchandler(async (req, res) => {
  try {
     
    const {organizationId} = req.query;

    const evets = await Event.find({createdBy:organizationId}).populate({ path: "Category" }).populate("attendee")
   
    return res
      .status(201)
      .json(new ApiResponse(201, evets, "Events fetched successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});



export const getEventById = asynchandler(async (req, res) => {
     try {
       const { eventId} = req.query;
       if(!eventId){
         throw new ApiError(400,"eventId is required")
       }
       const event = await Event.findById({_id:eventId}).populate({path:"Category"}).populate("organizer")
       if(!event){
         throw new ApiError(400,"Event not found")
       }
       return res.status(201).json(new ApiResponse(true,event,"Event found successfully"))
     } catch (error) {
       throw new ApiError(400, error.message)
     }
})



export const filterEvents = asynchandler(async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      throw new ApiError(400, "Category is required");
    }

    let query = {};

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Set query based on category
    if (category === "All Events") {
      query = {};
    } else if (category === "Today") {
      query = {
        createdAt: { $gte: todayStart, $lt: todayEnd },
      };
    } else if (category === "This Weekend") {
      query = {
        createdAt: { $gte: weekAgo },
      };
    } else if (category === "This Month") {
      query = {
        createdAt: { $gte: monthAgo },
      };
    }

    // Fetch events
    let events = await Event.find(query).populate("Category")

    // If it's a custom category like "Weddings", "Concerts", etc.
    if (
      category !== "All Events" &&
      category !== "Today" &&
      category !== "This Weekend" &&
      category !== "This Month"
    ) {
      events = events.filter(
        (event) =>
          event?.Category?.Category_name?.toLowerCase() === category.toLowerCase()
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(true, events, "Events filtered successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});


export const Registed_Attendees = asynchandler(async (req, res) => {
  try {
    const { eventId } = req.query;
    const user = req.user;

    // 🛡️ 1. Check if user is attendee
    if (user.role !== "attendee") {
      throw new ApiError(403, "Only attendees can register for events");
    }

    // 📥 2. Find user and event
    const existingUser = await User.findById(user._id);
    const event = await Event.findById(eventId);

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    // ✅ 3. Check if already registered
    const alreadyRegisteredInUser =
      existingUser.registered_attendees.includes(eventId);

    const alreadyInEventAttendees =
      event.attendee.includes(existingUser._id); // 👈 fix: use `event.attendee`

    if (alreadyRegisteredInUser || alreadyInEventAttendees) {
      throw new ApiError(400, "You have already registered for this event");
    }

    // 🛠️ 4. Update Event: add user to attendee list
    await Event.findByIdAndUpdate(
      event._id,
      { $push: { attendee: existingUser._id } },
      { new: true }
    );

    // 🛠️ 5. Update User: add event to registered_attendees
    const updatedUser = await User.findByIdAndUpdate(
      existingUser._id,
      { $push: { registered_attendees: event._id } },
      { new: true }
    ).populate("registered_attendees");

    return res
      .status(201)
      .json(new ApiResponse(201, updatedUser, "Event Registration successful"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export const Remove_Registered_Event = asynchandler(async (req, res) => {
  try {
    const { eventId } = req.query;
    const user = req.user;

    // 1. Only attendees allowed
    if (user.role !== "attendee") {
      throw new ApiError(403, "Only attendees can unregister from events");
    }

    // 2. Check user & event exist
    const existingUser = await User.findById(user._id);
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    // 3. Check if user actually registered
    const isRegistered = existingUser.registered_attendees.includes(eventId);
    if (!isRegistered) {
      throw new ApiError(400, "You have not registered for this event");
    }

    // 4. Pull event from user's registered_attendees
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { registered_attendees: eventId } },
      { new: true }
    ).populate("registered_attendees");

    // 5. Pull user from event's attendee list
    await Event.findByIdAndUpdate(
      eventId,
      { $pull: { attendee: user._id } },
      { new: true }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        updatedUser,
        "Event registration removed successfully"
      )
    );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});


export const updateEventStatus = asynchandler(async (req, res) => {
  try {
    const { organizationId, eventId, eventstatus, Event_update_messege } = req.body;

    if (!eventId) {
      throw new ApiError(400, "eventId is required");
    }

    if (!organizationId) {
      throw new ApiError(400, "OrganizationId is required");
    }

   
    const foundEvent = await Event.findOne({ createdBy: organizationId, _id: eventId });
    if (!foundEvent) {
      throw new ApiError(404, "Event not found or you are not the organizer");
    }

    if ((eventstatus === "Delayed" || eventstatus === "Cancelled") && !Event_update_messege) {
      throw new ApiError(400, "Update message is required for delayed or cancelled events");
    }

    // Event update karo
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        eventstatus,
        ...(Event_update_messege && { Event_update_messege })
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, updatedEvent, "Event status updated successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

 export const getAllEventsWithoutAuth = asynchandler(async (req, res) => {
     try {
         const events = await Event.find({}).populate({path:"Category"}).populate("organizer") 
         if(!events){
           throw new ApiError(400,"Events not found")
         }
         return res.status(201).json(new ApiResponse(200,events,"Events found successfully"))
     } catch (error) {
         throw new ApiError(400, error.message)
     }
})



