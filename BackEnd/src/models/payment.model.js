 import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  orderId: String,             // razorpay_order_id
  paymentId: String,           // razorpay_payment_id
  signature: String,           // razorpay_signature
  amount: Number,
  currency: String,
  username: String,
  ordername: String,
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
  role:{
     type:String
  },
  status: { type: String, enum: ["pending", "paid", "failed"], default: "paid" },
  monthName: { type: String }, // New field for tracking income by month
}, { timestamps: true });

export const Payment = mongoose.model("Payment", PaymentSchema);
