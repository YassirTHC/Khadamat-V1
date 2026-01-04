"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bookings_service_1 = require("../src/modules/bookings/bookings.service");
async function main() {
    const prisma = new client_1.PrismaClient();
    const svc = new bookings_service_1.BookingsService(prisma);
    const client = await prisma.user.findFirst({
        where: { role: 'CLIENT' },
        select: { id: true },
    });
    const pro = await prisma.user.findFirst({
        where: { role: 'PRO' },
        select: { id: true },
    });
    const serviceCategory = await prisma.serviceCategory.findFirst({
        select: { id: true },
    });
    const city = await prisma.city.findFirst({ select: { id: true } });
    if (!client || !pro || !serviceCategory || !city) {
        throw new Error('Missing seed data');
    }
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    const past = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const results = [];
    const b1 = await svc.createBooking(client.id, {
        proId: pro.id,
        serviceCategoryId: serviceCategory.id,
        cityId: city.id,
        description: 'Test booking 1',
        timeSlot: future,
    });
    results.push({
        step: 'create_future',
        bookingId: b1.id,
        status: b1.status,
        expiresAt: b1.expiresAt,
    });
    const b2 = await svc.createBooking(client.id, {
        proId: pro.id,
        serviceCategoryId: serviceCategory.id,
        cityId: city.id,
        description: 'Test booking 2',
        timeSlot: future,
    });
    results.push({ step: 'create_future_2', bookingId: b2.id, status: b2.status });
    try {
        await svc.createBooking(client.id, {
            proId: pro.id,
            serviceCategoryId: serviceCategory.id,
            cityId: city.id,
            description: 'Past booking',
            timeSlot: past,
        });
        results.push({ step: 'create_past', ok: false });
    }
    catch (e) {
        results.push({ step: 'create_past', ok: true, error: e.message });
    }
    const acc1 = await svc.updateStatus(b1.id, 'ACCEPTED', pro.id, 'PRO');
    results.push({ step: 'accept_1', status: acc1.status });
    try {
        await svc.updateStatus(b2.id, 'ACCEPTED', pro.id, 'PRO');
        results.push({ step: 'accept_2_conflict', ok: false });
    }
    catch (e) {
        results.push({ step: 'accept_2_conflict', ok: true, error: e.message });
    }
    const cancel = await svc.updateStatus(b1.id, 'CANCELLED_BY_CLIENT', client.id, 'CLIENT');
    results.push({ step: 'cancel_1', status: cancel.status });
    const acc2 = await svc.updateStatus(b2.id, 'ACCEPTED', pro.id, 'PRO');
    results.push({ step: 'accept_2_after_cancel', status: acc2.status });
    const comp = await svc.updateStatus(b2.id, 'COMPLETED', pro.id, 'PRO');
    results.push({ step: 'complete_2', status: comp.status });
    console.log(JSON.stringify(results, null, 2));
    await prisma.$disconnect();
}
main().catch(async (e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=booking-smoke.js.map