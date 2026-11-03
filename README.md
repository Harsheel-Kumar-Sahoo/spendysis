# Spendora

Expense tracker with accounts. Node + Express + MongoDB Atlas, JWT login.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env`, fill in `MONGODB_URI` and `JWT_SECRET`
   (generate one: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`)
3. `npm start` and open http://localhost:3000

## Deploy (Render, free)
Push to GitHub → Render "New Web Service" → build `npm install`, start `npm start`
→ add env vars `MONGODB_URI` and `JWT_SECRET`. In Atlas > Network Access, allow `0.0.0.0/0`.

## Vercel + PWA
- `api/index.js` + `vercel.json` run the Express app as a Vercel serverless function; `public/` is served as static files.
- Env vars on Vercel: `MONGODB_URI`, `JWT_SECRET`. Atlas Network Access must allow `0.0.0.0/0`.
- Installable PWA: `public/manifest.webmanifest`, `public/sw.js`, icons. Needs HTTPS (Vercel provides it).
