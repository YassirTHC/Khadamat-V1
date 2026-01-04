# Khadamat - PRD (Source of Truth)

## 1. Vision & Objectifs (6–12 mois)
- Rendre la recherche + reservation d’artisans fiable, rapide, sure au Maroc.
- Cibles indicatives : 1k–3k pros actifs (≥40% verifies) sur 2–4 villes pilotes ; 5k–20k clients inscrits ; conversion visite→resa/contact 5–10% ; retention 90j 25–35% ; note ≥4.5/5 ; annulations <10–15%.

## 2. Utilisateurs, Marches, Cas d’usage
- Clients : particuliers urbains pressés.
- Pros : artisans independants + petites equipes (plomberie, elec, clim, serrurerie, menage, peinture, bricolage, jardinage).
- Villes pilotes : Rabat–Sale–Temara, Casablanca (puis Marrakech/Tanger).
- Cas d’usage : urgences (plomberie/elec/serrure), services reguliers (menage/jardinage), travaux (peinture/carrelage/clim).

## 3. Differenciation
- Pros verifies/badges, tri favorable premium.
- Parcours reservation (pas juste annuaire).
- Disponibilite visible + SLA reponse rapide.
- Support + litiges, qualite controlee.

## 4. Modele economique
- MVP : plans Free (sans quota) et Premium 149 MAD/mois (prix unique, toutes villes) : boost visibilite, badge premium, analytics leger, quotas illimites au lancement.
- Premium seulement si Verified.
- Post-MVP : commissions paiements online (8–15%) + eventuels frais service client ; acompte/escrow post-MVP.

## 5. Visibilite / Statuts Pro
- Statuts : Non verifie / Verifie / Premium (Premium reserve aux Verifies).
- Definition Active (visible/reservable) : compte non suspendu/non desactive ; profil minimum complet ; CGU acceptees ; telephone obligatoire (WhatsApp/SMS). Profil minimum : nom/prenom ou raison sociale, ville/zone, ≥1 categorie, ≥1 service publie (prix requis si FIXED), langue par defaut, tel. Optionnels : photo, bio ; documents requis pour Verified.
- Non Active : suspendu, desactive volontaire, profil incomplet, etc.
- Tri : Verified devant, Premium boost, Non verifie badge “Non verifie” + tri defavorable.

## 6. Offre & Catalogue
- Categories initiales : plomberie, electricite, clim, serrurerie, menage, peinture, bricolage, jardinage (pouvant inclure nettoyage).
- Filtres : ville/zone, categorie, note min, Verified/Premium, prix, dispo/delai.
- Types : one-shot (urgence/depanage), devis (travaux), services packs fixes (ex : menage 2h, depannage standard).

## 7. Booking Workflow (MVP)
- Statuts : REQUESTED, ACCEPTED, DECLINED, CANCELLED_BY_CLIENT, CANCELLED_BY_PRO, COMPLETED, EXPIRED.
- Transitions : REQUESTED → ACCEPTED | DECLINED | CANCELLED_BY_CLIENT | EXPIRED ; ACCEPTED → COMPLETED | CANCELLED_BY_CLIENT | CANCELLED_BY_PRO.
- Règles :
  - Pas de reservation dans le passe.
  - Slots fixes de 60 minutes base sur horaires/dispo pro (1 slot = 60 min au MVP).
  - Anti double-booking : le slot est bloque des ACCEPTED (first accepted wins), multiples REQUESTED possibles.
  - Expiration auto : REQUESTED → EXPIRED si pas de reponse pro sous 24h.
  - Annulation gratuite si >24h avant le slot (uniforme au MVP).
  - Logs actions (who/when/reason).
  - Contrat API : `proUserId` (userId du PRO, role=PRO) obligatoire ; l’alias `proId` est temporaire et sera déprécié ; une valeur invalide retourne 400/404 explicite.
- Paiement MVP : cash fin de prestation, sans acompte. Paiement online/escrow = post-MVP.

## 8. Tarification / Devis / Negotiation
- pricingType : FIXED ou QUOTE (champ obligatoire sur les services, copiA(c) sur le booking).
- FIXED : prix requis, sert de reference ; negotiation possible post mise en relation (WhatsApp) si besoin differe.
- QUOTE (devis leger) : client envoie description + localisation + delai + photos (opt) ; pro repond “prix estime” ou “visite necessaire”. Pas de paiement/escrow au MVP ; basePrice facultative.

