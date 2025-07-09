
import { Router } from "express";
import {
  createOrUpdateBankCard,
  getBankCard,
  deleteBankCard,
} from "../controllers/bankcard.controller";

const router = Router();

/* 🟡 POST – create/update card */
router.post("/", createOrUpdateBankCard);

/* 🟢 GET – зөвхөн тоон userId */
router.get("/:userId", getBankCard);

/* 🔴 DELETE – зөвхөн тоон userId */
router.delete("/:userId", deleteBankCard);

export default router;
