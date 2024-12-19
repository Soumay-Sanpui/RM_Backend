import express from "express";
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/:userId", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeFromCart);
router.delete("/clear/:userId", clearCart);

export default router; 