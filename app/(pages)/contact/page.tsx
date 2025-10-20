"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail, Phone, Clock, MapPin, Send, Check, ClipboardCopy,
  MessageSquare, ExternalLink, RefreshCw, Sparkles, Linkedin, Twitter
} from "lucide-react";
import { XLogo } from '@phosphor-icons/react';
type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

/** Simple Google Maps iframe embed (no API key). */
function MapEmbed({
  lat = 37.7749,
  lon = -122.4194,
  zoom = 13,
  label = "Our Office",
  className = "",
}: {
  lat?: number;
  lon?: number;
  zoom?: number;
  label?: string;
  className?: string;
}) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.02}%2C${lat-0.02}%2C${lon+0.02}%2C${lat+0.02}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <iframe
      title={label}
      aria-label={label}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={`h-full w-full ${className}`}
    />
  );
}

export default function ContactPage() {
  const [form, setForm] = React.useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [copied, setCopied] = React.useState<"email" | "phone" | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const supportEmail = "support@example.com";
  const supportPhone = "+1 (555) 555-5555";

  function onChange<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function validate(): string | null {
    if (!form.name.trim()) return "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email.";
    if (!form.subject.trim()) return "Please add a short subject.";
    if (form.message.trim().length < 30) return "Message is too short (min 30 characters).";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    // DESIGN-ONLY: simulate sending (replace with your API later)
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 800));
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function copy(text: string, which: "email" | "phone") {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(which);
      setTimeout(() => setCopied(null), 1200);
    });
  }

  // Change these coordinates to your location
  const LAT = 37.7749;    // San Francisco (example)
  const LON = -122.4194;  // San Francisco (example)
  const ZOOM = 13;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Contact us</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Questions, feedback, or partnership ideas? We’d love to hear from you.
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3.5 w-3.5" /> Usually replies in &lt; 24h
        </Badge>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left: Form */}
        <section className="w-full lg:w-2/3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
              <CardDescription>
                Fill in the form and our team will get back to you shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onSubmit}>
                {error ? (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                ) : null}
                {success ? (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Your message has been sent. We’ll reply to your email soon.
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="w-full">
                    <label className="mb-1 block text-sm font-medium" htmlFor="name">
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => onChange("name", e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="mb-1 block text-sm font-medium" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => onChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="subject">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={(e) => onChange("subject", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="message">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Share as many details as you can…"
                    className="min-h-[160px]"
                    value={form.message}
                    onChange={(e) => onChange("message", e.target.value)}
                  />
                  <div className="mt-1 text-right text-xs text-muted-foreground">
                    {form.message.length} / 2000
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setForm({ name: "", email: "", subject: "", message: "" })
                    }
                    disabled={submitting}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>

                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`mailto:${supportEmail}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email directly
                      </Link>
                    </Button>
                    <Button type="submit" disabled={submitting} className="gap-2">
                      {submitting ? (
                        <>
                          <Send className="h-4 w-4 animate-pulse" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send message
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Right: Contact info / FAQ */}
        <aside className="w-full lg:w-1/3">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact details</CardTitle>
                <CardDescription>
                  Prefer talking? Reach us using the info below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div className="text-sm">
                      <div className="font-medium">{supportEmail}</div>
                      <div className="text-muted-foreground">Support inbox</div>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Copy email"
                    onClick={() => copy(supportEmail, "email")}
                  >
                    {copied === "email" ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div className="text-sm">
                      <div className="font-medium">{supportPhone}</div>
                      <div className="text-muted-foreground">Mon–Fri</div>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Copy phone"
                    onClick={() => copy(supportPhone, "phone")}
                  >
                    {copied === "phone" ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Office hours</div>
                    <div className="text-muted-foreground">9:00–17:00 (local time)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Remote-first</div>
                    <div className="text-muted-foreground">Worldwide support coverage</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <Link href="#" aria-label="LinkedIn">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <Link href="#" aria-label="Twitter / X">
                      <XLogo className="h-4 w-4" />  X
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Map with real embed */}
            <Card>
              <CardHeader>
                <CardTitle>Our location</CardTitle>
                <CardDescription>We’re a remote-first team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md border bg-muted">
                  <MapEmbed lat={LAT} lon={LON} zoom={ZOOM} label="Company location map" />
                </div>
                <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${LAT},${LON}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    Open in Maps <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
