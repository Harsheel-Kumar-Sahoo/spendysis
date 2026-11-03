# Security Policy

## Reporting a vulnerability

If you find a security problem in Spendysis, please do not open a public issue.
Instead, use GitHub's **Security → Report a vulnerability** option on this
repository, or contact the maintainer through their GitHub profile.

Please include steps to reproduce the problem. You can expect a reply within a
few days.

## Handling secrets

- Never commit `.env` files, database passwords or `JWT_SECRET` values.
- If a secret is ever exposed, rotate it immediately (change the MongoDB user
  password in Atlas and generate a new `JWT_SECRET`).
