# Security hardening checklist

- Replace all CHANGE_ME values with secure secrets stored in KMS.
- Use RSA 4096 keys for RS256 JWT signing; store private key in KMS and public key in env.
- Configure Redis with ACL and TLS for rate limiting.
- Enforce HTTPS everywhere and HSTS.
- Use CSP and other security headers on frontend.
- Rotate node secrets regularly and implement device attestation for worker nodes.
