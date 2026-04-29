# Deploy NURDSCODE to myclaw-vps

Phase 1 deployment runbook. Single-container, Traefik-routed, `nurdscode.com` + `www.nurdscode.com`.

**Prerequisite:** all blockers from `docs/SHIP_RECEIPTS/PHASE_1_BATCH_1_2026_04_28.md` resolved (env vars populated, `nurd-codebase/` decision made, OAuth callbacks updated).

---

## 1. One-time host prep on myclaw-vps

```bash
ssh myclaw-vps

# Confirm Traefik network name — adjust compose if different
docker network ls | grep traefik

# Create persistent volume mount points
sudo mkdir -p /opt/foai-data/nurdscode/uploads
sudo chown -R 1001:1001 /opt/foai-data/nurdscode/uploads   # matches Dockerfile uid:gid
```

## 2. Source secrets from openclaw-sop5

```bash
# On myclaw-vps. Pull required keys into the deploy directory's .env.local.
# Run this when keys rotate or when bringing the service up for the first time.

REQUIRED_KEYS=(
  DATABASE_URL
  SESSION_SECRET
  OPENAI_API_KEY
  ANTHROPIC_API_KEY
  GROQ_API_KEY
  ASKCODI_API_KEY
  STRIPE_SECRET_KEY
  STRIPE_WEBHOOK_SECRET
  VITE_STRIPE_PUBLIC_KEY
  STRIPE_PRICE_BASIC
  STRIPE_PRICE_STANDARD
  STRIPE_PRICE_PREMIUM
  STRIPE_PRICE_BOOTCAMP
  STRIPE_PRICE_SUBSCRIPTION_MONTHLY
  STRIPE_PRICE_SUBSCRIPTION_YEARLY
  PAYPAL_CLIENT_ID
  PAYPAL_CLIENT_SECRET
  GOOGLE_CLIENT_ID
  GOOGLE_CLIENT_SECRET
  GITHUB_CLIENT_ID
  GITHUB_CLIENT_SECRET
  FACEBOOK_APP_ID
  FACEBOOK_APP_SECRET
  MICROSOFT_CLIENT_ID
  MICROSOFT_CLIENT_SECRET
  EMAIL_HOST
  EMAIL_PORT
  EMAIL_SECURE
  EMAIL_USER
  EMAIL_PASS
  EMAIL_FROM
)

cd /opt/foai/nurdscode
{
  echo "# Generated $(date -Iseconds) from openclaw-sop5-openclaw-1"
  echo "NODE_ENV=production"
  echo "PORT=3000"
  echo "HOSTNAME=0.0.0.0"
  echo "APP_URL=https://nurdscode.com"
  echo "PAYPAL_ENVIRONMENT=live"
  for key in "${REQUIRED_KEYS[@]}"; do
    val=$(docker exec openclaw-sop5-openclaw-1 printenv "$key" 2>/dev/null)
    if [ -n "$val" ]; then
      printf '%s=%q\n' "$key" "$val"
    else
      echo "# MISSING: $key — add to openclaw-sop5 then re-run this block"
    fi
  done
} | sudo tee .env.local > /dev/null

sudo chmod 600 .env.local
sudo chown root:root .env.local

# Sanity check (NEVER cat the full file in shared terminals)
grep -c "=" .env.local                # count how many keys populated
grep "^# MISSING" .env.local          # list what's still missing
```

## 3. Sync repo to myclaw-vps

```bash
# From local laptop:
rsync -avz --delete \
  --exclude='node_modules/' \
  --exclude='dist/' \
  --exclude='.git/' \
  --exclude='nurd-codebase/' \
  --exclude='.env.local' \
  ~/foai/nurdscode/ myclaw-vps:/opt/foai/nurdscode/
```

(Or `git pull` on the VPS if a deploy branch convention is established. For Phase 1 first-ship, rsync is faster.)

## 4. Build + bring up

```bash
ssh myclaw-vps
cd /opt/foai/nurdscode

# Build the image (5-10 min on first run)
docker compose build

# Start the service
docker compose up -d

# Watch logs
docker compose logs -f --tail=100 nurdscode
```

