"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
(async () => {
    const d = await prisma_1.prisma.donation.create({
        data: {
            amount: 5,
            recipientId: 1,
            provider: "QPAY",
            paymentRef: "mock://qr/123",
        },
    });
    console.log(d);
    process.exit(0);
})();
//# sourceMappingURL=quick-test.js.map