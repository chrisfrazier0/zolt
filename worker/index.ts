export interface Env {
  DB: D1Database;
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
}

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  token?: string; // cf-turnstile-response
  company?: string; // honeypot (must be empty)
}

const LIMITS = { name: 100, email: 200, message: 5000 };
const RATE = { windowMinutes: 10, max: 5 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/api/contact") return json({ error: "Not found" }, 404);
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

    let body: ContactPayload;
    try {
      body = (await request.json()) as ContactPayload;
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    // Honeypot: pretend success so bots don't learn anything.
    if (body.company && body.company.trim() !== "") return json({ ok: true });

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const message = (body.message || "").trim();
    const token = (body.token || "").trim();

    if (!name || !email || !message) return json({ error: "All fields are required." }, 400);
    if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message)
      return json({ error: "One or more fields are too long." }, 400);
    if (!EMAIL_RE.test(email)) return json({ error: "Please enter a valid email address." }, 400);
    if (!token) return json({ error: "Please complete the challenge." }, 400);

    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    const ua = request.headers.get("user-agent") || "";

    // Rate limit by IP using D1.
    try {
      const since = new Date(Date.now() - RATE.windowMinutes * 60_000).toISOString();
      const row = await env.DB.prepare(
        "SELECT COUNT(*) AS n FROM submissions WHERE ip = ? AND created_at >= ?",
      )
        .bind(ip, since)
        .first<{ n: number }>();
      if (row && row.n >= RATE.max)
        return json({ error: "Too many requests. Please try again later." }, 429);
    } catch (e) {
      console.error("rate-limit query failed", e);
    }

    // Verify Turnstile server-side.
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
    });
    const outcome = (await verify.json()) as { success: boolean };
    if (!outcome.success) return json({ error: "Challenge verification failed." }, 400);

    // Store in D1 (email_status defaults to 'pending' until Resend confirms).
    let submissionId: number | null = null;
    try {
      const result = await env.DB.prepare(
        "INSERT INTO submissions (name, email, message, ip, user_agent) VALUES (?, ?, ?, ?, ?)",
      )
        .bind(name, email, message, ip, ua)
        .run();
      submissionId = result.meta.last_row_id ?? null;
    } catch (e) {
      console.error("D1 insert failed", e);
      return json({ error: "Could not save your message. Please try again." }, 500);
    }

    // Email via Resend (best-effort: stored already, so still return success).
    // On success, promote the row's email_status from 'pending' to 'sent'.
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.RESEND_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM_EMAIL,
          to: env.CONTACT_TO_EMAIL,
          reply_to: email,
          subject: `New contact form message from ${name}`,
          text: `From: ${name} <${email}>\nIP: ${ip}\n\n${message}`,
        }),
      });
      if (res.ok) {
        if (submissionId !== null) {
          try {
            await env.DB.prepare("UPDATE submissions SET email_status = 'sent' WHERE id = ?")
              .bind(submissionId)
              .run();
          } catch (e) {
            console.error("email-status update failed", e);
          }
        }
      } else {
        console.error("Resend failed", res.status, await res.text());
      }
    } catch (e) {
      console.error("Resend request threw", e);
    }

    return json({ ok: true });
  },
};
