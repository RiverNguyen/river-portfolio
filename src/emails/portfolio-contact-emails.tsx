import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import type { ReactNode } from "react"

const fontSans =
  "Inter,ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif"

const styles = {
  main: {
    margin: 0,
    padding: 0,
    minHeight: "100%",
    backgroundColor: "#f4f1ec",
    fontFamily: fontSans,
    fontSize: "16px",
    lineHeight: "1.65",
    color: "#18181b",
    WebkitFontSmoothing: "antialiased" as const,
  },
  container: {
    maxWidth: "620px",
    margin: "0 auto",
    padding: "42px 18px",
  },
  card: {
    backgroundColor: "#fffdf9",
    borderRadius: "24px",
    overflow: "hidden" as const,
    border: "1px solid #e7dfd2",
    boxShadow: "0 18px 46px rgba(87,64,38,0.12)",
  },
  accentBar: {
    height: "4px",
    backgroundColor: "#18181b",
  },
  headerStrip: {
    backgroundColor: "#fffdf9",
    padding: "34px 38px 28px",
    textAlign: "left" as const,
    borderBottom: "1px solid #eee7dc",
  },
  brandRow: {
    margin: "0 0 28px",
  },
  brandMark: {
    display: "block" as const,
    width: "54px",
    height: "54px",
    borderRadius: "16px",
  },
  eyebrow: {
    display: "block" as const,
    margin: "0 0 12px",
    color: "#71717a",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
  },
  headerTitle: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 800,
    letterSpacing: "-0.045em",
    color: "#18181b",
    lineHeight: "1.12",
  },
  headerSub: {
    margin: "12px 0 0",
    fontSize: "15px",
    color: "#57534e",
    lineHeight: "1.68",
    maxWidth: "500px",
  },
  content: {
    padding: "34px 38px 38px",
    backgroundColor: "#fffdf9",
  },
  heading: {
    margin: "0 0 10px",
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: "-0.035em",
    color: "#18181b",
    lineHeight: "1.25",
  },
  headingMuted: {
    margin: "0 0 26px",
    fontSize: "15px",
    color: "#78716c",
    fontWeight: 400,
    lineHeight: "1.68",
  },
  lead: {
    margin: "0 0 24px",
    fontSize: "15px",
    color: "#57534e",
    lineHeight: "1.75",
    maxWidth: "100%",
  },
  panel: {
    margin: "0 0 28px",
    padding: 0,
    backgroundColor: "#ffffff",
    border: "1px solid #eee7dc",
    borderRadius: "18px",
    overflow: "hidden" as const,
  },
  fieldRow: {
    margin: 0,
    padding: "17px 18px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #f0ebe3",
  },
  fieldLabel: {
    display: "block" as const,
    margin: "0 0 7px",
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "uppercase" as const,
    letterSpacing: "0.12em",
    color: "#a8a29e",
  },
  fieldValue: {
    margin: 0,
    fontSize: "15px",
    color: "#18181b",
    fontWeight: 700,
    lineHeight: "1.5",
    wordBreak: "break-word" as const,
  },
  link: {
    color: "#18181b",
    textDecoration: "none",
    fontWeight: 800,
    borderBottom: "1px solid #a8a29e",
  },
  messageBox: {
    margin: "12px 0 0",
    padding: "24px 26px",
    backgroundColor: "#faf7f2",
    borderRadius: "18px",
    border: "1px solid #eee7dc",
    borderLeft: "4px solid #18181b",
    fontSize: "15px",
    lineHeight: "1.78",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    color: "#292524",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #eee7dc",
    margin: "30px 0",
  },
  footer: {
    marginTop: "26px",
    fontSize: "13px",
    color: "#78716c",
    lineHeight: "1.65",
  },
  replyHint: {
    display: "block" as const,
    margin: 0,
    padding: "15px 17px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    fontSize: "13px",
    color: "#57534e",
    border: "1px solid #eee7dc",
    lineHeight: "1.6",
  },
  button: {
    display: "inline-block",
    margin: "6px 0 0",
    padding: "12px 18px",
    backgroundColor: "#18181b",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 800,
  },
  signature: {
    marginTop: "30px",
    fontWeight: 700,
    color: "#18181b",
    fontSize: "17px",
    letterSpacing: "-0.01em",
  },
} as const

