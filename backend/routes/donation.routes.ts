import { Router } from "express";
import { getEarnings, getRecent } from "../controllers/donation.controller";

const router = Router();

router.get("/earnings/:userId", getEarnings);

router.get("/recent/:userId", getRecent);

export default router;
