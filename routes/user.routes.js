import {Router} from "express";
import { getUserInfo } from "../controllers/user.controller.js";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/:userId", getUserInfo);
router.get("/allUsers",isAdmin, getAllUsers);

export default router;