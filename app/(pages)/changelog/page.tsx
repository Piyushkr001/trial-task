// app/dashboard/changelog/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Megaphone, Sparkles, Calendar, Link as LinkIcon,
  PlusCircle, Wrench, Bug, Trash2, Filter, Rss,
} from "lucide-react";

type ChangeGroup = {
  added?: string[];
  changed?: string[];
  fixed?: string[];
  removed?: string[];
};

type Release = {
  version: string;          // "v1.3.0"
  date: string;             // ISO string
  highlights?: string[];    // short bullets for the top of card
  changes: ChangeGroup;
  tags?: ("added" | "changed" | "fixed" | "removed")[];
};

const RELEASES: Release[] = [
  {
    version: "v1.3.0",
    date: "2025-10-18",
    highlights: [
      "ATS Score Checker uploads now 2× faster",
      "New Executive & Timeline templates",
    ],
    tags: ["added", "changed", "fixed"],
    changes: {
      added: [
        "New **Executive** and **Timeline** resume templates.",
        "Changelog page (this one!) with search, filters, and shareable anchors.",
      ],
      changed: [
        "ATS extraction pipeline tuned for better PDF text fidelity.",
        "Template gallery now shows consistent three-up layout on large screens.",
      ],
      fixed: [
        "Resolved 404 when duplicating a resume then routing to /edit.",
        "Fixed cropping on preview thumbnails for tall pages.",
      ],
    },
  },
  {
    version: "v1.2.0",
    date: "2025-09-28",
    highlights: ["Template gallery search & count"],
    tags: ["added", "fixed"],
    changes: {
      added: [
        "Search box for template gallery with real-time filtering.",
        "Keyboard shortcuts: **⌘/Ctrl+S** to save draft in editor.",
      ],
      fixed: ["Badge contrast in dark mode for Minimal template."],
    },
  },
  {
    version: "v1.1.0",
    date: "2025-09-10",
    highlights: ["AI suggestions v1"],
    tags: ["added", "changed"],
    changes: {
      added: [
        "AI Suggestions panel for bullet improvements and quantified impact prompts.",
      ],
      changed: [
        "Export flow shows filename derived from resume title.",
        "Improved error states for missing permissions.",
      ],
    },
  },
  {
    version: "v1.0.3",
    date: "2025-08-23",
    tags: ["fixed"],
    changes: {
      fixed: [
        "Resolved flicker on first render of template previews.",
        "Fix: 'No preview' placeholder alignment on mobile.",
      ],
    },
  },
  {
    version: "v1.0.2",
    date: "2025-08-14",
    tags: ["changed"],
    changes: {
      changed: [
        "Polished spacing + typography across all templates.",
        "Reduced default PDF margins for more content per page.",
      ],
    },
  },
  {
    version: "v1.0.0",
    date: "2025-08-01",
    highlights: ["Initial public release"],
    tags: ["added", "removed"],
    changes: {
      added: [
        "Modern, Minimal, Classic, Tech, Creative, Compact templates.",
        "Editor with live preview, duplication, and PDF export.",
        "Account & onboarding flow.",
      ],
      removed: ["Deprecated legacy prototype routes."],
    },
  },
];

const TAG_META: Record<
  NonNullable<Release["tags"]>[number],
  { label: string; icon: React.ElementType; color: string }
