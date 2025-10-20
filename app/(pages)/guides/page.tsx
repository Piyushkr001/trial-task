"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  BookOpen, Rocket, Search, LayoutTemplate, Printer, GaugeCircle,
  Wand2, ShieldCheck, Upload, GitBranch, Wrench
} from "lucide-react";

// ----------------------
// Guide data
// ----------------------
type Guide = {
  slug: string;
  title: string;
  summary: string;
  category: "Getting Started" | "Resumes" | "ATS" | "Design" | "Export" | "AI" | "Security" | "Integrations" | "Advanced";
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string; // e.g., "5 min"
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  featured?: boolean;
};

const GUIDES: Guide[] = [
  {
    slug: "quickstart",
    title: "Quick Start",
    summary: "Create your first resume in minutes using ready-made templates.",
    category: "Getting Started",
    level: "Beginner",
    duration: "4 min",
    icon: Rocket,
    featured: true,
  },
  {
    slug: "choose-template",
    title: "Choosing a Template",
    summary: "Compare template styles and pick the right one for your role.",
    category: "Design",
    level: "Beginner",
    duration: "6 min",
    icon: LayoutTemplate,
    featured: true,
  },
  {
    slug: "format-like-a-pro",
    title: "Formatting Like a Pro",
    summary: "Headline, sections, and bullet writing that recruiters love.",
    category: "Resumes",
    level: "Intermediate",
    duration: "8 min",
    icon: Wrench,
    featured: true,
  },
  {
    slug: "ats-basics",
    title: "ATS Basics",
    summary: "How Applicant Tracking Systems parse and score your resume.",
    category: "ATS",
    level: "Beginner",
    duration: "7 min",
    icon: GaugeCircle,
  },
  {
    slug: "ats-optimization",
    title: "ATS Optimization",
    summary: "Targeted keywords, structure, and content tuning for higher matches.",
    category: "ATS",
    level: "Intermediate",
    duration: "9 min",
    icon: Wand2,
  },
  {
    slug: "export-pdf",
    title: "Exporting to PDF",
    summary: "High-quality PDF export with selectable text and crisp typography.",
    category: "Export",
    level: "Beginner",
    duration: "5 min",
    icon: Printer,
  },
  {
    slug: "ai-assist",
    title: "Using AI Suggestions",
    summary: "Brainstorm bullets, refine summaries, and adapt to a job post.",
    category: "AI",
    level: "Intermediate",
    duration: "6 min",
    icon: BookOpen,
  },
  {
    slug: "privacy-security",
    title: "Privacy & Security",
    summary: "Understand data handling, permissions, and safe collaboration.",
    category: "Security",
    level: "Beginner",
    duration: "5 min",
    icon: ShieldCheck,
  },
  {
    slug: "import-existing",
    title: "Import Existing Resume",
    summary: "Upload PDF/DOCX/TXT and convert into an editable draft.",
    category: "Resumes",
    level: "Beginner",
    duration: "4 min",
    icon: Upload,
  },
  {
    slug: "integrations",
    title: "Integrations",
    summary: "Connect with storage and job platforms for a smoother workflow.",
    category: "Integrations",
    level: "Advanced",
    duration: "10 min",
    icon: GitBranch,
  },
];

// Derive filters
const CATEGORIES = Array.from(new Set(GUIDES.map((g) => g.category))).sort();
const LEVELS: Guide["level"][] = ["Beginner", "Intermediate", "Advanced"];

// ----------------------
// Components
// ----------------------
function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      className="rounded-full"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function GuideCard({ g }: { g: Guide }) {
  const Icon = g.icon;
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{g.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{g.level}</Badge>
            <Badge variant="outline">{g.duration}</Badge>
          </div>
        </div>
        <CardDescription className="line-clamp-2">{g.summary}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="h-4 w-4" />
          <span>{g.category}</span>
        </div>
        {/* Wire up your routing here (e.g., router.push or <Link href={`/guides/${g.slug}`}>). 
            Using a hash to avoid exposing structure by default. */}
        <Button asChild size="sm" className="w-full">
          <Link href={`#${g.slug}`}>Open Guide</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function GuidesPage() {
  const [q, setQ] = React.useState("");
  const [selectedCats, setSelectedCats] = React.useState<Set<string>>(new Set());
  const [selectedLvls, setSelectedLvls] = React.useState<Set<string>>(new Set());

  function toggle(setter: React.Dispatch<React.SetStateAction<Set<string>>>, key: string) {
    setter((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    return GUIDES.filter((g) => {
      const catOK = selectedCats.size === 0 || selectedCats.has(g.category);
      const lvlOK = selectedLvls.size === 0 || selectedLvls.has(g.level);
      const textOK =
        !term ||
        g.title.toLowerCase().includes(term) ||
        g.summary.toLowerCase().includes(term) ||
        g.category.toLowerCase().includes(term) ||
        g.level.toLowerCase().includes(term);
      return catOK && lvlOK && textOK;
    }).sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [q, selectedCats, selectedLvls]);

  const featured = filtered.filter((g) => g.featured);
  const rest = filtered.filter((g) => !g.featured);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Guides</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Step-by-step walkthroughs to help you build standout resumes and ace ATS checks.
            </p>
          </div>
        </div>
        <Badge variant="secondary">New content weekly</Badge>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/3">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-base">Search & Filters</CardTitle>
              <CardDescription>Find the perfect guide quickly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guides…"
                  className="pl-8"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <FilterPill
                      key={c}
                      active={selectedCats.has(c)}
                      onClick={() => toggle(setSelectedCats, c)}
                    >
                      {c}
                    </FilterPill>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Level</div>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((l) => (
                    <FilterPill
                      key={l}
                      active={selectedLvls.has(l)}
                      onClick={() => toggle(setSelectedLvls, l)}
                    >
                      {l}
                    </FilterPill>
                  ))}
                </div>
              </div>

              {(selectedCats.size > 0 || selectedLvls.size > 0 || q) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setQ("");
                    setSelectedCats(new Set());
                    setSelectedLvls(new Set());
                  }}
                >
                  Clear filters
                </Button>
              )}

              <Separator />

              <Alert>
                <AlertTitle>Tip</AlertTitle>
                <AlertDescription>
                  New to resumes? Start with <span className="font-medium">Quick Start</span> and{" "}
                  <span className="font-medium">ATS Basics</span>.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-2/3">
          {/* Featured */}
          {featured.length > 0 && (
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Featured</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                {featured.map((g) => (
                  <div
                    key={g.slug}
                    className="
                      w-full
                      sm:w-[calc(50%-0.5rem)]
                      xl:w-[calc(50%-0.5rem)]
                    "
                  >
                    <GuideCard g={g} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Guides */}
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">All Guides</h2>
            <span className="text-sm text-muted-foreground">({filtered.length})</span>
          </div>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No guides match your filters.
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-wrap gap-4">
              {rest.map((g) => (
                <div
                  key={g.slug}
                  className="
                    w-full
                    sm:w-[calc(50%-0.5rem)]
                    xl:w-[calc(33.333%-0.666rem)]
                  "
                >
                  <GuideCard g={g} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
