import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { Resend } from "resend"
import { z } from "zod"

import { USER } from "@/features/portfolio/data/user"
import { decodeEmail } from "@/utils/string"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(5000),
})

export type ContactBody = z.infer<typeof contactSchema>

const gmailUser = process.env.GMAIL_USER
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD
const resendApiKey = process.env.RESEND_API_KEY
const resendFrom = process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>"

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// Email-safe palette: dark header, soft cards, accent blue
const EMAIL = {
  wrapper:
    "margin:0;padding:0;min-height:100vh;background:#f1f5f9;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.6;color:#0f172a;",
  container: "max-width:580px;margin:0 auto;padding:32px 20px;",
  card:
    "background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(15,23,42,0.08),0 1px 3px rgba(15,23,42,0.06);overflow:hidden;border:1px solid rgba(226,232,240,0.8);",
  headerStrip:
    "background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:28px 32px;text-align:center;",
  headerTitle:
    "margin:0;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#f8fafc;",
  headerSub:
    "margin:6px 0 0;font-size:13px;font-weight:500;color:#94a3b8;letter-spacing:0.02em;",
  badge:
    "display:inline-block;padding:8px 14px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;border-radius:8px;margin-bottom:0;box-shadow:0 2px 8px rgba(59,130,246,0.35);",
  badgeSuccess:
    "display:inline-block;padding:8px 14px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;border-radius:8px;margin-bottom:0;box-shadow:0 2px 8px rgba(16,185,129,0.35);",
  content: "padding:32px 32px 28px;",
  heading: "margin:0 0 8px;font-size:20px;font-weight:700;letter-spacing:-0.02em;color:#0f172a;",
  headingMuted: "margin:0 0 24px;font-size:14px;color:#64748b;font-weight:400;",
  fieldRow:
    "margin:0 0 20px;padding:16px 18px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;",
  fieldLabel:
    "display:block;margin:0 0 6px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;",
  fieldValue: "margin:0;font-size:15px;color:#0f172a;font-weight:500;",
  link: "color:#2563eb;text-decoration:none;font-weight:500;",
  messageBox:
    "margin:0;padding:20px 20px;background:#f1f5f9;border-radius:12px;border-left:4px solid #3b82f6;font-size:15px;line-height:1.65;white-space:pre-wrap;word-break:break-word;color:#334155;",
  divider: "height:1px;background:#e2e8f0;margin:28px 0;border:0;",
  footer: "margin-top:24px;font-size:13px;color:#64748b;padding-top:20px;border-top:1px solid #e2e8f0;",
  signature: "margin-top:24px;font-weight:600;color:#0f172a;font-size:16px;",
  replyHint:
    "display:inline-block;padding:12px 16px;background:#eff6ff;border-radius:8px;font-size:13px;color:#1e40af;border:1px solid #bfdbfe;",
} as const

function emailLayout(body: string, title: string, headerTitle: string, headerSub: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="${EMAIL.wrapper}">
  <div style="${EMAIL.container}">
    <div style="${EMAIL.card}">
      <div style="${EMAIL.headerStrip}">
        <h1 style="${EMAIL.headerTitle}">${escapeHtml(headerTitle)}</h1>
        <p style="${EMAIL.headerSub}">${escapeHtml(headerSub)}</p>
      </div>
      <div style="${EMAIL.content}">
        ${body}
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

function buildOwnerHtml(name: string, email: string, subject: string, message: string): string {
  const body = `
    <span style="${EMAIL.badge}">New message</span>
    <h2 style="${EMAIL.heading}">Contact form</h2>
    <p style="${EMAIL.headingMuted}">Someone sent you a message from your portfolio.</p>
    <div style="${EMAIL.fieldRow}">
      <span style="${EMAIL.fieldLabel}">From</span>
      <p style="${EMAIL.fieldValue}">${escapeHtml(name)} &mdash; <a href="mailto:${escapeHtml(email)}" style="${EMAIL.link}">${escapeHtml(email)}</a></p>
    </div>
    <div style="${EMAIL.fieldRow}">
      <span style="${EMAIL.fieldLabel}">Subject</span>
      <p style="${EMAIL.fieldValue}">${escapeHtml(subject)}</p>
    </div>
    <hr style="${EMAIL.divider}" />
    <span style="${EMAIL.fieldLabel}">Message</span>
    <div style="${EMAIL.messageBox}">${escapeHtml(message)}</div>
    <p style="${EMAIL.footer}">
      <span style="${EMAIL.replyHint}">Reply to this email to respond directly to the sender.</span>
    </p>
  `
  return emailLayout(body, `Contact: ${subject}`, "New contact message", "Portfolio contact form")
}

function buildUserConfirmationHtml(name: string, message: string, siteName: string): string {
  const body = `
    <span style="${EMAIL.badgeSuccess}">Message received</span>
    <h2 style="${EMAIL.heading}">Thanks for reaching out, ${escapeHtml(name)}</h2>
    <p style="${EMAIL.headingMuted}">Your message has been delivered. I'll get back to you as soon as I can.</p>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.65;">I've received what you sent and will reply from this address. No need to send it again.</p>
    <hr style="${EMAIL.divider}" />
    <span style="${EMAIL.fieldLabel}">Your message</span>
    <div style="${EMAIL.messageBox}">${escapeHtml(message)}</div>
    <p style="${EMAIL.signature}">Best,<br />${escapeHtml(siteName)}</p>
  `
  return emailLayout(body, "We received your message", "Message received", "Thanks for getting in touch")
}

async function sendWithGmail(
  ownerEmail: string,
  fromAddress: string,
  name: string,
  email: string,
  subject: string,
  message: string,
  siteName: string
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  })

  const ownerHtml = buildOwnerHtml(name, email, subject, message)
  const userHtml = buildUserConfirmationHtml(name, message, siteName)

  await Promise.all([
    transporter.sendMail({
      from: fromAddress,
      to: ownerEmail,
      replyTo: email,
      subject: `Contact: ${subject}`,
      html: ownerHtml,
    }),
    transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: `Re: ${subject}`,
      html: userHtml,
    }),
  ])
}

async function sendWithResend(
  ownerEmail: string,
  name: string,
  email: string,
  subject: string,
  message: string,
  siteName: string
) {
  const resend = new Resend(resendApiKey)
  const ownerHtml = buildOwnerHtml(name, email, subject, message)
  const userConfirmationHtml = buildUserConfirmationHtml(name, message, siteName)

  const [ownerResult, userResult] = await Promise.all([
    resend.emails.send({
      from: resendFrom,
      to: [ownerEmail],
      replyTo: email,
      subject: `Contact: ${subject}`,
      html: ownerHtml,
    }),
    resend.emails.send({
      from: resendFrom,
      to: [email],
      subject: `Re: ${subject}`,
      html: userConfirmationHtml,
    }),
  ])

  if (ownerResult.error) throw ownerResult.error
  if (userResult.error) throw userResult.error
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = parsed.data
    const ownerEmail = decodeEmail(USER.email)
    const siteName = USER.displayName

    const useGmail = gmailUser && gmailAppPassword
    const useResend = resendApiKey

    if (!useGmail && !useResend) {
      return NextResponse.json(
        { error: "Email service is not configured. Set GMAIL_USER + GMAIL_APP_PASSWORD or RESEND_API_KEY." },
        { status: 503 }
      )
    }

    if (useGmail) {
      const fromAddress = `${siteName} <${gmailUser}>`
      await sendWithGmail(ownerEmail, fromAddress, name, email, subject, message, siteName)
    } else {
      await sendWithResend(ownerEmail, name, email, subject, message, siteName)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[Contact] Send error:", err)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
