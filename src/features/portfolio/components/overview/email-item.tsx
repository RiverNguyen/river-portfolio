"use client"

import { MailIcon } from "lucide-react"

import { decodeEmail } from "@/utils/string"

import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "./intro-item"

type EmailItemProps = {
  email: string
}

export function EmailItem({ email }: EmailItemProps) {
  const emailDecoded = decodeEmail(email)

  return (
    <IntroItem>
      <IntroItemIcon>
        <MailIcon />
      </IntroItemIcon>

      <IntroItemContent>
        <IntroItemLink
          href={`mailto:${emailDecoded}`}
          aria-label={`Send email to ${emailDecoded}`}
        >
          {emailDecoded}
        </IntroItemLink>
      </IntroItemContent>
    </IntroItem>
  )
}
