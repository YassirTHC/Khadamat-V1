# MVP GAP Analysis (PRD vs Reality)

Légende : ✅ conforme | ⚠️ partiel | ❌ manquant.

## Booking — ✅
- Statuts PRD : REQUESTED / ACCEPTED / DECLINED / CANCELLED_BY_CLIENT / CANCELLED_BY_PRO / COMPLETED / EXPIRED.
- Slots 60 min, pas de réservation passée, expiration 24h, anti double-booking (SlotLock), logs BookingEvent.
- Contrat ID : `proUserId` officiel ; `proId` alias legacy (warning). ID invalide → 400/404.
- Paiement cash fin prestation.
- Evidence : Jest `bookings.contract.e2e-spec.ts`, Playwright `booking-mvp-gate.spec.ts`.

## Pro Visibility — ✅
- Active éligible : téléphone vérifié + CGU acceptées + ville + bio ≥50 + ≥1 service actif.
- Verified = `verificationStatus=APPROVED`; Premium = Verified requis (guard backend) ; plan Premium 149 MAD seedé.
- Evidence : Jest `pro-visibility.contract.e2e-spec.ts`; Playwright `pro-visibility.spec.ts`.

## Services FIXED/QUOTE — ✅
- pricingType obligatoire sur service (FIXED prix requis, QUOTE prix facultatif “prix sur devis”), recopié sur Booking.
- Booking QUOTE autorisé sans prix fixe ; affichage badges FIXED/QUOTE dans l’UI.
- Seeds : `pro.quote@test.com/password123` (service QUOTE), `pro.verified@test.com/password123` (service FIXED).
- Evidence : Jest `services-pricing.contract.e2e-spec.ts`; Playwright `services-quote.spec.ts`.

## Communication — ✅
- CTA “Contacter” → wa.me avec contexte ; trace `/api/communication-events` (channel/proUserId/clientId/bookingId?).
- Evidence : Jest `communication-events.contract.e2e-spec.ts`; Playwright `communications.spec.ts` (reporter=list pour éviter EPIPE).

## Reviews — ✅
- Avis uniquement si booking COMPLETED ; 1 avis/booking ; recalcul rating OK (gating front/back).

## Auth & Sessions — ✅
- Login/Register/Refresh OK (cookies HttpOnly), brute-force/lockout en place.
- Evidence : Playwright `auth-smoke.spec.ts`.

## Observabilité / Perf — ⚠️
- Sentry front/back non branché ; perf budgets non mesurés. À couvrir en batch Observabilité.

## Foundations (implicites mais indispensables)

| Module | Statut | Notes |
|---|---|---|
| Auth / Sessions / Tokens | ✅ | login/refresh/logout OK, protections brute force OK |
| Rôles & Permissions | ✅ | permissions documentées + endpoints booking appliquées |
| Contrat d’IDs (proUserId) | ✅ | proUserId officiel + alias proId warning + invalid → 400/404 |
| Environnements & Flags | ✅ | ports 3000/4000 + proxy /api + ENABLE_BOOKING_CRON=false en test |
| Standards erreurs (400/401/403/409) | ✅ | 409 slot conflict, 400 validation, etc. |

## MVP Gate (bloquants release)

| Module | Statut | Evidence | Notes |
|---|---|---|---|
| Booking Engine | ✅ | `cd khadamat-frontend && npx playwright test tests/e2e/booking-mvp-gate.spec.ts --project=chromium --reporter=dot --workers=1` (1 passed) ; Jest `bookings.contract.e2e-spec.ts` | slots 60m, expiration 24h, 409 conflict |
| Incidents & Support (MVP sans remboursements) | ✅ | QA runbook incidents (manuel) | no-show/retard/quote dispute + sanctions |
| Auth & Sessions (Client/Pro) | ✅ | Prérequis : API http://localhost:4000 + Front http://localhost:3000 (proxy /api→4000), seed client `jean.client@test.com/password123`. Commande : `cd khadamat-frontend && npx playwright test tests/e2e/auth-smoke.spec.ts --project=chromium --reporter=dot --workers=1` (1 passed) | login → protected → reload → logout |
| Pro Visibility (Active/Verified/Premium) | ✅ | `npx jest --config ./test/jest-e2e.json --testPathPatterns pro-visibility.contract.e2e-spec.ts --runInBand` ; `cd khadamat-frontend && npx playwright test tests/e2e/pro-visibility.spec.ts --project=chromium --reporter=dot --workers=1` (2 passed) | Active = phone + CGU + ville + bio + service ; Premium = Verified only |
| Communication MVP (WhatsApp deep links + trace) | ✅ | `npx jest --config ./test/jest-e2e.json --testPathPatterns communication-events.contract.e2e-spec.ts --runInBand --forceExit` ; `cd khadamat-frontend && npx playwright test tests/e2e/communications.spec.ts --project=chromium --reporter=list --workers=1` (1 passed) ; `cd khadamat-frontend && npx playwright test tests/e2e/client-history-whatsapp.spec.ts --project=chromium --reporter=dot --workers=1` (1 passed) | WhatsApp wa.me + trace /communication-events + CTA présent en historique client |
| Services FIXED/QUOTE + devis léger | ✅ | `npx jest --config ./test/jest-e2e.json --testPathPatterns services-pricing.contract.e2e-spec.ts --runInBand` ; `cd khadamat-frontend && npx playwright test tests/e2e/services-quote.spec.ts --project=chromium --reporter=dot --workers=1` ; `cd khadamat-frontend && npx playwright test tests/e2e/services-and-pros-routing.spec.ts --project=chromium --reporter=dot --workers=1` | pricingType end-to-end, booking QUOTE OK, /services = catégories → /pros = pros |
| Observabilité + perf budgets | ⚠️ | À faire : Sentry front/back + perf budgets + pack smoke complet | planifié batch Observabilité |
