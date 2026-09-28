

import ApiError from "../utils/ApiError/ApiError.js";
import { asynchandler } from "../utils/AsyncHandler/AsyncHandler.js";
 import { AssignEvent } from "../models/AssignEvent.model.js";
import ApiResponse from "../utils/ApiResponse/ApiResponse.js";
import { Event } from "../models/Event.model.js";

 

export const assignEvent = asynchandler(async (req, res) => {
  try {
    const { eventId, organizationId, userId } = req.body;

    if (!eventId) throw new ApiError(400, "eventId is required");
    if (!userId) throw new ApiError(400, "userId is required");
    if (!organizationId) throw new ApiError(400, "organizationId is required");

     const event = await Event.findOne({createdBy:organizationId, _id:eventId});

     if(!event){
      throw new ApiError(400,"Event not found")
     }

    const existAssignEvent = await AssignEvent.findOne({
      organizationId,
      userId,
      eventIds: { $in: [eventId] }
    });
    let updatedDoc;
    if (existAssignEvent) {
      updatedDoc = await AssignEvent.findOneAndUpdate(
        { organizationId, userId },
        { $pull: { eventIds: eventId } },
        { new: true }
      ).populate("eventIds").populate("organizationId").populate("userId");  // ✅ populate here

      return res.status(200).json(
        new ApiResponse(200, updatedDoc, "Event unassigned successfully")
      );
    } else {
      updatedDoc = await AssignEvent.findOneAndUpdate(
        { organizationId, userId },
        { $addToSet: { eventIds: eventId } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
        
      // ✅ populate here also
      const populatedDoc = await AssignEvent.findById(updatedDoc._id).populate("eventIds").populate("organizationId").populate("userId");
            event.organizer = userId
            await event.save()
      return res.status(200).json(
        new ApiResponse(200, populatedDoc, "Event assigned successfully")
      );
    }
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});




export const getAssignEvents = asynchandler(async (req, res) => {
  try {
     const {organizationId,userId} = req.query;
     if(!organizationId){
       throw new ApiError(400,"organizationId is required")
     }
     const event = await AssignEvent.find({organizationId,userId}).populate("eventIds").populate("organizationId").populate("userId");
     if(!event){
       throw new ApiError(400,"Event not found")
     }
     return res.status(201).json(new ApiResponse(200,event,"Event found successfully"))
  } catch (error) {
    throw new ApiError(400, error.message)
  }
})

