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
const resendFrom =
  process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>"
const siteUrl = (process.env.APP_URL ?? USER.website).replace(/\/$/, "")
const logoUrl = `${siteUrl}/logo.png`

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

const EMAIL = {
  wrapper:
    "margin:0;padding:0;min-height:100%;background:#f4f1ec;font-family:Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.65;color:#18181b;-webkit-font-smoothing:antialiased;",
  preheader:
    "display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;",
  container: "max-width:620px;margin:0 auto;padding:42px 18px;",
  card: "background:#fffdf9;border-radius:24px;overflow:hidden;border:1px solid #e7dfd2;box-shadow:0 18px 46px rgba(87,64,38,0.12);",
  headerAccentBar: "height:4px;background:#18181b;",
  headerStrip:
    "background:#fffdf9;padding:34px 38px 28px;text-align:left;border-bottom:1px solid #eee7dc;",
  brandRow: "margin:0 0 28px;",
  brandMark: "display:block;width:54px;height:54px;border-radius:16px;",
  eyebrow:
    "display:block;margin:0 0 12px;color:#71717a;font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;",
  headerTitle:
    "margin:0;font-size:30px;font-weight:800;letter-spacing:-0.045em;color:#18181b;line-height:1.12;",
  headerSub:
    "margin:12px 0 0;font-size:15px;color:#57534e;line-height:1.68;max-width:500px;",
  content: "padding:34px 38px 38px;background:#fffdf9;",
  lead: "margin:0 0 24px;font-size:15px;color:#57534e;line-height:1.75;max-width:100%;",
  heading:
    "margin:0 0 10px;font-size:22px;font-weight:800;letter-spacing:-0.035em;color:#18181b;line-height:1.25;",
  headingMuted:
    "margin:0 0 26px;font-size:15px;color:#78716c;font-weight:400;line-height:1.68;",
  panel:
    "margin:0 0 28px;padding:0;background:#ffffff;border:1px solid #eee7dc;border-radius:18px;overflow:hidden;",
  fieldRow:
    "margin:0;padding:17px 18px;background:#ffffff;border-bottom:1px solid #f0ebe3;",
  fieldLabel:
    "display:block;margin:0 0 7px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:#a8a29e;",
  fieldValue:
    "margin:0;font-size:15px;color:#18181b;font-weight:700;line-height:1.5;word-break:break-word;",
  link: "color:#18181b;text-decoration:none;font-weight:800;border-bottom:1px solid #a8a29e;",
  sectionBlock: "margin-top:0;",
  messageBox:
    "margin:12px 0 0;padding:24px 26px;background:#faf7f2;border-radius:18px;border:1px solid #eee7dc;border-left:4px solid #18181b;font-size:15px;line-height:1.78;white-space:pre-wrap;word-break:break-word;color:#292524;",
  divider: "height:1px;border:0;margin:30px 0;background:#eee7dc;",
  footer: "margin-top:26px;font-size:13px;color:#78716c;line-height:1.65;",
  signature:
    "margin-top:30px;font-weight:700;color:#18181b;font-size:17px;letter-spacing:-0.01em;",
  replyHint:
    "display:block;margin:0;padding:15px 17px;background:#ffffff;border-radius:16px;font-size:13px;color:#57534e;border:1px solid #eee7dc;line-height:1.6;",
  button:
    "display:inline-block;margin:6px 0 0;padding:12px 18px;background:#18181b;color:#ffffff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:800;",
} as const

function emailLayout(
  body: string,
  title: string,
  headerTitle: string,
  headerSub: string,
  preheader: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="${EMAIL.wrapper}">
  <div style="${EMAIL.preheader}">${escapeHtml(preheader)}</div>
  <div style="${EMAIL.container}">
    <div style="${EMAIL.card}">
      <div style="${EMAIL.headerAccentBar}" role="presentation"></div>
      <div style="${EMAIL.headerStrip}">
        <div style="${EMAIL.brandRow}">
          <img src="${escapeHtml(logoUrl)}" width="54" height="54" alt="${escapeHtml(title)} logo" style="${EMAIL.brandMark}" />
        </div>
        <span style="${EMAIL.eyebrow}">Portfolio Contact</span>
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

function buildOwnerHtml(
  name: string,
  email: string,
  subject: string,
  message: string
): string {
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(
    `Re: ${subject}`
  )}`
  const body = `
    <h2 style="${EMAIL.heading}">New contact message</h2>
    <p style="${EMAIL.headingMuted}">A visitor just reached out from your portfolio. The reply-to address is already set, or you can use the quick reply button below.</p>
    <div style="${EMAIL.panel}">
      <div style="${EMAIL.fieldRow}">
        <span style="${EMAIL.fieldLabel}">From</span>
        <p style="${EMAIL.fieldValue}">${escapeHtml(name)} <span style="color:#94a3b8;font-weight:500;">/</span> <a href="mailto:${escapeHtml(email)}" style="${EMAIL.link}">${escapeHtml(email)}</a></p>
      </div>
      <div style="${EMAIL.fieldRow}">
        <span style="${EMAIL.fieldLabel}">Subject</span>
        <p style="${EMAIL.fieldValue}">${escapeHtml(subject)}</p>
      </div>
    </div>
    <div style="${EMAIL.sectionBlock}">
      <span style="${EMAIL.fieldLabel}">Message</span>
      <div style="${EMAIL.messageBox}">${escapeHtml(message)}</div>
    </div>
    <p style="${EMAIL.footer}">
      <span style="${EMAIL.replyHint}"><strong style="color:#18181b;">Tip:</strong> Hit reply to answer directly from your email client.</span>
    </p>
    <a href="${escapeHtml(mailtoHref)}" style="${EMAIL.button}">Reply to ${escapeHtml(name)}</a>
  `
  return emailLayout(
    body,
    `Contact: ${subject}`,
    "New message in your inbox",
    `${name} sent a message through your contact form.`,
    `${name}: ${subject}`
  )
}

function buildUserConfirmationHtml(
  name: string,
  message: string,
  siteName: string
): string {
  const body = `
    <h2 style="${EMAIL.heading}">Thanks, ${escapeHtml(name)}</h2>
    <p style="${EMAIL.headingMuted}">Your message landed safely in my inbox. I will read it and reply when I can.</p>
    <p style="${EMAIL.lead}">No need to resend anything. I included a copy of your note below so you have it for your records.</p>
    <hr style="${EMAIL.divider}" />
    <div style="${EMAIL.sectionBlock}">
      <span style="${EMAIL.fieldLabel}">Your message</span>
      <div style="${EMAIL.messageBox}">${escapeHtml(message)}</div>
    </div>
    <p style="${EMAIL.signature}">Warm regards,<br /><span style="color:#18181b;">${escapeHtml(siteName)}</span></p>
  `
  return emailLayout(
    body,
    "We received your message",
    "Message received",
    "Thanks for reaching out. I will get back to you soon.",
    "Your portfolio contact message was delivered."
  )
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
  const userConfirmationHtml = buildUserConfirmationHtml(
    name,
    message,
    siteName
  )

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
        {
          error:
            "Email service is not configured. Set GMAIL_USER + GMAIL_APP_PASSWORD or RESEND_API_KEY.",
        },
        { status: 503 }
      )
    }

    if (useGmail) {
      const fromAddress = `${siteName} <${gmailUser}>`
      await sendWithGmail(
        ownerEmail,
        fromAddress,
        name,
        email,
        subject,
        message,
        siteName
      )
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
