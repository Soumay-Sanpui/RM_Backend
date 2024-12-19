import { Router } from "express";
import { getAllDishes, getDishById, createDish, getDishByCategory, getDishes } from "../controllers/dish.controller.js";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/get-dishes", getDishes);
router.get("/get-all-dishes", authMiddleware, isAdmin, getAllDishes);
router.post("/add-dish", authMiddleware, isAdmin,createDish);

router.get("/:id", authMiddleware, getDishById);
router.get("/get-dish-by-category/:category", authMiddleware, getDishByCategory);

export default router;