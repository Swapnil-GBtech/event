import mongoose, { Schema, SchemaTypes } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit phone number!`,
      },
    },
    address: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "organizer", "attendee", "super Admin"],
      required: true,
    },
    organization: {
      type: String,
      required: function () {
        this.role === "admin";
      },
    },
    subscriptionType: {
      type: String,
      enum: ["Monthly", "Yearly", "demo"],
      required: function () {
        this.role === "admin";
      },
    },
    assignedEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
        
      },
    ],
    favorate_events: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    registered_attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    expiryDate: {
      type: Date,
      required: function () {
        this.role === "admin";
      },
    },

    status: {
      type: String,
      enum: ["Active", "inActive", "Expiry Soon", "Expired"],
      default: "Active",
      required: function () {
        this.role === "admin";
        this.role === "organizer";
        this.role === "attendee";
      },
    },

    monthName: {
      type: String,
      required: function () {
        this.role === "admin";
      },
    },

    dayremaining: {
      type: Number,
      required: function () {
        this.role === "admin";
      },
    },
    price: {
      type: Number,
      required: function () {
        this.role === "admin";
      },
    },

    accountStatus: {
      type: Boolean,
      enum: [true, false],
      default: false,
      required: function () {
        this.role === "admin";
      },
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.role === "organizer" || this.role === "attendee";
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
