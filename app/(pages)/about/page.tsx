// app/dashboard/about/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Avatar, AvatarFallback, AvatarImage,
} from "@/components/ui/avatar";
import {
  Rocket, HeartHandshake, Target, Users, ShieldCheck, Sparkles, Gauge, LayoutTemplate, FileDown,
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { k: "10+", v: "Templates", icon: LayoutTemplate },
    { k: "100", v: "ATS Checks /day", icon: Gauge },
    { k: "1-click", v: "PDF Export", icon: FileDown },
    { k: "∞", v: "Revisions", icon: Sparkles },
  ] as const;

  const timeline = [
    {
      year: "2023",
      title: "Started the project",
      text: "We were frustrated by clunky resume tools. We wanted speed, clarity, and export-perfect PDFs.",
    },
    {
      year: "2024",
      title: "Editor + Templates",
      text: "Shipped a clean editor and the first set of polished, switchable templates.",
    },
    {
      year: "2025",
      title: "ATS & AI",
      text: "Introduced ATS scoring and smart suggestions to tailor resumes to each JD.",
    },
  ] as const;


  const values = [
    {
      key: "clarity",
      title: "Clarity over complexity",
      text: "Resumes should be quick to read and easy to compare. Our designs prioritize focus and hierarchy.",
      icon: Target,
    },
    {
      key: "privacy",
      title: "Privacy by default",
      text: "Your data stays yours. Tenant-scoped access and secure processing for uploads and exports.",
      icon: ShieldCheck,
    },
    {
      key: "impact",
      title: "Impact with integrity",
      text: "AI assists, you decide. We help quantify real outcomes—no fluff, no exaggerations.",
      icon: HeartHandshake,
    },
  ] as const;

  const stack = [
    "Next.js", "TypeScript", "Tailwind", "shadcn/ui", "Drizzle", "Postgres", "Vercel", "Lucide",
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center">
        <Badge variant="secondary" className="px-3 py-1">
          <Rocket className="mr-1 h-3.5 w-3.5" /> Our Story
        </Badge>
        <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          We’re building the fastest way to craft a <span className="text-primary">standout resume</span>
        </h1>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          From clean templates to ATS insights, we focus on the details that help you land interviews—without the
          busywork.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="gap-2">
            <Link href="/dashboard/templates">
              <LayoutTemplate className="h-4 w-4" /> Browse Templates
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard/ats-score">
              <Gauge className="h-4 w-4" /> Try ATS Checker
            </Link>
          </Button>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Stats (Flex responsive) */}
      <section className="flex flex-wrap gap-4">
        {stats.map((s) => (
          <div
            key={s.v}
            className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
          >
            <Card className="h-full">
              <CardContent className="flex items-center gap-3 p-6">
                <s.icon className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-xl font-semibold leading-tight">{s.k}</div>
                  <div className="text-sm text-muted-foreground">{s.v}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </section>

      {/* Mission */}
      <section className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-rose-600" />
              Our mission
            </CardTitle>
            <CardDescription>
              Help jobseekers communicate impact clearly—through elegant design and honest, data-backed storytelling.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            We believe great resumes are clear, scannable, and measurable. That’s why our editor encourages quantified
            bullets, our templates emphasize hierarchy, and our ATS checker highlights alignment. No gimmicks—just the
            shortest path to a strong application.
          </CardContent>
        </Card>
      </section>

      {/* Timeline (Flex responsive) */}
      <section className="mt-12">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">How we got here</h2>
          <p className="text-sm text-muted-foreground">Milestones on our way to a better resume builder.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          {timeline.map((t) => (
            <div
              key={t.year}
              className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.666rem)]"
            >
              <Card className="h-full">
                <CardHeader>
                  <Badge variant="outline">{t.year}</Badge>
                  <CardTitle className="text-base">{t.title}</CardTitle>
                  <CardDescription>{t.text}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Values (Accordion) */}
      <section className="mt-12">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Values we work by</h2>
          <p className="text-sm text-muted-foreground">Principles that shape our product and decisions.</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {values.map((v) => (
            <AccordionItem key={v.key} value={v.key}>
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <v.icon className="h-4 w-4 text-primary" />
                  <span>{v.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{v.text}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Stack badges */}
      <section className="mt-12">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">What we build with</h2>
          <p className="text-sm text-muted-foreground">A modern, reliable stack that ships fast.</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <Badge key={s} variant="secondary" className="px-3 py-1">
                  {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="mt-12">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-1 text-lg font-semibold">Ready to build your next resume?</div>
              <div className="text-sm text-muted-foreground">
                Start with a template, run an ATS check, and export a polished PDF.
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild className="gap-2">
                <Link href="/dashboard/templates">
                  <LayoutTemplate className="h-4 w-4" /> Choose a Template
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/dashboard/ats-score">
                  <Gauge className="h-4 w-4" /> Check ATS Score
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
