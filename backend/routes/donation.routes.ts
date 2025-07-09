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

router.post("/", createDonation);

router.post("/webhook/qpay", qpayWebhook);
router.get("/stream/:donationId", streamDonationStatus);

router.get("/earnings/:userId", getEarnings);
router.get("/recent/:userId", getRecentDonations);

router.get("/:id", getDonationById);
router.patch("/:id/mark-paid", markDonationPaid);

export default router;
