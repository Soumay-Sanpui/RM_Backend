import { Router } from "express";
import { createPayment, paymentSuccess } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/createPayment", authMiddleware, createPayment)
router.get("/success", authMiddleware, paymentSuccess)

export default router;
