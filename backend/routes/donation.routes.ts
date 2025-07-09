/* src/routes/donation.routes.ts */
import { Router } from "express";
import {
  createDonation,
  getEarnings,
  getRecentDonations,
  getDonationById,
  markDonationPaid,
  qpayWebhook,
  streamDonationStatus,
} from "../controllers/donation.controller";

const router = Router();

/* 1. Create */
router.post("/", createDonation);

/* 2. Webhook + SSE BEFORE “:id” routes */
router.post("/webhook/qpay", qpayWebhook);
router.get("/stream/:donationId", streamDonationStatus); // ← 🟢

/* 3. Stats */
router.get("/earnings/:userId", getEarnings);
router.get("/recent/:userId",  getRecentDonations);

/* 4. Single donation + manual mark-paid */
router.get("/:id",              getDonationById);
router.patch("/:id/mark-paid",  markDonationPaid);

export default router;
