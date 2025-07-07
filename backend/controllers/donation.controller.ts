import type { RequestHandler } from "express";
import { prisma } from "../utils/prisma";
import { subDays } from "date-fns";

export const getEarnings: RequestHandler = async (req, res) => {
  const userId = Number(req.params.userId);
  const days = Number(req.query.days ?? 30);

  if (isNaN(userId)) {
    res.status(400).json({ message: "Invalid userId" });
    return;
  }

  const since = subDays(new Date(), days);
  const { _sum } = await prisma.donation.aggregate({
    _sum: { amount: true },
    where: {
      recipientId: userId,
      createdAt: { gte: since },
    },
  });

  res.json({ earnings: _sum.amount ?? 0 });
};

export const getRecentDonations: RequestHandler = async (req, res) => {
  const userId = Number(req.params.userId);
  const limit = Number(req.query.limit ?? 10);

  if (isNaN(userId)) {
    res.status(400).json({ message: "Invalid userId" });
    return;
  }

  const donations = await prisma.donation.findMany({
    where: { recipientId: userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      donor: {
        select: {
          username: true,
          profile: {
            select: { avatarImage: true },
          },
        },
      },
    },
  });
};
