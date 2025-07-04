import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const getEarnings = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const days = Number(req.query.days ?? "30");

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const total = await prisma.donation.aggregate({
    _sum: { amount: true },
    where: { recipientId: userId, createdAt: { gte: fromDate } },
  });

  res.json({ earnings: total._sum.amount ?? 0 });
};

export const getRecent = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const limit = Number(req.query.limit ?? "10");

  const donations = await prisma.donation.findMany({
    where: { recipientId: userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      amount: true,
      specialMessage: true,
      socialURLOrBuyMeACoffee: true,
      donor: { select: { username: true } },
      createdAt: true,
    },
  });

  res.json(donations);
};
