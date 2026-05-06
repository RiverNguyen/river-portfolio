import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { Resend } from "resend"
import { z } from "zod"

import { renderPortfolioContactEmails } from "@/emails/render-portfolio-contact"
import { USER } from "@/features/portfolio/data/user"
import { decodeEmail } from "@/utils/string"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(5000),
})

export type ContactBody = z.infer<typeof contactSchema>

/** Shown in inbox “From” when RESEND_FROM is only an email address. */
const RESEND_FROM_DISPLAY_NAME = "River Nguyen"

/** RFC5322-style From with display name so clients show "Name" instead of raw email. */
function normalizeResendFrom(raw: string): string {
  const trimmed = raw.trim()
  if (/<\s*[^\s>]+\s*>/.test(trimmed)) return trimmed
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return `${RESEND_FROM_DISPLAY_NAME} <${trimmed}>`
  }
  return trimmed
}

const gmailUser = process.env.GMAIL_USER
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD
const resendApiKey = process.env.RESEND_API_KEY
const resendFrom = process.env.RESEND_FROM
  ? normalizeResendFrom(process.env.RESEND_FROM)
  : "Portfolio <onboarding@resend.dev>"
const siteUrl = (process.env.APP_URL ?? USER.website).replace(/\/$/, "")
const logoUrl = `${siteUrl}/logo.png`

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

  const [ownerHtml, userHtml] = await renderPortfolioContactEmails(
    logoUrl,
    name,
    email,
    subject,
    message,
    siteName
  )

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
  const [ownerHtml, userConfirmationHtml] = await renderPortfolioContactEmails(
    logoUrl,
    name,
    email,
    subject,
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

    const useGmail = Boolean(gmailUser && gmailAppPassword)
    const useResend = Boolean(resendApiKey)

    if (!useGmail && !useResend) {
      return NextResponse.json(
        {
          error:
            "Email service is not configured. Set GMAIL_USER + GMAIL_APP_PASSWORD or RESEND_API_KEY.",
        },
        { status: 503 }
      )
    }

    let sent = false

    if (useResend) {
      try {
        await sendWithResend(
          ownerEmail,
          name,
          email,
          subject,
          message,
          siteName
        )
        sent = true
      } catch (resendErr) {
        console.warn(
          "[Contact] Resend failed, will try Gmail if configured:",
          resendErr
        )
        if (!useGmail) throw resendErr
      }
    }

    if (!sent && useGmail) {
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
