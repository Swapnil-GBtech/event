import { Router } from "express";
import { isAuth } from "../middleware/Auth.middleware.js";
 import { Createorder,getAdminPayments,getAllPayments,getEventWiseRevenue,getMonthlyRevenue,getRevenue,getTopEventStats,verifyPayment } from "../controller/razorpay.controller.js";
const router = Router();

router.post("/create-order", isAuth, Createorder);
router.post("/verify-payment", verifyPayment);
router.get('/get-revenue',isAuth,getRevenue)
 router.get('/get-top-status',isAuth,getTopEventStats)
 router.get('/get-monthly-revenue',isAuth,getMonthlyRevenue)
 router.get('/get-event-revenue',isAuth,getEventWiseRevenue)
 router.get('/get-all-payments',isAuth,getAllPayments)
 router.get('/get-admin-payments',isAuth,getAdminPayments)

export default router;
