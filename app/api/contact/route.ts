import { NextResponse } from "next/server";

type ContactPayload = {
  email?: string;
  subject?: string;
  message?: string;
};

const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_FROM_EMAIL = "Staworth Contact <onboarding@resend.dev>";

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const email = String(payload.email || "").trim();
  const subject = String(payload.subject || "").trim();
  const message = String(payload.message || "").trim();

  if (!email || !subject || !message) {
    return NextResponse.json({ error: "Email, subject, and message are required." }, { status: 400 });
  }

  if (email.length > 254 || subject.length > 140 || message.length > 5000) {
    return NextResponse.json({ error: "One or more fields exceed the allowed length." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json(
      { error: "Contact form is not configured. Missing RESEND_API_KEY." },
      { status: 503 }
    );
  }

  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) {
    return NextResponse.json(
      { error: "Contact form is not configured. Missing CONTACT_TO_EMAIL." },
      { status: 503 }
    );
  }
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  const text = [
    "New contact form submission",
    "",
    `Reply email: ${email}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Reply email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <p><strong>Message:</strong></p>
    <pre style="white-space: pre-wrap; font-family: sans-serif;">${escapeHtml(message)}</pre>
  `;

  let resendResponse: Response;
  try {
    resendResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[Contact] ${subject}`,
        text,
        html,
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message. Could not reach email provider." },
      { status: 502 }
    );
  }

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    return NextResponse.json(
      { error: `Failed to send message. ${errorText}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
