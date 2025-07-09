-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "provider" TEXT;

-- CreateIndex
CREATE INDEX "Donation_recipientId_idx" ON "Donation"("recipientId");

-- CreateIndex
CREATE INDEX "Donation_status_idx" ON "Donation"("status");
