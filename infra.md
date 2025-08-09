# Infra & Security Notes (Upgraded)

- DB: Neon Postgres behind private network; use read replicas for analytics.
- Redis: used for rate-limiting and login lockouts.
- Key Management: store RSA keys & rotating secrets in a KMS (AWS KMS, GCP KMS, or HashiCorp Vault).
- Blob: Vercel Blob or S3 with short-lived presigned URLs.
- Workers: run in Docker with cgroups (memory + cpu limits), seccomp, and egress firewall rules.
- Monitoring: Prometheus + Grafana; central logs to Loki/Elastic.
- Access: Admin panels must be behind IP allowlist or SSO & MFA.
