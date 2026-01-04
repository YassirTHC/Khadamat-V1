# QA / Tests rapides

## Environnements
- API : http://localhost:4000 (NestJS, Postgres)
- Front : http://localhost:3000 (Next.js via proxy /api→4000)
- .env.test : `postgresql://admin:password123@localhost:5432/khadamat_db_test?schema=public`
- Seeds : client `jean.client@test.com/password123`, pros `pro.pending@test.com`, `pro.verified@test.com`, `pro.quote@test.com` (tous `password123`).

## Commandes clés (evidence)

### Build Next (sanity)
```bash
cd khadamat-frontend
npm run build
```

### Jest contrat Booking
```powershell
$env:DATABASE_URL="postgresql://admin:password123@localhost:5432/khadamat_db_test?schema=public"
$env:NODE_ENV="test"
$env:ENABLE_BOOKING_CRON="false"
npx jest --config ./test/jest-e2e.json --testPathPatterns bookings.contract.e2e-spec.ts --runInBand
```

### Playwright Booking MVP Gate
```bash
cd khadamat-frontend
npx playwright test tests/e2e/booking-mvp-gate.spec.ts --project=chromium --reporter=dot --workers=1
```

### Playwright Auth smoke
Prérequis : API 4000, Front 3000, seed client.
```bash
cd khadamat-frontend
npx playwright test tests/e2e/auth-smoke.spec.ts --project=chromium --reporter=dot --workers=1
```

### Jest contrat Pro Visibility
```powershell
$env:DATABASE_URL="postgresql://admin:password123@localhost:5432/khadamat_db_test?schema=public"
$env:NODE_ENV="test"
npx jest --config ./test/jest-e2e.json --testPathPatterns pro-visibility.contract.e2e-spec.ts --runInBand
```

### Playwright Pro Visibility
Prérequis : pros seeds pending/verified.
```bash
cd khadamat-frontend
npx playwright test tests/e2e/pro-visibility.spec.ts --project=chromium --reporter=dot --workers=1
```

### Jest contrat Communication (WhatsApp trace)
```powershell
$env:DATABASE_URL="postgresql://admin:password123@localhost:5432/khadamat_db_test?schema=public"
$env:NODE_ENV="test"
npx jest --config ./test/jest-e2e.json --testPathPatterns communication-events.contract.e2e-spec.ts --runInBand --forceExit
```

### Playwright Communication (WhatsApp deep link + trace)
Reporter `list` pour éviter EPIPE.
```bash
cd khadamat-frontend
npx playwright test tests/e2e/communications.spec.ts --project=chromium --reporter=list --workers=1
```
### Playwright Communication - CTA historique client
```bash
cd khadamat-frontend
npx playwright test tests/e2e/client-history-whatsapp.spec.ts --project=chromium --reporter=dot --workers=1
```

### Jest contrat Services pricing (FIXED/QUOTE)
```powershell
$env:DATABASE_URL="postgresql://admin:password123@localhost:5432/khadamat_db_test?schema=public"
$env:NODE_ENV="test"
npx jest --config ./test/jest-e2e.json --testPathPatterns services-pricing.contract.e2e-spec.ts --runInBand
```

### Playwright Services QUOTE
Prérequis : pro.quote@test.com seed (service QUOTE).
```bash
cd khadamat-frontend
npx playwright test tests/e2e/services-quote.spec.ts --project=chromium --reporter=dot --workers=1
```

### Playwright Services vs Pros routing
```bash
cd khadamat-frontend
npx playwright test tests/e2e/services-and-pros-routing.spec.ts --project=chromium --reporter=dot --workers=1
```

## QA Runbook - Incidents (manuel MVP)
- No-show PRO : booking ACCEPTED, forcer timeSlot passé, annulation admin + incident + alternatives.
- No-show CLIENT : booking ACCEPTED, signalement client absent, vérifier compteur + sanctions.
- QUOTE dérive : créer booking QUOTE, simuler conflit prix >50 %, vérifier escalade + warning pro.

## QA - Auth (Client/Pro)
- Signup client/pro OK, login/logout, cookies HttpOnly, accès rôle (client ne voit pas dashboard pro).
- Refresh/lockout : brute force limité, refresh sans storm.

## Release checklist (résumé)
- Migrations appliquées (dev/test) + seeds OK.
- ENABLE_BOOKING_CRON=false en test, env vars FRONT_URL/API_URL alignées.
- Jest contrats : booking, pro visibility, services pricing, communication.
- Playwright : auth-smoke, booking-mvp-gate, pro-visibility, communications, services-quote.
- Sentry/monitoring à activer (Observabilité batch suivant).