Expected log sequence:
```
[express] Server listening on http://0.0.0.0:3000
```

## 5. Traefik routing verification

```bash
# Confirm the container joined the traefik network
docker inspect nurdscode --format '{{json .NetworkSettings.Networks}}' | jq

# Confirm Traefik picked up the labels
docker logs traefik 2>&1 | grep -i nurdscode | tail -10

# Liveness from inside the network
docker exec nurdscode wget -qO- http://localhost:3000/api/health
```

## 6. DNS cutover (Cloudflare zone, proxy OFF)

In the Cloudflare dashboard for `nurdscode.com`:
- A record: `nurdscode.com` → `<myclaw-vps public IP>`, **proxy OFF (grey-cloud)**, TTL Auto
- A record: `www.nurdscode.com` → `<myclaw-vps public IP>`, **proxy OFF (grey-cloud)**, TTL Auto
- Remove any old A/CNAME records pointing at Replit / Cloudflare Pages / etc.

```bash
# From local laptop after propagation (~30s)
dig +short nurdscode.com         # → myclaw-vps IP
dig +short www.nurdscode.com     # → same
```

## 7. TLS verification

Traefik issues Let's Encrypt cert on first request to the host. Allow ~30s after first hit.

```bash
curl -I https://nurdscode.com
# Expect: HTTP/2 200, valid cert, no MITM warning
openssl s_client -connect nurdscode.com:443 -servername nurdscode.com </dev/null | grep -E "subject=|issuer="
# Expect: subject=CN = nurdscode.com, issuer=CN = R3 (Let's Encrypt)
```

## 8. OAuth callback updates (each provider's dashboard)

Update redirect URI to `https://nurdscode.com/api/auth/<provider>/callback`:
- Google Cloud Console → OAuth 2.0 Client → Authorized redirect URIs
- GitHub → Developer settings → OAuth Apps → Authorization callback URL
- Facebook → App Dashboard → Facebook Login → Valid OAuth Redirect URIs
- Microsoft → Entra → App registrations → Authentication → Redirect URIs

## 9. Stripe + PayPal webhook updates

- Stripe dashboard → Developers → Webhooks → Endpoint URL = `https://nurdscode.com/api/webhooks/stripe`
- PayPal dashboard → Webhooks → Endpoint URL = `https://nurdscode.com/api/webhooks/paypal`

Re-test signature verification after URL change.

## 10. Smoke test (golden path)

1. Visit `https://nurdscode.com` — landing page renders
2. Sign up with new email — receive verification email (or skip if email is async)
3. Sign in — land on dashboard
4. Visit `/access-ai` — V.I.B.E. UI loads, send a prompt, verify AI response
5. Visit `/summer-initiative` — page renders
6. Trigger a Stripe test webhook from Stripe dashboard → confirm 200 response in container logs
7. Sign out

Capture evidence: screenshots + curl outputs + container log excerpts → into `docs/SHIP_RECEIPTS/PHASE_1_LIVE_<date>.md`.

## 11. Roll-back path

If anything is wrong, the old Replit deployment is gone but DNS revert is one Cloudflare change away.

```bash
# Take the container down
docker compose down

# Edit Cloudflare A records back to whatever placeholder you want, or leave parked
```

## 12. Completion criteria

Phase 1 ship is COMPLETE when:
- [ ] `https://nurdscode.com` returns 200 with valid TLS
- [ ] One real account signs up + signs in + uses V.I.B.E. + signs out — full round-trip
- [ ] One Stripe test webhook delivers and the handler validates signature + returns 200
- [ ] Container shows `Up (healthy)` in `docker compose ps`
- [ ] `PHASE_1_LIVE_<date>.md` Build Session Receipt committed
- [ ] No Replit env vars referenced anywhere live (`grep REPLIT /opt/foai/nurdscode/.env.local` → empty)

Anything UNVERIFIED at this stage is a Phase 1.5 task — not a ship blocker, but logged.
