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

## Invitation Email Setup

Public registration is disabled. A System Admin creates each user from the User Management page, and the user receives a six digit code by email before setting a password.

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
