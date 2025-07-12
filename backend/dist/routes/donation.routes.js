"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const donation_controller_1 = require("../controllers/donation.controller");
const router = (0, express_1.Router)();
router.post("/", donation_controller_1.createDonation);
router.post("/webhook/qpay", donation_controller_1.qpayWebhook);
router.get("/stream/:donationId", donation_controller_1.streamDonationStatus);
router.get("/earnings/:userId", donation_controller_1.getEarnings);
router.get("/recent/:userId", donation_controller_1.getRecentDonations);
router.get("/:id", donation_controller_1.getDonationById);
router.patch("/:id/mark-paid", donation_controller_1.markDonationPaid);
exports.default = router;
//# sourceMappingURL=donation.routes.js.map