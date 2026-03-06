"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Send } from "lucide-react"
import { useTranslations } from "next-intl"
import type { SubmitHandler } from "react-hook-form"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

type ContactFormValues = {
  name: string
  email: string
  subject: string
  message: string
}

const defaultValues: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
}

export function Contact() {
  const t = useTranslations("Contact")

  const contactSchema = z.object({
    name: z.string().min(1, t("validation.nameRequired")).max(200),
    email: z.string().email(t("validation.emailInvalid")),
    subject: z.string().min(1, t("validation.subjectRequired")).max(200),
    message: z.string().min(1, t("validation.messageRequired")).max(5000),
  })

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  })

  const onSubmit: SubmitHandler<ContactFormValues> = async (values) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error((data as { error?: string }).error ?? t("toast.sendFail"))
        return
      }

      toast.success(t("toast.sendSuccess"))
      form.reset(defaultValues)
    } catch {
      toast.error(t("toast.sendFail"))
    }
  }

  return (
    <Panel id="contact">
      <PanelHeader>
        <PanelTitle>{t("title")}</PanelTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </PanelHeader>

      <PanelContent className="px-4 sm:px-6">
        <div className="rounded-xl border border-edge bg-card/50 px-4 py-6 shadow-sm sm:px-6 sm:py-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("fields.name")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("placeholders.name")}
                        className="h-10 rounded-lg border-input/80 bg-background/80 transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("fields.email")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("placeholders.email")}
                        className="h-10 rounded-lg border-input/80 bg-background/80 transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("fields.subject")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("placeholders.subject")}
                        className="h-10 rounded-lg border-input/80 bg-background/80 transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t("fields.message")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("placeholders.message")}
                        rows={5}
                        className="min-h-28 resize-y rounded-lg border-input/80 bg-background/80 transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col items-start gap-2 sm:col-span-2 sm:flex-row sm:items-center">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="h-11 rounded-lg px-6 font-medium shadow-sm transition-all hover:shadow focus-visible:ring-2 focus-visible:ring-ring/20"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {t("actions.sending")}
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      {t("actions.send")}
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {t("note")}
                </p>
              </div>
            </form>
          </Form>
        </div>
      </PanelContent>
    </Panel>
  )
}
