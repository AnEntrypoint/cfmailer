# Technical Caveats

## Email Service Setup (2026 Latest)
- Cloudflare Email Service launched September 26, 2025 - unified Email Routing + Sending
- Must have Email Routing enabled on domain before deploying worker
- At least one email address verified as recipient
- Sender must use domain with active Email Routing (e.g., noreply@yourdomain.com)

## Wrangler & Compatibility
- Wrangler v4.59.2 is latest stable (v3 receives only bug fixes until Q1 2027)
- compatibility_date 2026-01-19 recommended for all new workers
- EmailMessage from `cloudflare:email` - native binding, no API keys required
- env.send_email.send() must be awaited - returns Promise

## Code Patterns
- Use URL constructor for pathname matching instead of endsWith (more reliable)
- Email validation required - regexp checks format before sending
- Subject truncated to 998 chars to prevent RFC violations
- Response helper function reduces duplication for JSON endpoints

## Gotchas
- Sender address must be from verified domain - Cloudflare validates at send time
- Service Workers (deprecated) - use Module Workers only
- Email Workers can be combined with KV/R2/AI for advanced features
