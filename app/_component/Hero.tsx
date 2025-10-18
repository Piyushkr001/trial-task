import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Shield,
  FileText,
  Wand2,
  LayoutTemplate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/* ------------------------- Branding & Section Heading ------------------------ */

function BrandMark() {
  // Uses your SVG asset; swap path if needed
  return (
    <Image
      src="/Images/Logo/logo.svg"
      alt="TrialTask Logo"
      width={140}
      height={140}
      priority
    />
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      {eyebrow ? (
        <Badge variant="secondary" className="mb-2">
          {eyebrow}
        </Badge>
      ) : null}
      <h2 className="text-balance text-3xl font-bold sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-2 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

/* --------------------------------- Previews --------------------------------- */

type TemplateVariant = "classic" | "modern" | "compact";

function Line({
  w = "100%",
  h = "0.5rem",
  className = "",
}: {
  w?: string;
  h?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded bg-muted ${className}`}
      style={{ width: w, height: h }}
    />
  );
}

function BulletList({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-2 flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Line key={i} w={`${90 - i * 8}%`} h="0.4rem" />
      ))}
    </div>
  );
}

function ResumePreview({ variant }: { variant: TemplateVariant }) {
  return (
    <div className="aspect-[210/297] w-full overflow-hidden rounded-md border bg-background shadow-sm">
      {/* CLASSIC: sidebar + content */}
      {variant === "classic" && (
        <div className="flex h-full">
          {/* Sidebar */}
          <aside className="flex w-[32%] flex-col gap-4 border-r p-4">
            <div>
              <Line w="70%" />
              <Line w="55%" className="mt-2" />
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                CONTACT
              </div>
              <BulletList count={3} />
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                SKILLS
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground"
                  >
                    Skill
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                EDUCATION
              </div>
              <BulletList count={2} />
            </div>
          </aside>

          {/* Main */}
          <div className="flex flex-1 flex-col gap-5 p-5">
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                SUMMARY
              </div>
              <BulletList count={3} />
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                EXPERIENCE
              </div>
              <div className="mt-2 space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i}>
                    <Line w="65%" />
                    <BulletList count={3} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">
                PROJECTS
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="rounded border p-3">
                  <Line w="70%" />
                  <BulletList count={2} />
                </div>
                <div className="rounded border p-3">
                  <Line w="70%" />
                  <BulletList count={2} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODERN: gradient header + two columns */}
      {variant === "modern" && (
        <div className="flex h-full flex-col">
          {/* Header */}
          <div
            className="p-5 text-white"
            style={{
              background:
                "linear-gradient(135deg, #7C3AED 0%, #5B9DFF 55%, #06B6D4 100%)",
            }}
          >
            <div className="max-w-none">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-white/90" />
                <div className="flex flex-col">
                  <div className="h-4 w-40 rounded bg-white/90" />
                  <div className="mt-1 h-3 w-28 rounded bg-white/70" />
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <div className="h-2 w-20 rounded bg-white/70" />
                <div className="h-2 w-24 rounded bg-white/70" />
                <div className="h-2 w-16 rounded bg-white/70" />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="grid flex-1 grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-xs font-medium text-muted-foreground">
                  SUMMARY
                </div>
                <BulletList count={4} />
              </div>
              <div className="rounded-md border p-4">
                <div className="text-xs font-medium text-muted-foreground">
                  SKILLS
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground"
                    >
                      Skill
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-xs font-medium text-muted-foreground">
                  EXPERIENCE
                </div>
                <div className="mt-2 space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i}>
                      <Line w="70%" />
                      <BulletList count={3} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-xs font-medium text-muted-foreground">
                  PROJECTS
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div className="rounded border p-3">
                    <Line w="75%" />
                    <BulletList count={2} />
                  </div>
                  <div className="rounded border p-3">
                    <Line w="75%" />
                    <BulletList count={2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPACT: single column, dense */}
      {variant === "compact" && (
        <div className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-center gap-3">
            <Line w="28%" h="1.2rem" />
            <Line w="16%" h="0.8rem" />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              SUMMARY
            </div>
            <BulletList count={3} />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              EXPERIENCE
            </div>
            <div className="mt-2 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Line w="62%" />
                  <BulletList count={2} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              PROJECTS
            </div>
            <div className="mt-2 space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i}>
                  <Line w="58%" />
                  <BulletList count={2} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              SKILLS
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground"
                >
                  Skill
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------- Landing Page ------------------------------- */

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col">
      {/* Subtle gradient blobs for professional polish */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute left-1/2 top-[-10%] h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(124,58,237,0.18), transparent)",
          }}
        />
        <div
          className="absolute right-[-10%] bottom-[-10%] h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(6,182,212,0.15), transparent)",
          }}
        />
      </div>

      {/* HERO */}
      <section className="px-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 py-16 md:flex-row md:justify-between md:py-24">
          {/* Left copy */}
          <div className="flex max-w-2xl flex-col">
            <div className="mb-4 flex items-center gap-2">
              <BrandMark />
            </div>

            <h1 className="text-balance text-4xl font-bold sm:text-5xl">
              Build a{" "}
              <span className="bg-gradient-to-br from-violet-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                Dynamic, Verified
              </span>{" "}
              Resume in minutes.
            </h1>
            <p className="mt-4 max-w-[62ch] text-muted-foreground">
              Auto-generate a professional summary, customize your layout, and
              keep experiences verified and up-to-date across internships,
              courses, projects, and hackathons.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/get-started">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">See Features</Link>
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Export-ready templates</span>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <Shield className="h-4 w-4 text-cyan-600" />
                <span>Verification-first design</span>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <Card className="w-full max-w-xl border-0 shadow-lg backdrop-blur md:w-[520px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BrandMark />
                Live Resume Preview
              </CardTitle>
              <CardDescription>
                Change sections, theme, and content in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Wand2 className="h-3.5 w-3.5" /> AI Summary
                  </Badge>
                  <Badge variant="outline">A4</Badge>
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-3/5 rounded bg-muted" />
                  <div className="h-3 w-2/5 rounded bg-muted" />
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="h-2.5 w-full rounded bg-muted" />
                  <div className="h-2.5 w-11/12 rounded bg-muted" />
                  <div className="h-2.5 w-10/12 rounded bg-muted" />
                </div>
                <div className="mt-4 flex gap-3">
                  <div className="h-20 flex-1 rounded bg-muted" />
                  <div className="h-20 flex-1 rounded bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-4 py-12 sm:py-16">
        <SectionHeading
          eyebrow="Why TrialTask?"
          title="Everything you need to craft a standout resume"
          description="From AI-assisted summaries to verified credentials, TrialTask is your end-to-end resume system."
        />
        <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 md:mt-10 md:flex-row">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-violet-600" />
                AI-generated Professional Summary
              </CardTitle>
              <CardDescription>
                Condense your experience into crisp impact lines in seconds.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Choose tone (concise, impact, leadership), and inject directly
              into your header.
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutTemplate className="h-5 w-5 text-sky-600" />
                Live Preview & Templates
              </CardTitle>
              <CardDescription>
                See changes as you type, pick layouts, and export clean PDFs.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Toggle sections, reorder blocks, and switch themes without leaving
              the page.
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-600" />
                Verification-ready Records
              </CardTitle>
              <CardDescription>
                Attach credentials and keep skills and courses verifiable.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Link certificates, add sources, and build trust with recruiters
              automatically.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="px-4 py-12 sm:py-16">
        <SectionHeading
          eyebrow="How it works"
          title="From profile to polished PDF in three steps"
        />
        <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-4 md:flex-row">
          {[
            {
              icon: FileText,
              title: "1. Import",
              desc: "Add roles, projects, courses, and skills—or start with sample data.",
            },
            {
              icon: Wand2,
              title: "2. Summarize",
              desc: "Let AI craft a professional summary and bullet points you can tweak.",
            },
            {
              icon: LayoutTemplate,
              title: "3. Preview & Export",
              desc: "Pick a template, toggle sections, and export an ATS-friendly PDF.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="flex-1">
              <CardHeader className="flex flex-row items-center gap-3">
                <Badge variant="secondary" className="shrink-0">
                  {title.split(".")[0]}
                </Badge>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />{" "}
                  {title.split(". ").slice(1).join(". ")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* TEMPLATES (with Preview) */}
      <section id="templates" className="px-4 py-12 sm:py-16">
        <SectionHeading
          eyebrow="Templates"
          title="Clean, recruiter-friendly templates"
          description="Pick a style that matches your personality and industry—without sacrificing readability."
        />
        <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-4 md:mt-10 md:flex-row">
          {[
            {
              name: "Classic",
              variant: "classic" as const,
              desc: "Two-column with a structured sidebar.",
            },
            {
              name: "Modern",
              variant: "modern" as const,
              desc: "Gradient header, carded sections, bold look.",
            },
            {
              name: "Compact",
              variant: "compact" as const,
              desc: "Single column, dense, ATS-friendly.",
            },
          ].map(({ name, variant, desc }) => (
            <Card key={name} className="flex-1 transition hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutTemplate className="h-5 w-5" /> {name}
                </CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ResumePreview variant={variant} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16">
        <Card className="mx-auto flex max-w-5xl flex-col items-center gap-4 border-0 p-8 text-center shadow-lg md:flex-row md:justify-between md:text-left">
          <div className="flex max-w-xl flex-col">
            <h3 className="text-2xl font-semibold">
              Ready to build your best resume?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Start free, generate your summary with AI, and export a polished
              PDF today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/get-started">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/docs">Read Docs</Link>
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
}
