# Contact form setup

The Contact page (`/contact/`) is backed by a small TypeScript Cloudflare Worker
that handles `POST /api/contact`. On submit the Worker validates a Cloudflare
Turnstile token, applies spam protection (honeypot + per-IP rate limiting via
D1), stores the submission in a D1 database, and emails the site owner via
Resend. Every other path is served as a static asset.

## Prerequisites

- A free Cloudflare account with the site deployed.
- A domain (or the default `workers.dev` subdomain).
- A [Resend](https://resend.com) account for outbound email.
- A Cloudflare [Turnstile](https://developers.cloudflare.com/turnstile/) widget.

## Create the D1 database

```sh
npx wrangler d1 create zolt-contact
# paste the printed database_id into wrangler.toml -> [[d1_databases]]

# Apply migrations locally for development:
npx wrangler d1 migrations apply zolt-contact --local
```

Remote migrations are applied automatically by CI on deploy (see below). To
apply them by hand — e.g. the first time, before CI has run — use:

```sh
npx wrangler d1 migrations apply zolt-contact --remote
```

Migrations live in `./migrations/` (wrangler's default) and are tracked in a
`d1_migrations` table, so each file is applied at most once. Add new schema
changes as new numbered files there.

## Turnstile

Create a widget in the Cloudflare dashboard. Put the **site key** (public) in
`zola.toml` under `[extra.contact].turnstile_site_key`. Store the **secret key**
as a Worker secret:

```sh
npx wrangler secret put TURNSTILE_SECRET_KEY
```

For local UI testing without a real key, Cloudflare provides always-pass test
keys: site `1x00000000000000000000AA`, secret
`1x0000000000000000000000000000000AA`.

## Resend

Sign up, verify a sending domain (add the DNS records Resend shows), and create
an API key. Store it as a Worker secret:

```sh
npx wrangler secret put RESEND_API_KEY
```

Set `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` in `wrangler.toml` under
`[vars]`. The `from` address must use the verified domain.

## Local development

Production Turnstile keys are tied to your production hostname (and Cloudflare
recommends they exclude `localhost`), so local testing uses Cloudflare's
always-pass **test keys** instead. They work on any domain and pair together:
the test **site key** must be verified with the test **secret** (production keys
reject dummy tokens and vice versa).

1. Provide the local secret. Copy the example and keep it out of git:
   ```sh
   cp .dev.vars.example .dev.vars   # .dev.vars is gitignored
   ```
   It defaults to the test secret `1x0000000000000000000000000000000AA`. Set a
   real `RESEND_API_KEY` if you also want the email to send locally.
2. Seed the local D1 database:
   ```sh
   npx wrangler d1 migrations apply zolt-contact --local
   ```
3. Run it:
   ```sh
   just dev            # wrangler dev: serves static assets + /api/* Worker
   ```

`just dev` builds the site, then injects the Turnstile test **site key**
(`1x00000000000000000000AA`) into the built `public/contact/index.html` only —
your real key in `zola.toml` is never changed. The widget always passes, the
Worker verifies the dummy token with the test secret, and the submission is
stored in local D1.

D1 local mode uses a local SQLite file (under `.wrangler/`). Query local rows
with:

```sh
npx wrangler d1 execute zolt-contact --local \
  --command "SELECT id, name, email, email_status FROM submissions ORDER BY id DESC LIMIT 5"
```

## Deploy

Push to `main`; CI applies any pending D1 migrations remotely
(`wrangler d1 migrations apply zolt-contact --remote`), runs `just build`, then
`wrangler deploy`. Ensure `database_id` is filled in `wrangler.toml`.
The API token needs **Workers Scripts** + **D1** edit permissions.
`TURNSTILE_SECRET_KEY`/`RESEND_API_KEY` are set on Cloudflare via
`wrangler secret put`, not in GitHub.

## Free-tier notes

- Workers: 100k requests/day.
- D1: 5 GB storage plus generous daily read/write.
- Turnstile: free/unlimited.
- Resend: free 3k emails/month, 100/day.

## Viewing submissions

```sh
npx wrangler d1 execute zolt-contact --remote \
  --command "SELECT id, name, email, email_status, created_at FROM submissions ORDER BY created_at DESC LIMIT 20"
```

Each row's `email_status` starts at `pending` and is promoted to `sent` once
Resend confirms delivery. To find messages that were stored but failed to email
(so you can follow up manually), query the rows still not marked `sent`:

```sh
npx wrangler d1 execute zolt-contact --remote \
  --command "SELECT id, name, email, created_at FROM submissions WHERE email_status != 'sent' ORDER BY created_at DESC"
```

## Security notes

- Never commit secrets. The Turnstile **site key** is public and lives in
  `zola.toml`; the **secret key** and Resend API key are Worker secrets.
- Spam protection layers a honeypot field, per-IP rate limiting, and Turnstile.
- Email deliverability requires a verified sending domain.
