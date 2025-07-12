"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markDonationPaid = exports.getDonationById = exports.getRecentDonations = exports.getEarnings = exports.streamDonationStatus = exports.qpayWebhook = exports.createDonation = void 0;
const prisma_1 = require("../utils/prisma");
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const createDonation = async (req, res) => {
    const { amount, specialMessage, socialURLOrBuyMeACoffee, recipientId, donorId, } = req.body;
    if (typeof amount !== "number" || amount <= 0 || !recipientId) {
        res
            .status(400)
            .json({ message: "amount (number) and recipientId required" });
        return;
    }
    const donation = await prisma_1.prisma.donation.create({
        data: {
            amount,
            specialMessage,
            socialURLOrBuyMeACoffee,
            recipientId: Number(recipientId),
            donorId: donorId ? Number(donorId) : undefined,
            status: client_1.DonationStatus.PENDING,
            provider: "QPAY",
        },
    });
    const paymentUrl = `http://localhost:8000/mockpay/${donation.id}`;
    await prisma_1.prisma.donation.update({
        where: { id: donation.id },
        data: { paymentRef: paymentUrl },
    });
    setTimeout(async () => {
        try {
            await prisma_1.prisma.donation.update({
                where: { id: donation.id },
                data: { status: client_1.DonationStatus.PAID, paidAt: new Date() },
            });
            console.log(` Auto-paid donation #${donation.id}`);
        }
        catch (err) {
            console.error("Auto-pay error:", err);
        }
    }, 5000);
    res.status(201).json({ ...donation, paymentUrl });
    return;
};
exports.createDonation = createDonation;
const qpayWebhook = async (req, res) => {
    const { invoiceId, paid } = req.body;
    if (!paid || isNaN(invoiceId)) {
        res.status(400).json({ message: "Invalid payload" });
        return;
    }
    await prisma_1.prisma.donation.update({
        where: { id: Number(invoiceId) },
        data: { status: client_1.DonationStatus.PAID, paidAt: new Date() },
    });
    console.log("✓ Mock webhook → Donation paid:", invoiceId);
    res.sendStatus(200);
    return;
};
exports.qpayWebhook = qpayWebhook;
const streamDonationStatus = async (req, res) => {
    const donationId = Number(req.params.donationId);
    if (isNaN(donationId)) {
        res.status(400).json({ message: "Invalid donation ID" });
        return;
    }
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    });
    const interval = setInterval(async () => {
        try {
            const donation = await prisma_1.prisma.donation.findUnique({
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
        }
        catch (err) {
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
exports.streamDonationStatus = streamDonationStatus;
const getEarnings = async (req, res) => {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
        res.status(400).json({ message: "Invalid userId" });
        return;
    }
    let days = Number(req.query.days ?? 30);
    if (isNaN(days) || days < 1)
        days = 30;
    if (days > 365)
        days = 365;
    const since = (0, date_fns_1.subDays)(new Date(), days);
    const { _sum } = await prisma_1.prisma.donation.aggregate({
        _sum: { amount: true },
        where: {
            recipientId: userId,
            status: client_1.DonationStatus.PAID,
            createdAt: { gte: since },
        },
    });
    res.json({ earnings: _sum?.amount ?? 0, since });
    return;
};
exports.getEarnings = getEarnings;
const getRecentDonations = async (req, res) => {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
        res.status(400).json({ message: "Invalid userId" });
        return;
    }
    let limit = Number(req.query.limit ?? 10);
    if (isNaN(limit) || limit < 1)
        limit = 10;
    if (limit > 100)
        limit = 100;
    const donations = await prisma_1.prisma.donation.findMany({
        where: { recipientId: userId, status: client_1.DonationStatus.PAID },
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
exports.getRecentDonations = getRecentDonations;
const getDonationById = async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ message: "Invalid id" });
        return;
    }
    const donation = await prisma_1.prisma.donation.findUnique({
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
exports.getDonationById = getDonationById;
const markDonationPaid = async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ message: "Invalid id" });
        return;
    }
    const updated = await prisma_1.prisma.donation.update({
        where: { id },
        data: { status: client_1.DonationStatus.PAID, paidAt: new Date() },
    });
    res.json(updated);
    return;
};
exports.markDonationPaid = markDonationPaid;
//# sourceMappingURL=donation.controller.js.map