## 9. Communication (MVP)
- Pas de chat in-app au MVP. CTA “Contacter” → WhatsApp/SMS (wa.me / sms:). Email secondaire.
- CTA WhatsApp : deep-link `https://wa.me/{phone}?text=...` (tel pro normalisé) + texte pré-rempli (pro/service/contexte booking si dispo).
- Trace interne minimale : event contact_initiated (channel=WHATSAPP/SMS, proUserId, clientId, bookingId?, horodatage, metadata) ; pas de stockage du contenu WhatsApp.
- CTA WhatsApp présent aussi dans l’historique client (/dashboard/client/history) par réservation (si numéro pro disponible).
- Post-MVP : chat in-app temps réel, traçabilité, réduction dépendance WhatsApp.
## 10. Confiance & Qualite
- Avis uniquement si booking = COMPLETED ; 1 avis/booking ; note + commentaire ; recalcul rating/totalReviews.
- Monitoring qualite : taux reponse, taux annulation, note <4.0 → monitoring ; admin peut suspendre.
- Option future : escrow/depot pour travaux ; assurance/garantie post-MVP.

## 11. Operations & Support
- Support MVP : WhatsApp + email, 9h–20h ; scripts (annulation, retard, litiges) ; escalade admin.

## 12. Légal & Conformité (MVP Safe)

### 12.1 Données & confidentialité (cadre opérationnel)
- Données collectées  
  - Clients : nom/prénom, téléphone, email, ville, historique bookings, avis  
  - Pros : identité, téléphone/email, ville, catégories/services, (Verified : pièces justificatives)  
  - Technique : logs sécurité, IP si nécessaire, events analytics
- Finalités : fourniture du service (booking/contact), sécurité (anti-fraude, logs login), amélioration produit (analytics agrégés)
- Conservation (MVP)  
  - Compte : tant que le compte existe + suppression sur demande  
  - Booking : conservation opérationnelle (ex. 24 mois) puis anonymisation  
  - Logs sécurité : durée courte (ex. 3–6 mois)
- Droits utilisateurs : accès / rectification / suppression via support (email/WhatsApp), délai cible 7 jours ; suppression = anonymiser avis/booking si requis

### 12.2 CGU & acceptation
- CGU Client : acceptation obligatoire à la création de compte  
- CGU Pro : acceptation obligatoire + clause Premium  
- Politique de confidentialité : accessible footer + au signup  
- Versioning : numéro de version + date + historique des changements

### 12.X Conformité CNDP (Loi 09-08) — Statut
Statut actuel : [À REMPLIR]
- [ ] Déclaration CNDP déposée (date: ____ )
- [ ] Numéro déclaration: ____ 
- [ ] Responsable traitement: ____ 

### 12.Y Rôle de la plateforme (disclaimer MVP)
Khadamat est une plateforme de mise en relation (marketplace).  
Le contrat de prestation est entre le client et le professionnel.  
Khadamat facilite la mise en relation et le suivi booking.

Disclaimer visible (page booking + footer) :
“En réservant, vous contractez directement avec le professionnel. Khadamat facilite la mise en relation.”

### 12.Z Propriété intellectuelle (contenus)
- Avis/photos déposés par users : licence non-exclusive pour affichage et marketing (anonymisable)
- Signalement/retrait possible (hors nécessité légale)
- Marque “Khadamat” : statut [OMPIC: déposée / en cours / à faire]

### 12.3 Facturation (MVP - Premium)
- Premium : 149 MAD/mois (prix affiché clairement)  
- Facture/justificatif : émis au paiement (ou reçu) — à valider comptable  
- TVA / régime : à cadrer avec expert-comptable (non bloquant produit)

## 13. KPIs & Perf
- KPIs : conversion visite→resa/contact ; fill rate ; temps réponse pro médian (<30 min urgences cible) ; taux annulation (<10–15%) ; note moyenne (≥4.5) + volume avis ; NPS/CSAT.
- Perf/UX : listing <2s, filtres <1s (local env), pas de crash erreurs API, pas de refresh storm, multi-tab logout synchro.

## 14. Roadmap (rappel)
- M0–M1 : Booking manuel PRD, annuaire+filtres, fiches pros, avis, notifications SMS/WhatsApp, admin vérif basique, statuts booking + expiration 24h.
- M2–M3 : Planning/dispo amélioré, badges Verified/Premium, support scripts, monitoring qualité, quotas premium (non limités au lancement), gating Active.
- M4–M6 : Paiement online pilote + escrow optionnel, messagerie temps réel, devis enrichi, analytics pro, anti-fraude light.
- M6+ : App mobile, assurance/garanties, scoring avancé.

## 15. Incidents & "Litiges" (MVP) — sans assurance / sans remboursement

