-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('FIXED', 'QUOTE');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "pricingType" "PricingType" NOT NULL DEFAULT 'FIXED';

-- AlterTable
ALTER TABLE "ProService" ADD COLUMN     "pricingType" "PricingType" NOT NULL DEFAULT 'FIXED',
ALTER COLUMN "basePrice" DROP NOT NULL;
