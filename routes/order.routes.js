import express from "express";
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus,
  cancelOrder 
} from "../controllers/orders.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/create", createOrder);
router.get("/", isAdmin ,getOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", isAdmin, updateOrderStatus);
router.put("/:id/cancel", cancelOrder);

export default router;
