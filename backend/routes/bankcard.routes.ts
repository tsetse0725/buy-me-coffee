import { Router } from "express";
import {
  createOrUpdateBankCard,
  getBankCard,
  deleteBankCard,
} from "../controllers/bankcard.controller";

const router = Router();

router.post("/", createOrUpdateBankCard);
router.get("/:userId", getBankCard);
router.delete("/:userId", deleteBankCard);

export default router;
