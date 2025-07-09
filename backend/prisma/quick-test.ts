
import { prisma } from "../utils/prisma";
(async () => {
  const d = await prisma.donation.create({
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
