-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_donorId_fkey";

-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "paymentRef" TEXT,
ADD COLUMN     "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "specialMessage" DROP NOT NULL,
ALTER COLUMN "socialURLOrBuyMeACoffee" DROP NOT NULL,
ALTER COLUMN "donorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
