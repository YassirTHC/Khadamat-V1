/*
  Warnings:

  - You are about to drop the column `scheduledDate` on the `Booking` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Booking_scheduledDate_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "scheduledDate";
