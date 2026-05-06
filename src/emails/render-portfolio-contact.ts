import { render } from "@react-email/render"
import { createElement } from "react"

import {
  PortfolioContactOwnerEmail,
  PortfolioContactUserConfirmationEmail,
} from "@/emails/portfolio-contact-emails"

export async function renderPortfolioContactEmails(
  logoUrl: string,
  name: string,
  email: string,
  subject: string,
  message: string,
  siteName: string
) {
  return Promise.all([
    render(
      createElement(PortfolioContactOwnerEmail, {
        logoUrl,
        name,
        email,
        subject,
        message,
      })
    ),
    render(
      createElement(PortfolioContactUserConfirmationEmail, {
        logoUrl,
        name,
        message,
        siteName,
      })
    ),
  ])
}