### Objectif
Avoir un process clair quand un booking se passe mal (no-show, retard, comportement, bug) pour proteger la reputation des le MVP.

**Scope MVP**
- Support + scripts + sanctions + escalade admin
- Annulations administratives si necessaire
- Propositions d'alternatives (autres pros)
- Pas de remboursement / compensation financiere (post-MVP)
- Pas d'assurance / indemnisation (post-MVP)

### 15.1 Types d'incidents (MVP) + SLA
| Incident | Gravite | SLA reponse | Owner |
|---|---:|---:|---|
| No-show PRO (pro ne vient pas) | Critique | < 1h | Support + Admin |
| No-show CLIENT | Haute | < 4h | Support |
| Retard PRO (>30 min) | Haute | < 2h | Support |
| Travail non conforme / incomplet | Moyenne | < 24h | Support + Admin |
| Desaccord prix (QUOTE) | Moyenne | < 24h | Support |
| Comportement inapproprie / danger | Critique | < 1h | Admin |
| Incident technique (409 slot, 5xx) | Moyenne | Auto + < 4h | Support + Tech |

### 15.2 Declaration d'incident (MVP)
- Qui : client ou PRO
- Canaux : bouton "Signaler un probleme" sur la resa ; WhatsApp / email support (template)
- Champs requis : bookingId, type, description (50–500 car.), preuves optionnelles (3 photos max)
- Fenetre : pendant le RDV jusqu'a 48h apres ; au-dela = escalade admin

### 15.3 Scripts Support (MVP)
**A) No-show PRO (booking ACCEPTED, heure passee)**  
1) Verifier bookingId + statut + timeSlot  
2) Contacter PRO (tel/WhatsApp) : "Client attend, booking #XXX"  
3) Si PRO repond : retard <60 min → prevenir client + noter incident ; ne peut pas venir → annuler (admin) + proposer alternatives  
4) Si PRO ne repond pas apres 30 min : annuler (admin) ; incident PRO +1 ; proposer 2–3 alternatives au client  
5) Cloture : tag incident + note interne  
Sanctions PRO : 1er incident = avertissement ; 2e (30j) = suspension 7j ; 3e (90j) = ban.

**B) No-show CLIENT**  
1) PRO signale "client absent" (booking ACCEPTED)  
2) Support contacte client  
3) Si client repond : reprogrammer si pro OK, sinon annuler  
4) Si pas de reponse 1h : incident CLIENT +1, annulation  
5) Sanctions CLIENT : 1er avertissement ; 2e (30j) = blocage booking 7j ; 3e (90j) = ban

**C) Travail non conforme / incomplet (sans remboursement)**  
1) Demander "attendu vs recu" + preuves (photos)  
2) Contacter PRO pour sa version  
3) Mediation : accord amiable (pro refait/complete sous 48–72h recommande)  
4) Admin : avertissement / suspension si repetition ; note interne qualite (impact visibilite)

**D) Desaccord prix (QUOTE)**  
- Rappel : QUOTE = prix indicatif ; variation acceptable ±30% justifiee ; variation >50% = incident legitime  
- Collecter explication PRO + elements  
- Mediation : clarifier scope/justification  
- Admin : avertissement si abus recurrent

### 15.4 Escalade Admin (MVP)
- Obligatoire si danger/harcelement/fraude, incident non resolu >7j, repetition (2+ incidents/30j)
- Actions : suspension 24h–30j, ban, annulation bookings futurs si risque

### 15.5 KPIs incidents (MVP)
- Taux incidents <5% des bookings ACCEPTED/COMPLETED
- Temps median resolution <48h
- Recidive <10% (users avec 2+ incidents/30j)

### 15.6 Outils support (MVP)
- Sheet/Notion/Linear : 1 ticket = 1 incident
- Templates WhatsApp/email
- Checklist no-show prete a utiliser

## Comptes, Authentification & Sessions (MVP)

### Objectif
Assurer un accès sécurisé et cohérent pour 3 rôles : CLIENT, PRO, ADMIN, avec des règles claires de session, de permissions et d’anti-abus.

### Parcours d’inscription (MVP)
#### Client
- Champs requis : email, mot de passe, prénom/nom (ou prénom), ville (optionnel), acceptation CGU + Privacy.
- Email : vérification recommandée (MVP peut la rendre optionnelle), mais acceptation CGU/Privacy obligatoire.

#### Professionnel (PRO)
- Champs requis : email, mot de passe, téléphone (vérifié), prénom/nom ou raison sociale, ville principale, catégories (1–5), acceptation CGU + Privacy.
- Le PRO peut être créé en statut Non-Verified, mais téléphone vérifié requis pour être “Active”.

