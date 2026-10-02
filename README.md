This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Required Environment

Authentication requires a strong server-only JWT secret. Add this to `.env.local`:

```env
JWT_SECRET=<at-least-32-random-characters>
```

Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
The application rejects missing or short secrets and does not use a fallback key.

The existing `MONGODB_URI` and `MONGODB_DB` variables are also required for database access.

Product image uploads require a Cloudinary account. Add the server-only credentials to `.env.local`:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Find these values in the Cloudinary dashboard under **Product environment settings**. Restart the Next.js development server after changing `.env.local`.

## Invitation Email Setup

Customer registration is available from the storefront signup page. Staff accounts are created by a System Admin from the User Management page, and invited staff receive a six digit code by email before setting a password.

Configure Nodemailer with an SMTP account in `.env.local`:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM="Inventory Management <no-reply@example.com>"
APP_URL=http://localhost:3000
```

`SMTP_SECURE=true` is normally used with port `465`. Keep SMTP credentials server-side and never expose them as `NEXT_PUBLIC_*` variables.

For Gmail, `SMTP_HOST`, `SMTP_PORT`, and `SMTP_SECURE` may be omitted; the application defaults to `smtp.gmail.com`, port `465`, with TLS enabled. `SMTP_PASS` must be a Gmail App Password, not the normal account password.

## Inventory and Customer Workflow Notes

Phase 4 inventory uses product-level stock as the authoritative balance and records changes in the stock movement ledger. Warehouse-specific stock is not yet implemented. Authorized inventory tests, concurrent inventory tests, and dedicated database-backed integration tests were not available in the development environment.

Phase 5 provides authenticated customer profiles, embedded address books, real customer order history, ownership-safe order details, cancellation with centralized stock restoration, and permission-protected staff status transitions. Payment gateway, refunds, suppliers, procurement, and warehouse transfers remain outside this phase.

Phase 6 adds supplier and purchase-order APIs, transactional purchase receiving, persisted VAT settings, historical invoices, return processing, attendance persistence, coupon validation, and server-side reports. Purchase receiving and completed returns require MongoDB transaction support. Authenticated database-backed workflow tests were not available in the development environment, and the existing promotions campaign screen remains presentation-only; offer/coupon rules are persisted and validated server-side.

## Production Hardening Notes

Phase 8 hardens active JWT authentication with HTTP-only, secure-in-production, SameSite-strict cookies, database account-status checks, auth-version revocation after password/role/status changes, bounded login throttling, safe client error messages, upload MIME/size validation, theme URL/color validation, collection pagination limits, and audit records for centralized stock changes and store-settings updates.

Production deployments must provide `MONGODB_URI`, a 32-character-or-longer `JWT_SECRET`, Cloudinary credentials when uploads are enabled, and server-side SMTP credentials when invitations are enabled. Login throttling is process-local and should be replaced with a shared store such as Redis before horizontally scaled deployment. MongoDB transactions require a replica set or MongoDB-compatible transaction deployment.

Payment processing is not production-ready because no payment gateway/webhook is connected. Database backups, restore drills, secret rotation, monitoring, and alerting remain deployment responsibilities. Authenticated integration, concurrency, and ownership tests were not executed because test credentials and isolated test data were unavailable. Full ESLint currently reports 34 existing errors and 45 warnings in unrelated legacy UI/provider files; targeted Phase 8 files pass.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
