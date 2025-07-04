import { RequestHandler } from "express";
import { prisma } from "../utils/prisma";
export const createOrUpdateBankCard: RequestHandler = async (
  req,
  res,
  next
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

    if (
      !userId ||
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

    const expiryDate = new Date(Number(expiryYear), Number(expiryMonth) - 1, 1);

    await prisma.bankCard.upsert({
      where: { userId: Number(userId) },
      create: {
        country,
        firstName,
        lastName,
        cardNumber,
        expiryDate,
        userId: Number(userId),
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

export const getBankCard: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const userId = Number(req.params.userId);

    const card = await prisma.bankCard.findUnique({
      where: { userId },
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

    const masked = card.cardNumber.replace(
      /\d{12}(\d{4})/,
      "****-****-****-$1"
    );
    res.json({ ...card, cardNumber: masked });
  } catch (err) {
    next(err);
  }
};

export const deleteBankCard: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const userId = Number(req.params.userId);
    await prisma.bankCard.delete({ where: { userId } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