### Connexion / Déconnexion (MVP)
- Login : email + mot de passe (ou “identifier”).
- Logout : invalider la session côté backend (refresh token) + purge côté front.
- Erreurs attendues : 401 identifiants invalides ; 429 rate limit/brute force ; 403 compte désactivé/suspendu.

### Sessions & Tokens (contrat)
- Access token : courte durée, utilisé pour les appels API.
- Refresh token : rotation / invalidation côté serveur.
- Front : ne pas stocker le refresh token (cookie HttpOnly ou mécanisme backend).

### Mot de passe & sécurité (MVP)
- Policy minimale : 8+ caractères, au moins 1 lettre + 1 chiffre (ou plus strict si souhaité).
- Protection brute force : rate limit login, lockout après X échecs (déjà implémenté côté backend).
- Réinitialisation mot de passe : MVP recommandé (email). Si non implémenté au lancement → mention explicite dans la roadmap.

## Rôles & Permissions (contrat)

### Rôles
- CLIENT : recherche, booking, annulation, avis.
- PRO : gestion des demandes, accept/decline, complète les missions, visibilité profil.
- ADMIN : modération/pro verification (MVP peut être manuel/outside tool).

### Table “Action → Qui → Conditions”
| Action | Rôle | Conditions |
|---|---|---|
| Créer booking | CLIENT | proUserId valide (role=PRO), slot futur, payload conforme |
| Accepter booking | PRO | booking REQUESTED, pro owner du booking, slot non locké |
| Refuser booking | PRO | booking REQUESTED, pro owner |
| Annuler booking | CLIENT | REQUESTED ou ACCEPTED (règles produit), libère slot si nécessaire |
| Marquer COMPLETED | PRO | booking ACCEPTED seulement |
| Laisser un avis | CLIENT | booking COMPLETED, 1 avis / booking |
| Voir dashboard PRO | PRO | authentifié, profil “Active” recommandé |
| Voir PRO dans listing | public | dépend de règles Active/Verified/Premium |

## Contrats d’IDs & Référentiels (anti-ambiguïtés)

### Règle d’or
- Booking.proId = userId du PRO (proUserId) ✅
- proProfileId ≠ proUserId (ne pas les confondre)

### Contrat CreateBooking (MVP)
- Champ officiel : `proUserId` (obligatoire)
- Alias temporaire : `proId` accepté avec warning (dépréciation planifiée)
- Si ID invalide (ex: proProfileId) → 400/404 “Invalid pro user id”

### Référentiels minimaux
- Ville (cityId) : obligatoire ou dérivable selon PRD.
- Catégorie (serviceCategoryId) : obligatoire.
- timeSlot : DateTime UTC, slot de 60 min, aligné (xx:00).

## Erreurs API & UX (MVP)

### Codes standard
- 400 : validation payload
- 401 : non authentifié
- 403 : non autorisé (rôle / ownership / statut)
- 404 : ressource introuvable
- 409 : conflit métier (slot déjà pris)
- 429 : rate limit

### Messages UX attendus
- 409 Slot already taken → “Créneau déjà réservé, choisis un autre créneau.”
- 400 Invalid pro user id → “Professionnel invalide (profil indisponible).”
- 400 Past slot → “Impossible de réserver dans le passé.”

## Environnements & Configuration (contrat MVP)

### Ports (option A recommandée)
- Front (Next dev) : 3000
- API (Nest) : 4000
- Proxy Next : `/api/*` → `http://localhost:4000/api/*`

### Services requis
- Postgres
- Redis (rate limiting / lockout / queues si activées)

### Flags
- `ENABLE_BOOKING_CRON=false` en test (pour éviter timers ouverts)
- (si besoin) `NEXT_PUBLIC_API_URL` ou proxy `/api`

## Anti-abus “MVP Safe”
- Rate limit global API (déjà présent)
- Rate limit login + lockout (déjà présent)
- (optionnel) Rate limit create booking par client (ex: 10 / jour)
- Logging des events critiques (login success/fail, booking transitions)

## 16. Onboarding & Vérification Pros

### 16.1 Statuts Pro
- Inactive : pas visible
- Active (non vérifié) : visible, peut recevoir bookings
- Verified : badge + boost confiance
- Premium : abonnement (Verified requis)

### 16.2 Conditions “Active” (minimum requis)
Pour apparaître dans /pros et être réservable :
- Téléphone vérifié
- Ville / zone d’intervention renseignée
- 1+ service publié (FIXED ou QUOTE)
- Bio (min 50 caractères)
- CGU Pro acceptées

