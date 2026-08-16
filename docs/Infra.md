# Cabbo V1 Infrastructure Plan

This is the chosen infrastructure plan for Cabbo V1.

The goal is to launch safely without letting baseline infra cost eat the project before there is traction. Cabbo should have clean dev/prod separation, managed database safety, simple frontend hosting, and a migration path to heavier infrastructure later.

## Chosen V1 Stack

| Component | Provider | Domain |
| --- | --- | --- |
| Customer frontend dev | Render Static Site | `https://app.dev.cabbo.co.in` |
| Customer frontend prod | Render Static Site | `https://app.cabbo.co.in` |
| Admin frontend prod | Render Static Site or equivalent static host | `https://admin.cabbo.co.in` |
| Backend dev | Railway | `https://api.dev.cabbo.co.in` |
| Backend prod | Railway | `https://api.cabbo.co.in` |
| MySQL dev | Aiven Managed MySQL | private/dev connection details |
| MySQL prod | DigitalOcean Managed MySQL | private/prod connection details |
| Profile pictures | AWS S3 | existing bucket/integration |
| DNS/TLS | Cloudflare | `cabbo.co.in` zone |

## Decision

Use:

- Render Static Site for the customer frontend.
- Railway for dev and prod backend containers.
- Aiven Managed MySQL for the dev database.
- DigitalOcean Managed MySQL for the prod database.
- AWS S3 only for user-uploaded profile pictures.
- Cloudflare DNS for domain routing and TLS.

Do not use Railway for the database in V1.

This split is a good V1 balance: Render keeps frontend hosting simple, Railway keeps backend deployment easy, Aiven gives the dev database a low-friction managed home, and DigitalOcean gives production MySQL a more traditional managed database setup.

## Why This Setup

### Render Static Sites For Frontends

The customer app is a Vite/static frontend build, so Render Static Site hosting is enough for V1.

Benefits:

- Static hosting is enough for V1.
- Custom domains are supported.
- TLS is handled by the platform.
- Build/deploy flow is simple.
- SPA rewrites can route deep links back to `index.html`.

Customer frontend deploy targets:

- customer dev
- customer prod

The dev customer frontend is already deployed on Render at `https://app.dev.cabbo.co.in`.

Admin frontend hosting can use Render Static Site or an equivalent static host when the admin MVP is created.

### Railway For Backend

Railway is a good V1 backend host because the FastAPI backend can stay containerized and deployment remains light.

Benefits:

- Simple container deploys.
- Separate dev and prod backend services.
- Environment variables per service.
- Custom domains for `api.dev.cabbo.co.in` and `api.cabbo.co.in`.
- Easy logs during early development.
- Lower operational burden than running a VPS manually.

Railway should run only the app containers for V1, not MySQL.

### Managed MySQL For Database

The database is Cabbo's most important infra component. Bookings, payments, users, trip data, cancellations, and admin actions all live there.

Cabbo uses managed MySQL instead of an app-hosting platform database:

- Dev: Aiven Managed MySQL.
- Prod: DigitalOcean Managed MySQL.

DigitalOcean Managed MySQL is the chosen production database home because it gives a clearer managed database model than an app-hosting platform database while staying far cheaper than a fuller AWS RDS-style setup. Aiven is used for dev because it provides a convenient managed MySQL environment for the current dev deployment.

Benefits:

- Managed MySQL.
- Predictable monthly pricing.
- Easier backup/restore posture than self-hosting.
- Cleaner separation from Railway app services.
- Good migration path later if Cabbo outgrows the first tier.

## Environment Layout

### Dev

- Customer frontend: `https://app.dev.cabbo.co.in`
- Backend: `https://api.dev.cabbo.co.in`
- Database: Aiven Managed MySQL dev database/cluster
- Sentry environment: `dev`
- Razorpay: test mode
- SMS/WhatsApp: provider test/dev setup if available
- Email: dev-safe sender/domain configuration

Dev should use real infrastructure but test-mode integrations wherever money or external customer messaging is involved.

### Prod

- Customer frontend: `https://app.cabbo.co.in`
- Admin frontend: `https://admin.cabbo.co.in`
- Backend: `https://api.cabbo.co.in`
- Database: DigitalOcean Managed MySQL prod database/cluster
- Sentry environment: `prod`
- Razorpay: live mode after controlled verification
- SMS/WhatsApp: live provider setup
- Email: production sender/domain configuration

Prod must never share database credentials, secrets, or mutable state with dev.

## Database Plan

Preferred:

- One Aiven Managed MySQL instance/cluster for dev.
- One separate DigitalOcean Managed MySQL instance/cluster for prod.

If the monthly budget is too tight at the very beginning:

- Use the smallest managed MySQL tier for prod.
- Use a cheaper temporary dev database only if absolutely necessary.
- Do not compromise on prod backups and restore testing.

Before public launch:

- Enable automated backups for prod.
- Run one manual backup/export before every migration.
- Test a restore at least once.
- Keep dev and prod credentials separate.
- Keep database access restricted to the backend and required admin/deployment IPs.
- Do not expose MySQL publicly without tight allowlisting.
- If Railway static outbound IPs are available before production, add only those backend outbound IPs to the production database allowlist.
- Dev database allowlisting can remain flexible while dev uses strong credentials, TLS, and least-privilege users.

## Backend Deployment Rules

Railway dev and prod must be separate services/environments.

Each environment should have its own:

- `DATABASE_URL`
- auth/session secrets
- Razorpay credentials
- Sentry DSN/environment
- SMS/WhatsApp provider credentials
- email provider credentials
- allowed CORS origins
- app base URLs

