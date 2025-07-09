import { Request, Response, RequestHandler } from "express";
import { prisma } from "../utils/prisma";
import { DonationStatus } from "@prisma/client";
import { subDays } from "date-fns";

export const createDonation: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const {
    amount,
    specialMessage,
    socialURLOrBuyMeACoffee,
    recipientId,
    donorId,
  } = req.body;

  if (typeof amount !== "number" || amount <= 0 || !recipientId) {
    res
      .status(400)
      .json({ message: "amount (number) and recipientId required" });
    return;
  }

  const donation = await prisma.donation.create({
    data: {
      amount,
      specialMessage,
      socialURLOrBuyMeACoffee,
      recipientId: Number(recipientId),
      donorId: donorId ? Number(donorId) : undefined,
      status: DonationStatus.PENDING,
      provider: "QPAY",
    },
  });

  const paymentUrl = `http://localhost:8000/mockpay/${donation.id}`;
  await prisma.donation.update({
    where: { id: donation.id },
    data: { paymentRef: paymentUrl },
  });

  setTimeout(async () => {
    try {
      await prisma.donation.update({
        where: { id: donation.id },
        data: { status: DonationStatus.PAID, paidAt: new Date() },
      });
      console.log(` Auto-paid donation #${donation.id}`);
    } catch (err) {
      console.error("Auto-pay error:", err);
    }
  }, 5_000);

  res.status(201).json({ ...donation, paymentUrl });
  return;
};

export const qpayWebhook: RequestHandler = async (req, res): Promise<void> => {
  const { invoiceId, paid } = req.body;

  if (!paid || isNaN(invoiceId)) {
    res.status(400).json({ message: "Invalid payload" });
    return;
  }

  await prisma.donation.update({
    where: { id: Number(invoiceId) },
    data: { status: DonationStatus.PAID, paidAt: new Date() },
  });

  console.log("✓ Mock webhook → Donation paid:", invoiceId);
  res.sendStatus(200);
  return;
};

export const streamDonationStatus: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const donationId = Number(req.params.donationId);
  if (isNaN(donationId)) {
    res.status(400).json({ message: "Invalid donation ID" });
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin":
      process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  });

  const interval = setInterval(async () => {
    try {
      const donation = await prisma.donation.findUnique({
        where: { id: donationId },
        select: { status: true },
      });
      if (donation?.status === "PAID") {
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({ status: "PAID" })}\n\n`);
        }
        clearInterval(interval);
        res.end();
      }
    } catch (err) {
      console.error("SSE error:", err);
      clearInterval(interval);
      res.end();
    }
  }, 3000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
};

export const getEarnings: RequestHandler = async (req, res): Promise<void> => {
  const userId = Number(req.params.userId);
  if (isNaN(userId)) {
    res.status(400).json({ message: "Invalid userId" });
    return;
  }

  let days = Number(req.query.days ?? 30);
  if (isNaN(days) || days < 1) days = 30;
  if (days > 365) days = 365;

  const since = subDays(new Date(), days);

  const { _sum } = await prisma.donation.aggregate({
    _sum: { amount: true },
    where: {
      recipientId: userId,
      status: DonationStatus.PAID,
      createdAt: { gte: since },
    },
  });

  res.json({ earnings: _sum?.amount ?? 0, since });
  return;
};

export const getRecentDonations: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const userId = Number(req.params.userId);
  if (isNaN(userId)) {
    res.status(400).json({ message: "Invalid userId" });
    return;
  }

  let limit = Number(req.query.limit ?? 10);
  if (isNaN(limit) || limit < 1) limit = 10;
  if (limit > 100) limit = 100;

  const donations = await prisma.donation.findMany({
    where: { recipientId: userId, status: DonationStatus.PAID },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      donor: {
        select: { username: true, profile: { select: { avatarImage: true } } },
      },
    },
  });

  res.json({ donations });
  return;
};

export const getDonationById: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const donation = await prisma.donation.findUnique({
    where: { id },
    include: {
      donor: {
        select: {
          username: true,
          profile: { select: { avatarImage: true } },
        },
      },
    },
  });

  if (!donation) {
    res.status(404).json({ message: "Donation not found" });
    return;
  }

  res.json(donation);
  return;
};

export const markDonationPaid: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  const updated = await prisma.donation.update({
    where: { id },
    data: { status: DonationStatus.PAID, paidAt: new Date() },
  });

  res.json(updated);
  return;
};
