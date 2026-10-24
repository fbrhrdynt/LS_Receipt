# LS Receipt — Febro Space integration

## Current baseline (inspected)
- React/Vite single-page application.
- Receipt generation and preview are client-side.
- PDF, PNG, JPG and print are client-side actions.
- Receipt history currently uses localStorage, **not a database**.
- There is no verified server-side Febro Space authentication or receipt history API in the repository.

## Required implementation
1. Preserve all guest editing, generator and preview features.
2. Gate PDF/PNG/JPG export **and browser print** behind verified Febro Space login. Use an authenticated backend to authorize and initiate exports; UI-only interception is insufficient security for downloadable assets.
3. Implement OIDC Authorization Code + PKCE with Febro Space; validate issuer, audience, nonce and state; do not accept client-provided user IDs as an identity.
4. Add an application backend with secure HttpOnly SameSite cookies and CSRF protection. Add SQLite receipt history scoped by the server-verified Febro Space subject. Create/list/update/delete/duplicate receipt records and a migration flow for existing localStorage drafts upon login. Add schema validation and record limits.
5. Provide user-facing History (only their records), explicit logout, export and account status. No cross-user access.
6. Send authenticated service-to-service telemetry with `receipt` application key from Febro Space: heartbeat/login/logout/activity; never expose the secret in browser bundles.
7. Use server-enforced SSO application access controls and revocation. Test guest editor vs export, OIDC callback, authorization, IDOR, concurrent writes, retention and exports.
8. Update deployment documentation for existing Ubuntu/PM2/Nginx setup while preserving the running service, environment, other vhosts and user data.

Do not treat work as completed merely because the UI displays a login prompt. The server-side authentication, database and export enforcement must be implemented and tested before enabling the release.
