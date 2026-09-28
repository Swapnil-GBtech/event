import {Router} from "express";
import {isAuth} from "../middleware/Auth.middleware.js";
import {upload} from "../middleware/Multer.middleware.js";
import { createEvent,updateEvents,getEvents,deleteEvent, getEventById, filterEvents, Registed_Attendees, Remove_Registered_Event, updateEventStatus,getAllEventsWithoutAuth } from "../controller/Event.controller.js";
 const router = Router();

 router.post("/create-event", isAuth, upload.single("file"),createEvent)
 router.put("/update-event",isAuth,upload.single("file"),updateEvents)
 router.delete("/delete-event",isAuth,deleteEvent)
 router.get("/get-events",getEvents)
 router.get("/get-event-byid",getEventById)
 router.get("/filter-events",filterEvents)
 router.get("/add-register-event",isAuth,Registed_Attendees)
 router.get('/remove-register-event',isAuth,Remove_Registered_Event)

 router.put('/update-event-status',isAuth,updateEventStatus)

 router.get('/get-allevents-without-auth',getAllEventsWithoutAuth)

 export default router
  