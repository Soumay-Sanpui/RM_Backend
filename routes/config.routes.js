import express from 'express';
import {
  getConfig,
  updateTodaySpecial,
  updateHomeBanner,
  updateFeaturedDishes,
  updateAnnouncementBar
} from '../controllers/config.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public route to get configuration
router.get('/', getConfig);

// Protected routes for admin only
router.use(authMiddleware, isAdmin);

router.put('/today-special', updateTodaySpecial);
router.put('/home-banner', updateHomeBanner);
router.put('/featured-dishes', updateFeaturedDishes);
router.put('/announcement', updateAnnouncementBar);

export default router; 