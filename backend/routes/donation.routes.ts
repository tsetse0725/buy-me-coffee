import { Router } from "express";
import {
  getEarnings,
  getRecentDonations,
} from "../controllers/donation.controller";

const router = Router();

router.get("/earnings/:userId", getEarnings);
router.get("/recent/:userId",  getRecentDonations);

export default router;
