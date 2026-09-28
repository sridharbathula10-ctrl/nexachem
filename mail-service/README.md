# NexaChem standalone mail API

This service runs separately from the static Next.js frontend. It exposes `POST /api/contact` and sends contact form submissions through Hostinger SMTP.

## Run locally

1. Copy `env.example` to `.env` and set the mailbox password.
2. Run `npm install`.
3. Run `npm run dev`.

## Hostinger deployment

Deploy the contents of this folder as a Hostinger Node.js Web App on `api.nexachemco.com`. Set the start command to `npm start`, then configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_TO`, and `ALLOWED_ORIGINS` in the Hostinger app environment settings. Do not upload a real `.env` file.

The frontend sends submissions to `https://api.nexachemco.com/api/contact`. `ALLOWED_ORIGINS` must contain the exact website origin(s), including `https://` and `www` if used.
