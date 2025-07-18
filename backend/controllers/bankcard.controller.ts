import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";

function isValidUserId(id: string | number): number | null {
  const num = Number(id);
  return isNaN(num) || num <= 0 ? null : num;
}

function maskCardNumber(cardNumber: string): string {
  return /^\d{16}$/.test(cardNumber)
    ? cardNumber.replace(/\d{12}(\d{4})/, "****-****-****-$1")
    : cardNumber;
}


export const createOrUpdateBankCard = async (
  req: Request,
  res: Response,
  next: NextFunction
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

    const uid = isValidUserId(userId);
    if (!uid) {
      res.status(400).json({ message: "Invalid userId" });
      return;
    }

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

    if (!/^\d{16}$/.test(cardNumber)) {
      res.status(400).json({ message: "Card number must be 16 digits" });
      return;
    }

    const month = Number(expiryMonth);
    const year = Number(expiryYear);
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

    res.status(200).json({ message: "Bank card saved" });
  } catch (err) {
    next(err);
  }
};


export const getBankCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const uid = isValidUserId(req.params.userId);
    if (!uid) {
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

    const date = card.expiryDate ? new Date(card.expiryDate) : null;
    const expiryMonth = date ? (date.getMonth() + 1).toString() : "";
    const expiryYear = date ? date.getFullYear().toString() : "";

    res.json({
      id: card.id,
      country: card.country,
      firstName: card.firstName,
      lastName: card.lastName,
      cardNumber: maskCardNumber(card.cardNumber),
      expiryMonth,
      expiryYear,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};


export const deleteBankCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const uid = isValidUserId(req.params.userId);
    if (!uid) {
      res.status(400).json({ message: "Invalid userId" });
      return;
    }

    const exists = await prisma.bankCard.findUnique({
      where: { userId: uid },
    });

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