> = {
  added:   { label: "Added",   icon: PlusCircle, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  changed: { label: "Changed", icon: Wrench,     color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  fixed:   { label: "Fixed",   icon: Bug,        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  removed: { label: "Removed", icon: Trash2,     color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function anchorFromVersion(v: string) {
  return v.replace(/\./g, "-").toLowerCase(); // e.g., v1-3-0
}

function SectionTitle({
  title,
  icon: Icon,
  hint,
}: { title: string; icon: React.ElementType; hint?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export default function ChangelogPage() {
  const [q, setQ] = React.useState("");
  const [activeTags, setActiveTags] = React.useState<Set<keyof typeof TAG_META>>(new Set());

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    return RELEASES.filter((r) => {
      // Tag filter
      if (activeTags.size > 0) {
        const tags = new Set(r.tags ?? []);
        let ok = false;
        activeTags.forEach((t) => { if (tags.has(t)) ok = true; });
        if (!ok) return false;
      }
      if (!s) return true;
      const base =
        `${r.version} ${r.date} ${(r.highlights || []).join(" ")} ` +
        `${(r.changes.added || []).join(" ")} ${(r.changes.changed || []).join(" ")} ` +
        `${(r.changes.fixed || []).join(" ")} ${(r.changes.removed || []).join(" ")}`;
      return base.toLowerCase().includes(s);
    });
  }, [q, activeTags]);

  function toggleTag(tag: keyof typeof TAG_META) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  function copyAnchor(v: string) {
    const id = anchorFromVersion(v);
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator?.clipboard?.writeText(url).catch(() => {});
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      {/* Hero */}
      <section className="space-y-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Badge variant="secondary" className="px-3 py-1">
            <Megaphone className="mr-1 h-3.5 w-3.5" /> Product updates
          </Badge>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            What’s new in your resume builder
          </h2>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            Follow along as we ship improvements to templates, editor, ATS scoring, and export.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild className="gap-2">
              <Link href="/dashboard/templates">
                <Sparkles className="h-4 w-4" /> Try new templates
              </Link>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="#">
                <Rss className="h-4 w-4" /> RSS
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Controls */}
      <section className="space-y-3">
        <SectionTitle title="Releases" icon={Filter} hint={`${filtered.length} visible`} />
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full max-w-xs">
            <Input placeholder="Search releases…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(TAG_META) as Array<keyof typeof TAG_META>).map((t) => {
              const meta = TAG_META[t];
              const active = activeTags.has(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={[
                    "inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm transition-colors",
                    active
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted",
                  ].join(" ")}
                >
                  <meta.icon className="h-3.5 w-3.5" />
                  {meta.label}
                </button>
              );
            })}
            {activeTags.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTags(new Set())}
                className="ml-1"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Releases list (Flex responsive) */}
      <section className="mt-6">
        <div className="flex flex-wrap gap-4">
          {filtered.map((r) => {
            const id = anchorFromVersion(r.version);
            return (
              <div
                key={r.version}
                id={id}
                className="w-full" // one-per-row for readability; change to cards-in-rows by adjusting widths
              >
                <Card className="overflow-hidden">
                  <CardHeader className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{r.version}</CardTitle>
                        <Badge variant="outline" className="gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(r.date)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {(r.tags ?? []).map((t) => {
                          const meta = TAG_META[t];
                          const Icon = meta.icon;
                          return (
                            <span
                              key={t}
                              className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${meta.color}`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              {meta.label}
                            </span>
                          );
                        })}
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Copy link"
                          onClick={() => copyAnchor(r.version)}
                        >
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {r.highlights && r.highlights.length > 0 && (
                      <CardDescription>
                        {r.highlights.map((h, i) => (
                          <span key={i} className="mr-2 inline-block">
                            • {h}
                          </span>
                        ))}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-5">
                    {r.changes.added && r.changes.added.length > 0 && (
                      <ChangeBlock title="Added" icon={PlusCircle} items={r.changes.added} />
                    )}
                    {r.changes.changed && r.changes.changed.length > 0 && (
                      <ChangeBlock title="Changed" icon={Wrench} items={r.changes.changed} />
                    )}
                    {r.changes.fixed && r.changes.fixed.length > 0 && (
                      <ChangeBlock title="Fixed" icon={Bug} items={r.changes.fixed} />
                    )}
                    {r.changes.removed && r.changes.removed.length > 0 && (
                      <ChangeBlock title="Removed" icon={Trash2} items={r.changes.removed} />
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="w-full rounded-md border bg-card p-8 text-center text-sm text-muted-foreground">
              No matching releases. Try clearing filters or changing your search.
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mt-10">
        <Card>
          <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold">Want to see what’s next?</div>
              <div className="text-sm text-muted-foreground">
                Check out templates, editor updates, and ATS improvements as they ship.
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/dashboard/templates">Browse Templates</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/ats-score">Try ATS Checker</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ChangeBlock({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: React.ElementType;
  items: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {items.map((line, i) => (
          <li key={i} className="[&_strong]:font-semibold" dangerouslySetInnerHTML={{ __html: line }} />
        ))}
      </ul>
    </div>
  );
}
