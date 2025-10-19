// app/dashboard/features/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sparkles, LayoutTemplate, FileDown, Gauge, Eye, Edit3, History, Users, ShieldCheck, Rocket,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: Sparkles,
      title: "AI Suggestions",
      blurb: "Improve bullets, quantify impact, and tailor content to the role.",
      accent: "text-violet-600",
    },
    {
      icon: LayoutTemplate,
      title: "Beautiful Templates",
      blurb: "Pick from 10+ polished templates and switch any time.",
      accent: "text-sky-600",
    },
    {
      icon: FileDown,
      title: "One-click Export",
      blurb: "Export to PDF with crisp typography and perfect spacing.",
      accent: "text-emerald-600",
    },
    {
      icon: Gauge,
      title: "ATS Score",
      blurb: "Upload your resume, paste a JD, and get a clear ATS score.",
      accent: "text-amber-600",
    },
    {
      icon: Eye,
      title: "Live Preview",
      blurb: "Instantly see every change in a distraction-free preview.",
      accent: "text-cyan-600",
    },
    {
      icon: Edit3,
      title: "Rich Editor",
      blurb: "Smart sections, drag-to-reorder, and inline formatting.",
      accent: "text-rose-600",
    },
    {
      icon: History,
      title: "Version History",
      blurb: "Save snapshots, compare revisions, and roll back safely.",
      accent: "text-slate-700",
    },
    {
      icon: Users,
      title: "Share & Feedback",
      blurb: "Share view links and collect comments from peers.",
      accent: "text-teal-700",
    },
    {
      icon: ShieldCheck,
      title: "Privacy First",
      blurb: "Your data stays yours with secure, tenant-scoped access.",
      accent: "text-zinc-700",
    },
  ] as const;

  const steps = [
    { k: "01", title: "Pick a Template", text: "Choose a starting point that matches your style." },
    { k: "02", title: "Import or Paste", text: "Upload your resume or paste content into the editor." },
    { k: "03", title: "Optimize & Export", text: "Run ATS check, apply AI suggestions, export as PDF." },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center">
        <Badge variant="secondary" className="px-3 py-1">
          <Rocket className="mr-1 h-3.5 w-3.5" /> What you get
        </Badge>
        <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need to craft a <span className="text-primary">standout resume</span>
        </h1>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          Design, optimize, and export professional resumes in minutes. Built for real-world job hunts —
          fast, flexible, and ATS-aware.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="gap-2">
            <Link href="/dashboard/ats-score">
              <Gauge className="h-4 w-4" /> Try ATS Checker
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard/templates">
              <LayoutTemplate className="h-4 w-4" /> Browse Templates
            </Link>
          </Button>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Feature Cards (Flex responsive) */}
      <section>
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Core Features</h2>
            <p className="text-sm text-muted-foreground">
              Powerful tools wrapped in a simple, elegant interface.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="
                w-full
                md:w-[calc(50%-0.5rem)]
                lg:w-[calc(33.333%-0.666rem)]
              "
            >
              <Card className="h-full">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2">
                    <f.icon className={`h-5 w-5 ${f.accent}`} />
                    <CardTitle className="text-base">{f.title}</CardTitle>
                  </div>
                  <CardDescription>{f.blurb}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
                    Tip: combine with <span className="font-medium">AI Suggestions</span> for best results.
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-12">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">How it works</h2>
          <p className="text-sm text-muted-foreground">
            Get from blank page to polished PDF in three simple steps.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {steps.map((s) => (
            <div
              key={s.k}
              className="
                w-full
                md:w-[calc(50%-0.5rem)]
                lg:w-[calc(33.333%-0.666rem)]
              "
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-2 p-6">
                  <div className="text-sm text-muted-foreground">{s.k}</div>
                  <div className="text-lg font-medium">{s.title}</div>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Use-cases Tabs */}
      <section className="mt-12">
        <Tabs defaultValue="candidate" className="w-full">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Built for everyone</h2>
              <p className="text-sm text-muted-foreground">
                Switch perspectives to see how it helps in your role.
              </p>
            </div>
            <TabsList>
              <TabsTrigger value="candidate">Candidate</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="candidate">
            <div className="flex flex-wrap gap-4">
              <div className="w-full lg:w-[calc(50%-0.5rem)]">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Land more interviews</CardTitle>
                    <CardDescription>
                      Tailor your resume to each JD with keyword insights and AI-assisted bullets.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <ul className="list-disc pl-5">
                      <li>Run ATS checks to gauge JD alignment.</li>
                      <li>Quantify achievements with smart prompts.</li>
                      <li>Export polished PDFs recruiters can skim quickly.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full lg:w-[calc(50%-0.5rem)]">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Stay organized</CardTitle>
                    <CardDescription>
                      Versions, templates, and quick duplicates for each application.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <ul className="list-disc pl-5">
                      <li>Snapshot and compare revisions.</li>
                      <li>Switch templates without rewriting content.</li>
                      <li>Keep role-specific variants side by side.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recruiter">
            <div className="flex flex-wrap gap-4">
              <div className="w-full lg:w-[calc(50%-0.5rem)]">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Faster screening</CardTitle>
                    <CardDescription>
                      Clear sections, measurable outcomes, and consistent formatting.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <ul className="list-disc pl-5">
                      <li>Readable PDFs with strong information hierarchy.</li>
                      <li>Standardized structure across candidates.</li>
                      <li>Reduced ambiguity around impact and scope.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full lg:w-[calc(50%-0.5rem)]">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Collaborative review</CardTitle>
                    <CardDescription>
                      Share links, annotate, and give targeted feedback quickly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <ul className="list-disc pl-5">
                      <li>Comment on specific bullets or sections.</li>
                      <li>Tailor guidance to the job description.</li>
                      <li>Keep all versions and comments organized.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Frequently asked questions</h2>
          <p className="text-sm text-muted-foreground">
            Quick answers to common questions about templates, ATS, and exports.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ats">
            <AccordionTrigger>How accurate is the ATS score?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              We check keyword coverage, tech signals, length, and basic formatting to approximate common ATS filters.
              Use it as a guide alongside your judgment—optimize wording where it’s truthful and relevant.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="templates">
            <AccordionTrigger>Can I switch templates later?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Yes. Your content is separate from the design. Switch templates at any time—your sections and bullets stay intact.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="export">
            <AccordionTrigger>Do exported PDFs preserve layout?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Exports use a consistent typographic system to ensure spacing and alignment look great across viewers.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="privacy">
            <AccordionTrigger>How is my data protected?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Access is tenant-scoped and we never share your data. You can delete resumes and versions at any time.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
