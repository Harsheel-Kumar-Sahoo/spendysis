<div align="center">

# Spendysis

**Spend + Analysis**: a modern expense tracker with accounts, payment-method tracking and designed PDF reports.

![Node](https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-installable-0B6E66)
![License](https://img.shields.io/badge/License-MIT-blue)

</div>

Spendysis helps you see where your money goes each month. Log every expense with how you paid (UPI, cash, card or any other method), then view clear totals, a payment-method split and a downloadable PDF report. It works as an installable app on Android, iPhone and desktop.

**Live app:** `<add-your-vercel-link-here>`

## Features

- **Accounts for multiple people.** Sign up and sign in with email and password. Every user only sees their own data.
- **Track by payment method.** UPI, Cash, Card, or Other (you type the method, for example net banking or cheque).
- **Monthly view.** Switch between months and see the total, a colour-coded split bar and per-method percentages.
- **Filter and edit.** Filter the list by payment method, edit any expense, delete with a two-tap confirmation.
- **PDF report.** Export a designed report for a single month or all time, with your name and email, six key statistics, payment-method breakdown, weekly or monthly spending chart, top 5 expenses and every transaction.
- **Light, dark and auto themes.** The light theme matches the PDF report's colour scheme.
- **Installable PWA.** Install it from the browser, with an in-app install button that also shows manual steps for Android Chrome and iPhone Safari.
- **Responsive and mobile-first.**

## Screenshots

<!-- Add your screenshots to docs/screenshots/ and uncomment these lines.
<p align="center">
  <img src="docs/screenshots/home-light.png" width="260" alt="Home, light theme">
  <img src="docs/screenshots/home-dark.png" width="260" alt="Home, dark theme">
  <img src="docs/screenshots/pdf-report.png" width="260" alt="PDF report">
</p>
-->

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS and JavaScript (single page, no build step) |
| Backend | Node.js 22, Express 4 |
| Database | MongoDB Atlas with Mongoose |
| Auth | JWT (30-day tokens), bcrypt password hashing |
| PDF export | html2canvas and jsPDF, loaded on demand |
| Hosting | Vercel (Express runs as a serverless function) |
| PWA | Web app manifest and a service worker |

## Getting started

### Prerequisites

- Node.js 22 or newer
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Run locally

```bash
git clone https://github.com/Harsheel-Kumar-Sahoo/spendysis.git
cd spendysis
npm install
cp .env.example .env      # on Windows: copy .env.example .env
```

Open `.env` and fill in the values (see below), then:

```bash
npm start
```

Visit `http://localhost:3000`, create an account and add your first expense.

### Environment variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | Your Atlas connection string, ending with `/spendora` before the `?` |
| `JWT_SECRET` | A long random string used to sign login tokens |
| `PORT` | Optional. Local port, defaults to `3000` |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

In Atlas, open **Network Access** and allow your IP address (use `0.0.0.0/0` when deploying to Vercel, since Vercel's IP addresses change).

> The database is named `spendora`, which is the app's earlier name. It is kept so existing data stays intact.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New, then Project** and import the repo. Leave the Framework Preset as **Other**.
3. Add the environment variables `MONGODB_URI` and `JWT_SECRET`.
4. Click **Deploy**. Vercel detects `app.js` as the Express app and serves the `public/` folder as static files.

## Install as an app

- **Android (Chrome):** tap the menu, then **Install app**.
- **iPhone (Safari):** tap **Share**, then **Add to Home Screen**.
- **Desktop (Chrome or Edge):** click the install icon in the address bar.

You can also use the **Install app** button inside Spendysis. Installation needs HTTPS, which Vercel provides.

## API reference

All `/api/expenses` routes require the header `Authorization: Bearer <token>`.

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create an account (`name`, `email`, `password`) |
| POST | `/api/auth/login` | Sign in, returns a token |
| GET | `/api/auth/me` | Current user's name and email |
| GET | `/api/expenses` | List the user's expenses |
| POST | `/api/expenses` | Add an expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

Expense body:

```json
{ "amt": 250, "mode": "UPI", "other": "", "what": "Lunch", "date": "2026-11-02" }
```

`mode` is one of `UPI`, `Cash`, `Card`, `Other`. `other` is the method name when `mode` is `Other`.

## Project structure

```
app.js                    Express app: auth, expenses API, MongoDB connection
public/index.html         The whole user interface
public/report.js          PDF report builder (loaded on demand)
public/sw.js              Service worker
public/manifest.webmanifest
public/*.png              App icons
```

## Security notes

- Passwords are hashed with bcrypt and never stored or exported in plain text.
- Login and register routes are rate limited.
- Each query is filtered by the signed-in user's ID, so users cannot see each other's data.
- The login token is kept in the browser's local storage. Use a strong, unique password.
- Never commit your `.env` file. See [SECURITY.md](SECURITY.md) to report a vulnerability.

## Roadmap

- [ ] Monthly budgets with warnings
- [ ] Optional category tags and in-app charts
- [ ] Recurring expenses
- [ ] Password reset by email
- [ ] CSV export and backup
- [ ] Offline entry with sync

## License

Released under the [MIT License](LICENSE).

## Author

Built with love by **Harsheel Kumar Sahoo**. [GitHub](https://github.com/Harsheel-Kumar-Sahoo)