Backend logs in dev/prod should stream to stdout/stderr. Do not create local log files inside the container for dev/prod.

## Frontend Deployment Rules

Render Static Site should build the customer frontend from the correct branch/environment.

Customer dev:

- domain: `app.dev.cabbo.co.in`
- API base URL: `https://api.dev.cabbo.co.in`
- SPA rewrite: `/* -> /index.html`

Customer prod:

- domain: `app.cabbo.co.in`
- API base URL: `https://api.cabbo.co.in`
- SPA rewrite: `/* -> /index.html`

Admin prod:

- domain: `admin.cabbo.co.in`
- API base URL: `https://api.cabbo.co.in`

No admin dev frontend is planned for V1. Admin hosting can use Render Static Site or an equivalent static frontend host when the admin MVP is created.

## Configuration Seed Rule

Pricing and policy configuration is not managed through admin CRUD in V1.

For dev and prod V1:

1. Set up database schema.
2. Run migration/seed scripts for Cabbo configuration.
3. Verify pricing, region/state, package, platform fee, permit fee, night pricing, and cancellation policy data.
4. Start the backend container.

The following admin configuration endpoints are deferred until traction:

- airport pricing by cab type, fuel type, and region
- local pricing by cab type, fuel type, and region
- outstation pricing by cab type, fuel type, and state
- fixed platform fee by country
- night pricing by region or state
- permit fee by cab type, fuel type, and state
- local trip package config by `region_id`
- trip common pricing by `trip_type_id` and region/state
- cancellation policy by `region_id` and trip type ID
- cancellation policy by `state_id` and trip type ID

## Security And Networking Checklist

- [ ] Cloudflare DNS owns `cabbo.co.in`.
- [x] `app.dev.cabbo.co.in` points to Render Static Site customer dev.
- [ ] `app.cabbo.co.in` points to Render Static Site customer prod.
- [ ] `admin.cabbo.co.in` points to Render Static Site or the selected admin static host.
- [ ] `api.dev.cabbo.co.in` points to Railway backend dev.
- [ ] `api.cabbo.co.in` points to Railway backend prod.
- [x] Railway dev CORS allows only dev frontend origin.
- [ ] Railway prod CORS allows only prod customer/admin origins.
- [x] Aiven dev MySQL uses strong credentials, TLS, least-privilege users, and restrictive allowlisting where the dev setup allows.
- [ ] DigitalOcean prod MySQL accepts connections only from required backend/deployment sources.
- [x] Dev and prod secrets are different.
- [ ] Sentry redaction is enabled before prod.
- [x] Database backups are enabled before prod.
- [x] Restore test is completed before prod.

## Expected Cost Shape

This setup will likely sit above the absolute cheapest possible setup, but below a fuller AWS managed setup.

Cost drivers:

- Render Static Site hosting should remain low-cost for the V1 frontend use case.
- Railway backend cost depends on runtime resource usage.
- DigitalOcean Managed MySQL prod is the main fixed monthly infra cost.
- Aiven Managed MySQL dev depends on the selected dev tier/trial/plan.
- AWS S3 profile picture cost should remain tiny at early scale.

The expected V1 starting cost is roughly:

- Render Static Site: low-cost/free-tier depending on plan limits
- Railway backend dev/prod: usage-based, with low baseline if services stay small
- Aiven MySQL dev: dev-tier/trial/plan dependent
- DigitalOcean MySQL prod: the biggest predictable line item
- AWS S3: very low at early profile-picture volume

If cost pressure appears, reduce dev database spend first. Do not weaken prod database safety first.

## Not Chosen

### Full AWS For V1

Not chosen because ECS/App Runner plus RDS plus load balancing/logging can push baseline monthly cost beyond the desired early-stage budget.

AWS remains a later migration option once usage justifies it.

### Cloudflare Pages For Current Customer Frontend

Not currently used for the customer frontend because the dev deployment is already working on Render Static Site with custom domain, TLS, and SPA rewrite support.

Cloudflare Pages remains a viable future static hosting option if there is a specific reason to move.

### Railway Database

Not chosen for V1 because the database deserves a more dedicated managed database provider from the beginning.

Railway remains the backend app host.

### Single VPS For Everything

Not chosen because Cabbo is a booking/payment product. A single VPS with app and MySQL would be cheaper, but the backup, restore, patching, monitoring, and single-point-of-failure tradeoffs are not worth it for V1.

## Migration Path Later

When Cabbo has traction:

1. Upgrade DigitalOcean MySQL prod tier if CPU, memory, storage, or connections require it.
2. Add read replicas only when real metrics justify it.
3. Move backend from Railway to AWS App Runner/ECS/Fargate or DigitalOcean App Platform/Kubernetes only if operational needs justify it.
4. Keep Render Static Site for frontends unless there is a specific reason to move.
5. Add admin configuration management endpoints after operational usage proves the need.

## Pricing References Checked

- Render Static Sites: static hosting supports custom domains and redirect/rewrite rules for SPA deep links. See `https://render.com/docs/static-sites`.
- Railway: Hobby lists USD 5 minimum usage, included monthly usage credits, custom domains, global regions, and per-resource usage pricing. See `https://railway.com/pricing`.
- Aiven MySQL: managed MySQL used for dev. See `https://aiven.io/mysql`.
- DigitalOcean Managed Databases: Managed MySQL starts at the low managed tier around USD 15/month for 1 GiB memory, 1 vCPU, and 10-30 GiB storage range. See `https://www.digitalocean.com/pricing/managed-databases`.
