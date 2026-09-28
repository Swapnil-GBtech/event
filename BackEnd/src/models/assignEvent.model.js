import mongoose from "mongoose";

const assignEventSchema = new mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        eventIds:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        }],
    },
    { timestamps: true }
);

export const AssignEvent = mongoose.model("AssignEvent", assignEventSchema);