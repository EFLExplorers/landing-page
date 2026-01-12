# Environment & Deploy (stub)

Document env vars and deployment steps as they become defined.

## Env Vars (to confirm)

- `NEXT_PUBLIC_API_BASE` (future)
- Auth-related: e.g., `NEXT_PUBLIC_AUTH_BASE`, `AUTH_CLIENT_ID` (if used)
- Analytics (if added later)

## Local

- Install: `npm install`
- Dev: `npm run dev`
- Tests: `npm run cypress` (or `npx cypress open`) — confirm scripts

## Build/Deploy

- Build: `npm run build`
- Start: `npm start` (if used)
- Hosting: (fill in) Vercel/other; include any required secrets

## Notes

- Add env-template entries as vars are introduced.
- Keep secrets out of the repo; use env files or platform secret stores.
