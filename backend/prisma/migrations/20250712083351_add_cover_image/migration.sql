/*
  Warnings:

  - You are about to drop the column `backgroundImage` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "backgroundImage",
ADD COLUMN     "coverImage" TEXT;
