import express from "express";
import { assignEvent, getAssignEvents,  } from "../controller/AssignEvents.controller.js";
import { isAuth } from "../middleware/Auth.middleware.js";

const router = express();

router.post("/assign-event", isAuth, assignEvent);
router.get("/get-assign-event", isAuth, getAssignEvents);
export default router;
