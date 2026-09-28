import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
})
import ApiResponse from "../utils/ApiResponse/ApiResponse.js";
import ApiError from "../utils/ApiError/ApiError.js";
import { asynchandler } from "../utils/AsyncHandler/AsyncHandler.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import {Payment} from "../models/Payment.model.js";
import mongoose from "mongoose";


// Razorpay instance

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

 
export const Createorder = asynchandler(async (req, res) => {
  try {
    const { amount, currency = "INR", ordername, username, organizationId,role } = req.body;
    //  Validation
    if (!amount) throw new ApiError(400, "Amount is required");
    if (!ordername) throw new ApiError(400, "Order name is required");
    if (!username) throw new ApiError(400, "Username is required");
    if (!organizationId) throw new ApiError(400, "Organization ID is required");
    if(!role) throw new ApiError(400, "Role is required")

    //  Razorpay Order Create (amount converted to paise)
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency,
      receipt: `order_rcpt_${Date.now()}`,
      notes: { ordername, username, organizationId },
    };

    const order = await instance.orders.create(options);
    //  Convert Razorpay's paise amount back to INR for response
    const formattedOrder = {
      ...order,
      amount: order.amount , //  Convert paise to INR
      amount_due: order.amount_due,
      amount_paid: order.amount_paid,
      ordername,
      username,
      organizationId,
      role
    };

    return res.status(200).json(
      new ApiResponse(200, formattedOrder, "Order created successfully")
    );
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to create order");
  }
});


 export const verifyPayment = asynchandler(async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
      username,
      ordername,
      organizationId,
      role
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new ApiError(400, "All payment verification fields are required");
    }

    //  Generate expected signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    //  Determine status dynamically
    const isValidSignature = generatedSignature === razorpay_signature;
    const status = isValidSignature ? "paid" : "failed";

    //  Generate month name dynamically
    const monthName = new Date().toLocaleString("default", { month: "long" });

    //  Save payment in DB
    const paymentData = await Payment.create({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount: amount,
      currency,
      username,
      ordername,
      organizationId,
      status,
      monthName,  
      role 
    });

    if (isValidSignature) {
      return res.status(200).json(
        new ApiResponse(200, paymentData, "Payment verified & saved successfully")
      );
    } else {
      return res.status(400).json(
        new ApiResponse(400, paymentData, "Payment verification failed, saved as failed")
      );
    }
  } catch (error) {
    throw new ApiError(400, error?.message || "Payment verification failed");
  }
});


 
export const getRevenue = asynchandler(async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      throw new ApiError(400, "OrganizationId is required");
    }

    const total_revenue = await Payment.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          status: "paid", // Sirf paid status wale filter karenge
        },
      },
      {
        $addFields: {
          superAdminCommission: { $multiply: ["$amount", 0.02] }, // Har document ka 2% nikal rahe hain
          adminRevenue: { $subtract: ["$amount", { $multiply: ["$amount", 0.02] }] } // Har document ka amount - 2%
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }, // Total revenue ka sum
          superAdminTotal: { $sum: "$superAdminCommission" }, // Super admin ka total commission
          adminTotal: { $sum: "$adminRevenue" }, // Admin ka total revenue (after 2% cut)
        },
      },
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalRevenue: total_revenue[0]?.totalAmount || 0,
          superAdminCommission: total_revenue[0]?.superAdminTotal || 0,
          adminRevenue: total_revenue[0]?.adminTotal || 0,
        },
        "Revenue, Super Admin Commission & Admin Revenue fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to get revenue");
  }
});



export const getTopEventStats = asynchandler(async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      throw new ApiError(400, "OrganizationId is required");
    }

    const eventStats = await Payment.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          status: "paid", // Sirf paid payments consider karenge
        },
      },
      {
        $addFields: {
          superAdminCommission: { $multiply: ["$amount", 0.02] }, // Har payment ka 2%
          adminRevenue: { $subtract: ["$amount", { $multiply: ["$amount", 0.02] }] }, // Amount - 2%
        },
      },
      {
        $group: {
          _id: "$ordername", // Event-wise group karenge
          totalAmount: { $sum: "$amount" }, // Event ka total revenue
          averagePrice: { $avg: "$amount" }, // Avg ticket price
          totalSuperAdmin: { $sum: "$superAdminCommission" }, // Super Admin commission ka sum
          totalAdmin: { $sum: "$adminRevenue" }, // Admin revenue ka sum
          usernames: { $push: "$username" }, // All usernames (repeat allowed)
          payments: { $push: "$$ROOT" } // Full payment docs
        },
      },
      {
        $sort: { totalAmount: -1 } // Highest revenue event first
      },
      {
        $limit: 1 // Sirf top event
      }
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        eventStats[0] || {},
        "Top event stats fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to fetch event stats");
  }
});



 export const getMonthlyRevenue = asynchandler(async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      throw new ApiError(400, "OrganizationId is required");
    }

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          status: "paid",
        },
      },
      {
        $addFields: {
          monthName: {
            $dateToString: { format: "%B", date: "$createdAt" }, // Extract month name (e.g., January, February)
          },
        },
      },
      {
        $group: {
          _id: "$monthName",
          totalRevenue: { $sum: "$amount" },
          averagePrice: { $avg: "$amount" },
          payments: {
            $push: {
              _id: "$_id",
              amount: "$amount",
              username: "$username",
              ordername: "$ordername",
              status: "$status",
              createdAt: "$createdAt",
            },
          },
        },
      },
      {
        $sort: { "_id": 1 }, // Sort by month name alphabetically (optional)
      },
    ]);

    // Convert array to object with month names as keys
    const revenueByMonth = {};
    monthlyRevenue.forEach((month) => {
      revenueByMonth[month._id] = month;
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        revenueByMonth,
        "Monthly revenue fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to get monthly revenue");
  }
});


export const getEventWiseRevenue = asynchandler(async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      throw new ApiError(400, "OrganizationId is required");
    }

    const eventRevenue = await Payment.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          status: "paid",
        },
      },
      {
        $group: {
          _id: "$ordername", // Event-wise group
          totalRevenue: { $sum: "$amount" }, // Total revenue for event
          averagePrice: { $avg: "$amount" }, // Average payment per event
          payments: {
            $push: {
              _id: "$_id",
              amount: "$amount",
              username: "$username",
              ordername: "$ordername",
              status: "$status",
              createdAt: "$createdAt",
            },
          },
        },
      },
      {
        $sort: { totalRevenue: -1 }, // Sort by highest revenue event
      },
    ]);

    // Format response as eventName: { details... }
    const formattedResponse = {};
    eventRevenue.forEach((event) => {
      formattedResponse[event._id] = {
        _id: event._id,
        totalRevenue: event.totalRevenue,
        averagePrice: event.averagePrice,
        payments: event.payments,
      };
    });

    return res.status(200).json(
      new ApiResponse(200, formattedResponse, "Event-wise revenue fetched successfully")
    );
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to fetch event-wise revenue");
  }
});


export const getAllPayments = asynchandler(async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      throw new ApiError(400, "OrganizationId is required");
    }

    const payments = await Payment.find({ organizationId });

    return res.status(200).json(
      new ApiResponse(200, payments, "All payments fetched successfully")
    );
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to fetch all payments");
  }
});

export const getAdminPayments = asynchandler(async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      throw new ApiError(400, "OrganizationId is required");
    }

    const payments = await Payment.find({ organizationId,role:"admin" });

    return res.status(200).json(
      new ApiResponse(200, payments, "All payments fetched successfully")
    );
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to fetch all payments");
  }
});



