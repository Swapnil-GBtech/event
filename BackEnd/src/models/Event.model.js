import mongoose, { Schema } from "mongoose";
const EventSchema = new Schema(
  {
    Event_title: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Date: {
      type: Date,
      required: true,
    },
    Time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    Category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    Price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "postpond"],
      default: "active",
    },
    eventstatus: {
      type: String,
      enum: ["Upcoming", "Delayed", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    Event_update_messege: {
      type: String,
      required: function () {
        return (
          this.eventstatus === "Delayed" || this.eventstatus === "Cancelled"
        );
      },
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
    image: {
      type: String,
      required: true,
    },
    attendee: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", EventSchema);
