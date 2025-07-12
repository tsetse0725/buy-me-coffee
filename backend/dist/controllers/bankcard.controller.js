"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBankCard = exports.getBankCard = exports.createOrUpdateBankCard = void 0;
const prisma_1 = require("../utils/prisma");
/* ────────────── Helper functions ────────────── */
function isValidUserId(id) {
    const num = Number(id);
    return isNaN(num) ? null : num;
}
function maskCardNumber(cardNumber) {
    return /^\d{16}$/.test(cardNumber)
        ? cardNumber.replace(/\d{12}(\d{4})/, "****-****-****-$1")
        : cardNumber;
}
/* ────────────── POST /bankcards – upsert card ────────────── */
const createOrUpdateBankCard = async (req, res, next) => {
    try {
        const { userId, country, firstName, lastName, cardNumber, expiryMonth, expiryYear, } = req.body;
        const uid = isValidUserId(userId);
        if (!uid) {
            res.status(400).json({ message: "Invalid userId" });
            return;
        }
        if (!country ||
            !firstName ||
            !lastName ||
            !cardNumber ||
            !expiryMonth ||
            !expiryYear) {
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
        if (isNaN(month) ||
            isNaN(year) ||
            month < 1 ||
            month > 12 ||
            year < currentYear) {
            res.status(400).json({ message: "Invalid expiry date" });
            return;
        }
        const expiryDate = new Date(year, month - 1, 1);
        await prisma_1.prisma.bankCard.upsert({
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
    }
    catch (err) {
        next(err);
    }
};
exports.createOrUpdateBankCard = createOrUpdateBankCard;
/* ────────────── GET /bankcards/:userId ────────────── */
const getBankCard = async (req, res, next) => {
    try {
        const uid = isValidUserId(req.params.userId);
        if (!uid) {
            res.status(400).json({ message: "Invalid userId" });
            return;
        }
        const card = await prisma_1.prisma.bankCard.findUnique({
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
        res.json({
            ...card,
            cardNumber: maskCardNumber(card.cardNumber),
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getBankCard = getBankCard;
/* ────────────── DELETE /bankcards/:userId ────────────── */
const deleteBankCard = async (req, res, next) => {
    try {
        const uid = isValidUserId(req.params.userId);
        if (!uid) {
            res.status(400).json({ message: "Invalid userId" });
            return;
        }
        const exists = await prisma_1.prisma.bankCard.findUnique({
            where: { userId: uid },
        });
        if (!exists) {
            res.status(404).json({ message: "Card not found" });
            return;
        }
        await prisma_1.prisma.bankCard.delete({ where: { userId: uid } });
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
};
exports.deleteBankCard = deleteBankCard;
//# sourceMappingURL=bankcard.controller.js.map