function ContactEmailLayout({
  documentTitle,
  preview,
  headerTitle,
  headerSub,
  logoUrl,
  children,
}: {
  documentTitle: string
  preview: string
  headerTitle: string
  headerSub: string
  logoUrl: string
  children: ReactNode
}) {
  return (
    <Html lang="en">
      <Head>
        <title>{documentTitle}</title>
      </Head>
      <Preview>{preview}</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.card}>
            <Section style={styles.accentBar} />
            <Section style={styles.headerStrip}>
              <Section style={styles.brandRow}>
                <Img
                  alt={`${documentTitle} logo`}
                  height={54}
                  src={logoUrl}
                  style={styles.brandMark}
                  width={54}
                />
              </Section>
              <Text style={styles.eyebrow}>Portfolio Contact</Text>
              <Heading as="h1" style={styles.headerTitle}>
                {headerTitle}
              </Heading>
              <Text style={styles.headerSub}>{headerSub}</Text>
            </Section>
            <Section style={styles.content}>{children}</Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export function PortfolioContactOwnerEmail({
  logoUrl,
  name,
  email,
  subject,
  message,
}: {
  logoUrl: string
  name: string
  email: string
  subject: string
  message: string
}) {
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`

  return (
    <ContactEmailLayout
      documentTitle={`Contact: ${subject}`}
      headerSub={`${name} sent a message through your contact form.`}
      headerTitle="New message in your inbox"
      logoUrl={logoUrl}
      preview={`${name}: ${subject}`}
    >
      <Heading as="h2" style={styles.heading}>
        New contact message
      </Heading>
      <Text style={styles.headingMuted}>
        A visitor just reached out from your portfolio. The reply-to address is
        already set, or you can use the quick reply button below.
      </Text>
      <Section style={styles.panel}>
        <Section style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>From</Text>
          <Text style={styles.fieldValue}>
            {name} <span style={{ color: "#94a3b8", fontWeight: 500 }}>/</span>{" "}
            <Link href={`mailto:${email}`} style={styles.link}>
              {email}
            </Link>
          </Text>
        </Section>
        <Section style={{ ...styles.fieldRow, borderBottom: "none" }}>
          <Text style={styles.fieldLabel}>Subject</Text>
          <Text style={styles.fieldValue}>{subject}</Text>
        </Section>
      </Section>
      <Section>
        <Text style={styles.fieldLabel}>Message</Text>
        <Text style={styles.messageBox}>{message}</Text>
      </Section>
      <Text style={styles.footer}>
        <span style={styles.replyHint}>
          <strong style={{ color: "#18181b" }}>Tip:</strong> Hit reply to answer
          directly from your email client.
        </span>
      </Text>
      <Button href={mailtoHref} style={styles.button}>
        Reply to {name}
      </Button>
    </ContactEmailLayout>
  )
}

export function PortfolioContactUserConfirmationEmail({
  logoUrl,
  name,
  message,
  siteName,
}: {
  logoUrl: string
  name: string
  message: string
  siteName: string
}) {
  return (
    <ContactEmailLayout
      documentTitle="We received your message"
      headerSub="Thanks for reaching out. I will get back to you soon."
      headerTitle="Message received"
      logoUrl={logoUrl}
      preview="Your portfolio contact message was delivered."
    >
      <Heading as="h2" style={styles.heading}>
        Thanks, {name}
      </Heading>
      <Text style={styles.headingMuted}>
        Your message landed safely in my inbox. I will read it and reply when I
        can.
      </Text>
      <Text style={styles.lead}>
        No need to resend anything. I included a copy of your note below so you
        have it for your records.
      </Text>
      <Hr style={styles.divider} />
      <Section>
        <Text style={styles.fieldLabel}>Your message</Text>
        <Text style={styles.messageBox}>{message}</Text>
      </Section>
      <Text style={styles.signature}>
        Warm regards,
        <br />
        <span style={{ color: "#18181b" }}>{siteName}</span>
      </Text>
    </ContactEmailLayout>
  )
}
