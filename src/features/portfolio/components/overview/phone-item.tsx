"use client"

import { PhoneIcon } from "lucide-react"

import { decodePhoneNumber, formatPhoneNumber } from "@/utils/string"

import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "./intro-item"

type PhoneItemProps = {
  phoneNumber: string
}

export function PhoneItem({ phoneNumber }: PhoneItemProps) {
  const phoneNumberDecoded = decodePhoneNumber(phoneNumber)

  return (
    <IntroItem>
      <IntroItemIcon>
        <PhoneIcon />
      </IntroItemIcon>

      <IntroItemContent>
        <IntroItemLink
          href={`tel:${phoneNumberDecoded}`}
          aria-label={`Call ${formatPhoneNumber(phoneNumberDecoded)}`}
        >
          {formatPhoneNumber(phoneNumberDecoded)}
        </IntroItemLink>
      </IntroItemContent>
    </IntroItem>
  )
}
