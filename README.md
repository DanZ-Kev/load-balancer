# Vercel LoadTest Admin — Upgraded Secure Build

This upgraded package focuses on **hardened API security**, advanced admin customization, and an improved frontend component library.
It is intended to be deployed with frontend on Vercel and worker nodes on self-hosted VPS with Docker.

Contents:
- frontend/: Next.js (TS) App Router + Tailwind components (skeleton + enhanced components)
- api/: Serverless endpoints with strict security middleware (JWT RS256, HMAC, request signature, rate-limiter hooks)
- worker-sample/: Deno worker updated to verify signatures and use HMAC for telemetry
- migrations.sql: DB schema including RBAC, roles, policies, audit logs
- infra.md: deployment & security checklist

**IMPORTANT**: This package is a starting point. Replace `CHANGE_ME` secrets with real keys and use KMS/Secret Manager in production.
