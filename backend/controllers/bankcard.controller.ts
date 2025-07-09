/* src/controllers/bankcard.controller.ts */
import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";

/* ─────────── Request body type ─────────── */
interface BankCardBody {
  userId: string | number;
  country: string;
  firstName: string;
  lastName: string;
  cardNumber: string;   // 16-орон, зөвхөн тоо гэж үзлээ
  expiryMonth: string | number; // 1–12
  expiryYear: string | number;  // >= 2025 (жишээ)
}

/* ────────────────────────────────────────────────────────────── */
/* 1. POST /bankcards/ – create or update bank card              */
/* ────────────────────────────────────────────────────────────── */
export const createOrUpdateBankCard = async (
  req: Request<{}, any, BankCardBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      userId,
      country,
      firstName,
      lastName,
      cardNumber,
      expiryMonth,
      expiryYear,
    } = req.body;

    /* 1) userId – тоо эсэх */
    const uid = Number(userId);
    if (isNaN(uid)) {
      res.status(400).json({ message: "Invalid userId" });
      return;
    }

    /* 2) Заавал бөглөгдөх талбарууд */
    if (
      !country ||
      !firstName ||
      !lastName ||
      !cardNumber ||
      !expiryMonth ||
      !expiryYear
    ) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    /* 3) Card number – 16 орон, зөвхөн цифр */
    if (!/^\d{16}$/.test(cardNumber)) {
      res.status(400).json({ message: "Card number must be 16 digits" });
      return;
    }

    /* 4) Expiry month/year – тоо, сар 1-12, жил (>= одоогийн жил) */
    const month = Number(expiryMonth);
    const year  = Number(expiryYear);
    const currentYear = new Date().getFullYear();

    if (
      isNaN(month) ||
      isNaN(year) ||
      month < 1 ||
      month > 12 ||
      year < currentYear
    ) {
      res.status(400).json({ message: "Invalid expiry date" });
      return;
    }

    const expiryDate = new Date(year, month - 1, 1);

    /* 5) Upsert bank card */
    await prisma.bankCard.upsert({
      where: { userId: uid },
      create: {
        country,
        firstName,
        lastName,
        cardNumber,
        expiryDate,
        userId: uid,
      },
      update: {
        country,
        firstName,
        lastName,
        cardNumber,
        expiryDate,
      },
    });

    res.status(201).json({ message: "Bank card saved" });
  } catch (err) {
    next(err);
  }
};

/* ────────────────────────────────────────────────────────────── */
/* 2. GET /bankcards/:userId – fetch bank card info              */
/* ────────────────────────────────────────────────────────────── */
export const getBankCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const uid = Number(req.params.userId);
    if (isNaN(uid)) {
      res.status(400).json({ message: "Invalid userId" });
      return;
    }

    const card = await prisma.bankCard.findUnique({
      where: { userId: uid },
      select: {
        id: true,
        country: true,
        firstName: true,
        lastName: true,
        cardNumber: true,
        expiryDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!card) {
      res.status(404).json({ message: "Card not found" });
      return;
    }

    /* Маск хийх — сүүлийн 4 орон үлдээнэ */
    const maskedNumber = card.cardNumber.replace(/\d{12}(\d{4})/, "****-****-****-$1");

    res.json({ ...card, cardNumber: maskedNumber });
  } catch (err) {
    next(err);
  }
};

/* ────────────────────────────────────────────────────────────── */
/* 3. DELETE /bankcards/:userId – delete bank card               */
/* ────────────────────────────────────────────────────────────── */
export const deleteBankCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const uid = Number(req.params.userId);
    if (isNaN(uid)) {
      res.status(400).json({ message: "Invalid userId" });
      return;
    }

    /* Эхлээд карт байгааг шалгана */
    const exists = await prisma.bankCard.findUnique({ where: { userId: uid } });
    if (!exists) {
      res.status(404).json({ message: "Card not found" });
      return;
    }

    await prisma.bankCard.delete({ where: { userId: uid } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
