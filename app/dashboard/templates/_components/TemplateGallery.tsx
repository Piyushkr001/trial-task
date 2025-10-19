"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, LayoutTemplate, Sparkles } from "lucide-react";

// --- Template catalog (10 templates) ---
type Template = {
  slug: string;
  name: string;
  blurb: string;
  accent: string;   // Tailwind color class for accent sections
  tone: "neutral" | "color" | "mono";
};

const TEMPLATES: Template[] = [
  { slug: "modern",     name: "Modern",     blurb: "Clean headings, subtle accents.",    accent: "text-sky-600",     tone: "neutral" },
  { slug: "classic",    name: "Classic",    blurb: "Traditional serif look.",            accent: "text-amber-700",   tone: "neutral" },
  { slug: "minimal",    name: "Minimal",    blurb: "Lots of whitespace, simple grid.",   accent: "text-zinc-700",    tone: "mono"    },
  { slug: "elegant",    name: "Elegant",    blurb: "Thin rules and refined spacing.",    accent: "text-rose-600",    tone: "color"   },
  { slug: "tech",       name: "Tech",       blurb: "Two-column, tag chips, metrics.",    accent: "text-indigo-600",  tone: "color"   },
  { slug: "creative",   name: "Creative",   blurb: "Bolder headings, playful accents.",  accent: "text-violet-600",  tone: "color"   },
  { slug: "compact",    name: "Compact",    blurb: "Dense layout for more content.",     accent: "text-teal-700",    tone: "neutral" },
  { slug: "executive",  name: "Executive",  blurb: "Subtle, sober, polished.",           accent: "text-slate-700",   tone: "mono"    },
  { slug: "timeline",   name: "Timeline",   blurb: "Vertical timeline for experience.",  accent: "text-emerald-600", tone: "color"   },
  { slug: "twocol",     name: "Two-Column", blurb: "Strong sidebar with details.",       accent: "text-cyan-700",    tone: "neutral" },
];

// --- Faux preview block (no images required) ---
function TemplatePreview({ t }: { t: Template }) {
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-md border bg-card">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className={`font-semibold ${t.accent}`}>{t.name}</div>
        <div className="text-xs text-muted-foreground">1 page</div>
      </div>

      {/* Content area */}
      <div className="flex h-[calc(100%-40px)]">
        {/* Sidebar (for two-col styles) */}
        <div className="hidden w-1/3 border-r p-3 md:block">
          <div className={`mb-2 h-3 w-24 rounded ${t.tone === "color" ? "bg-muted" : "bg-muted/60"}`} />
          <div className={`mb-3 h-2 w-32 rounded ${t.tone === "color" ? "bg-muted" : "bg-muted/60"}`} />
          <div className="space-y-2">
            <div className="h-2 w-3/4 rounded bg-muted/60" />
            <div className="h-2 w-2/3 rounded bg-muted/60" />
            <div className="h-2 w-1/2 rounded bg-muted/60" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-2 w-20 rounded bg-muted" />
            <div className="flex flex-wrap gap-1.5">
              <span className="h-4 rounded bg-muted px-2 text-[10px] leading-4">React</span>
              <span className="h-4 rounded bg-muted px-2 text-[10px] leading-4">TypeScript</span>
              <span className="h-4 rounded bg-muted px-2 text-[10px] leading-4">Node</span>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full ${t.tone === "color" ? "bg-muted" : "bg-muted/60"}`} />
            <div>
              <div className={`h-3 w-32 rounded ${t.tone === "color" ? "bg-muted" : "bg-muted/60"}`} />
              <div className="mt-1 h-2 w-24 rounded bg-muted/60" />
            </div>
          </div>

          <div className="my-2 h-2 w-28 rounded bg-muted" />

          <div className="space-y-2">
            <div className="h-2 w-full rounded bg-muted/60" />
            <div className="h-2 w-11/12 rounded bg-muted/60" />
            <div className="h-2 w-4/5 rounded bg-muted/60" />
          </div>

          <div className="mt-3 h-2 w-28 rounded bg-muted" />
          <div className="mt-2 space-y-2">
            <div className="h-2 w-10/12 rounded bg-muted/60" />
            <div className="h-2 w-9/12 rounded bg-muted/60" />
            <div className="h-2 w-8/12 rounded bg-muted/60" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Card ---
function TemplateCard({
  t,
  onUse,
  busy,
}: {
  t: Template;
  onUse: (tmpl: Template) => void;
  busy: boolean;
}) {
  return (
    <Card className="h-full flex w-full flex-col overflow-hidden">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t.name}</CardTitle>
          <Badge variant="secondary" className="gap-1">
            <LayoutTemplate className="h-3.5 w-3.5" /> Template
          </Badge>
        </div>
        <CardDescription>{t.blurb}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        <TemplatePreview t={t} />

        <div className="mt-auto flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Accent: <span className={`${t.accent} font-medium`}>●</span>
          </div>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => onUse(t)}
            disabled={busy}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {busy ? "Creating…" : "Use template"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Gallery with search + 3-col grid on large screens ---
export default function TemplateGallery() {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [busySlug, setBusySlug] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return TEMPLATES;
    return TEMPLATES.filter(
      (t) =>
        t.name.toLowerCase().includes(s) ||
        t.slug.toLowerCase().includes(s) ||
        t.blurb.toLowerCase().includes(s)
    );
  }, [q]);

  async function handleUse(t: Template) {
    try {
      setBusySlug(t.slug);
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: t.slug,
          title: `${t.name} Resume`,
        }),
      });
      if (!res.ok) throw new Error(`Create failed (${res.status})`);
      const data = await res.json().catch(() => ({}));
      const id = data?.id;
      if (id) router.push(`/dashboard/resumes/${id}/edit`);
      else router.push("/dashboard/resumes");
    } catch (e) {
      console.error(e);
      alert("Could not create resume. Please try again.");
    } finally {
      setBusySlug(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Input
            placeholder="Search templates…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {filtered.length} template{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* ✅ Grid: 1 col (mobile), 2 cols (sm+), 3 cols (lg+) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <TemplateCard
            key={t.slug}
            t={t}
            onUse={handleUse}
            busy={busySlug === t.slug}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="w-full rounded-md border bg-card p-8 text-center text-sm text-muted-foreground">
          No templates match “{q}”.
        </div>
      )}
    </div>
  );
}
