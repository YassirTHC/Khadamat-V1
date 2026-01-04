-- CreateEnum
CREATE TYPE "CommunicationChannel" AS ENUM ('WHATSAPP', 'SMS');

-- CreateTable
CREATE TABLE "CommunicationEvent" (
    "id" TEXT NOT NULL,
    "channel" "CommunicationChannel" NOT NULL,
    "proId" TEXT NOT NULL,
    "clientId" TEXT,
    "bookingId" TEXT,
    "message" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunicationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunicationEvent_proId_idx" ON "CommunicationEvent"("proId");

-- CreateIndex
CREATE INDEX "CommunicationEvent_clientId_idx" ON "CommunicationEvent"("clientId");

-- CreateIndex
CREATE INDEX "CommunicationEvent_bookingId_idx" ON "CommunicationEvent"("bookingId");

-- CreateIndex
CREATE INDEX "CommunicationEvent_createdAt_idx" ON "CommunicationEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "CommunicationEvent" ADD CONSTRAINT "CommunicationEvent_proId_fkey" FOREIGN KEY ("proId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunicationEvent" ADD CONSTRAINT "CommunicationEvent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunicationEvent" ADD CONSTRAINT "CommunicationEvent_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
