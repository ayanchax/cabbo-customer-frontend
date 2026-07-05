# Cabbo V1 Infrastructure Plan

This is the chosen infrastructure plan for Cabbo V1.

The goal is to launch safely without letting baseline infra cost eat the project before there is traction. Cabbo should have clean dev/prod separation, managed database safety, simple frontend hosting, and a migration path to heavier infrastructure later.

## Chosen V1 Stack

| Component | Provider | Domain |
| --- | --- | --- |
| Customer frontend dev | Cloudflare Pages | `https://app.dev.cabbo.co.in` |
| Customer frontend prod | Cloudflare Pages | `https://app.cabbo.co.in` |
| Admin frontend prod | Cloudflare Pages | `https://admin.cabbo.co.in` |
| Backend dev | Railway | `https://api.dev.cabbo.co.in` |
| Backend prod | Railway | `https://api.cabbo.co.in` |
| MySQL dev | DigitalOcean Managed MySQL | private/dev connection details |
| MySQL prod | DigitalOcean Managed MySQL | private/prod connection details |
| Profile pictures | AWS S3 | existing bucket/integration |
| DNS/TLS | Cloudflare | `cabbo.co.in` zone |

## Decision

Use:

- Cloudflare Pages for all static frontends.
- Railway for dev and prod backend containers.
- DigitalOcean Managed MySQL for dev and prod databases.
- AWS S3 only for user-uploaded profile pictures.
- Cloudflare DNS for domain routing and TLS.

Do not use Railway for the database in V1.

This split is a good V1 balance: Cloudflare keeps frontend hosting close to free, Railway keeps backend deployment easy, and DigitalOcean gives the database a more traditional managed home.

## Why This Setup

### Cloudflare Pages For Frontends

The customer and admin apps are Vite/static frontend builds, so Cloudflare Pages is the simplest fit.

Benefits:

- Free static hosting is enough for V1.
- Custom domains are supported.
- Preview deployments are useful for frontend QA.
- TLS and global edge delivery are handled.
- No server cost for admin frontend.

Cabbo needs three frontend deploy targets:

- customer dev
- customer prod
- admin prod

Cloudflare Pages can handle all three cleanly.

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

### DigitalOcean Managed MySQL For Database

The database is Cabbo's most important infra component. Bookings, payments, users, trip data, cancellations, and admin actions all live there.

DigitalOcean Managed MySQL is the chosen V1 database home because it gives a clearer managed database model than an app-hosting platform database while staying far cheaper than a fuller AWS RDS-style setup.

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
- Database: DigitalOcean Managed MySQL dev database/cluster
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

- One DigitalOcean Managed MySQL instance/cluster for dev.
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

Cloudflare Pages should build each frontend from the correct branch/environment.

Customer dev:

- domain: `app.dev.cabbo.co.in`
- API base URL: `https://api.dev.cabbo.co.in`

Customer prod:

- domain: `app.cabbo.co.in`
- API base URL: `https://api.cabbo.co.in`

Admin prod:

- domain: `admin.cabbo.co.in`
- API base URL: `https://api.cabbo.co.in`

No admin dev frontend is planned for V1.

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
- [ ] `app.dev.cabbo.co.in` points to Cloudflare Pages customer dev.
- [ ] `app.cabbo.co.in` points to Cloudflare Pages customer prod.
- [ ] `admin.cabbo.co.in` points to Cloudflare Pages admin prod.
- [ ] `api.dev.cabbo.co.in` points to Railway backend dev.
- [ ] `api.cabbo.co.in` points to Railway backend prod.
- [ ] Railway dev CORS allows only dev frontend origin.
- [ ] Railway prod CORS allows only prod customer/admin origins.
- [ ] DigitalOcean MySQL accepts connections only from required backend/deployment sources.
- [ ] Dev and prod secrets are different.
- [ ] Sentry redaction is enabled before prod.
- [ ] Database backups are enabled before prod.
- [ ] Restore test is completed before prod.

## Expected Cost Shape

This setup will likely sit above the absolute cheapest possible setup, but below a fuller AWS managed setup.

Cost drivers:

- Cloudflare Pages should be free for the V1 frontend use case.
- Railway backend cost depends on runtime resource usage.
- DigitalOcean Managed MySQL is the main fixed monthly infra cost.
- AWS S3 profile picture cost should remain tiny at early scale.

The expected V1 starting cost is roughly:

- Cloudflare Pages: USD 0
- Railway backend dev/prod: usage-based, with low baseline if services stay small
- DigitalOcean MySQL dev/prod: the biggest predictable line item
- AWS S3: very low at early profile-picture volume

If cost pressure appears, reduce dev database spend first. Do not weaken prod database safety first.

## Not Chosen

### Full AWS For V1

Not chosen because ECS/App Runner plus RDS plus load balancing/logging can push baseline monthly cost beyond the desired early-stage budget.

AWS remains a later migration option once usage justifies it.

### Railway Database

Not chosen for V1 because the database deserves a more dedicated managed database provider from the beginning.

Railway remains the backend app host.

### Single VPS For Everything

Not chosen because Cabbo is a booking/payment product. A single VPS with app and MySQL would be cheaper, but the backup, restore, patching, monitoring, and single-point-of-failure tradeoffs are not worth it for V1.

## Migration Path Later

When Cabbo has traction:

1. Upgrade DigitalOcean MySQL tier if CPU, memory, storage, or connections require it.
2. Add read replicas only when real metrics justify it.
3. Move backend from Railway to AWS App Runner/ECS/Fargate or DigitalOcean App Platform/Kubernetes only if operational needs justify it.
4. Keep Cloudflare Pages for frontends unless there is a specific reason to move.
5. Add admin configuration management endpoints after operational usage proves the need.

## Pricing References Checked

- Cloudflare Pages: free plan lists USD 0, 100 custom domains per project, unlimited sites, unlimited static requests, and unlimited bandwidth. See `https://pages.cloudflare.com/`.
- Railway: Hobby lists USD 5 minimum usage, included monthly usage credits, custom domains, global regions, and per-resource usage pricing. See `https://railway.com/pricing`.
- DigitalOcean Managed Databases: Managed MySQL starts at the low managed tier around USD 15/month for 1 GiB memory, 1 vCPU, and 10-30 GiB storage range. See `https://www.digitalocean.com/pricing/managed-databases`.