### 16.3 Vérification (badge Verified) - MVP manuel
- Docs : CNIE + selfie (optionnel MVP : patente/registre)
- Process : upload docs (max 5MB/doc) → statut PENDING / APPROVED / REJECTED (avec motif) → délai cible 2–5 jours ouvrés

### 16.4 Premium (149 MAD/mois)
- Requis : Verified
- Activation immédiate si paiement OK ; auto-renouvellement si implémenté, sinon renouvellement manuel au MVP

## 17. Stratégie d’acquisition (MVP)

### 17.1 Phase pilote (M1–M3)
- Ville pilote : (choisir 1) ex. Rabat/Casa
- Objectif M1 : 50 pros / 300 clients
- Objectif M2 : +100 pros / +800 clients
- Objectif M3 : +150 pros / +1500 clients

### 17.2 Acquisition Pros (MVP)
- Démarchage terrain zones ciblées
- Facebook/Instagram Ads artisans
- Partenariats locaux (associations, groupes WhatsApp)

### 17.3 Acquisition Clients (MVP)
- SEO local : pages “catégorie × ville”
- Google Ads (requêtes urgence)
- Contenu avant/après + preuve sociale (avis)

### 17.4 KPIs d’acquisition
- CAC pro cible < 500 MAD ; CAC client cible < 50 MAD
- Conversion /pros → booking initiated → booking requested

## 18. Notifications (MVP)

### 18.1 Événements & canaux
Client :
- Booking created → Email
- Booking accepted/declined → Email/SMS
- Reminder → Email/SMS (J-1)
- Booking completed → Email “laisser un avis”

Pro :
- New booking request → SMS + lien dashboard
- Booking cancelled → SMS
- Reminder → SMS (H-2)

### 18.2 Anti-spam
- Max 3 SMS/jour par utilisateur (hors urgences)
- Rate limit par user

## 19. Gestion des risques (MVP)

### 19.1 Risques produit
- Qualité pro inégale → Verified + monitoring notes + règles “Active”
- Spam bookings → rate limiting + captcha (si nécessaire)
- Faible adoption pro → plan acquisition + onboarding simple

### 19.2 Risques techniques
- Erreurs prod → Sentry (front/back) + alertes 5xx
- Données → backups + logs sécurité

## 20. Analytics & Tracking (MVP)
- Objectifs : conversion, qualité, réactivité, succès booking, adoption Premium.
- Conventions d’events : `entity_action`, props standard (userId, role, sessionId, cityId, serviceCategoryId, proUserId, utm_*, device, locale), pas de contenu sensible.
- Events MVP (extraits) : landing_viewed, signup_started/completed, login_success, search_performed, pro_list_viewed, pro_profile_viewed, contact_cta_clicked, booking_modal_opened, booking_created/accepted/declined/cancelled/completed/expired/conflict_409, review_submitted.
- KPIs : view→booking, accept rate, completion rate, time-to-accept (median), review rate, conflict rate.
- Outils : GA4 + UTM, PostHog/Mixpanel si besoin, Sentry pour erreurs/releases.

## 21. SEO & Stratégie Contenu (MVP)
- Cibles : intentions locales “plombier rabat”, “électricien casablanca”.
- Pages prioritaires : landing catégories `/services?category=...`, landing ville×cat `/ville/categorie`, liste pros + texte SEO, fiche pro indexable si Active.
- Schema.org recommandé : LocalBusiness/ProfessionalService, Service, AggregateRating, BreadcrumbList.
- Règles contenu : titres uniques, meta orientée bénéfice+ville, H1 unique, noindex si pro inactif.
- Blog (optionnel) : 2–4 articles/mois courts (prix moyens, checklists, urgences…).
- Maillage : ville ↔ catégories, fiche pro ↔ catégorie/ville, blog ↔ service/ville.

## 22. Accessibilité & i18n (FR/AR/Darija)
- Langues : FR (défaut), AR, Darija (copywriting, peut réutiliser AR UI).
- RTL : layout/alignements/icônes, formats date/heure clairs.
- Baseline a11y (≈ WCAG 2.1 AA) : navigation clavier (recherche/filtres/booking/dash pro), focus visible, labels/aria-labels, contraste lisible, erreurs lisibles, aria-live sur toasts critiques recommandé.
- Copies adaptées (non-tech) : erreurs orientées action (“Créneau déjà pris. Choisis un autre horaire.”).
- QA i18n/a11y : 1 parcours complet FR puis AR, test clavier (modal booking), test RTL pages critiques.
