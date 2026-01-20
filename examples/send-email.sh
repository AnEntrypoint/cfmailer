#!/bin/bash

WORKER_URL="http://localhost:8787"
VERIFIED_EMAIL="${1:-test@example.com}"

curl -X POST "${WORKER_URL}/send-email" \
  -H "Content-Type: application/json" \
  -d "{
    \"to\": \"$VERIFIED_EMAIL\",
    \"from\": \"noreply@example.com\",
    \"subject\": \"Hello from Cloudflare Workers\",
    \"html\": \"<h1>Welcome</h1><p>This email was sent from a Cloudflare Worker!</p>\",
    \"text\": \"Welcome! This email was sent from a Cloudflare Worker!\"
  }"
