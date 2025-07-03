import { Router } from "express";
import { getEarnings, getRecent } from "../controllers/donation.controller";

const router = Router();

/* GET /donations/earnings/:userId?days=30  */
router.get("/earnings/:userId", getEarnings);

/* GET /donations/recent/:userId?limit=10   */
router.get("/recent/:userId", getRecent);

export default router;
