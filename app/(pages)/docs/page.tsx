// app/dashboard/docs/page.tsx
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
  BookOpen, FileText, LayoutTemplate, Wand2, Download, Settings,
  ShieldCheck, AlertTriangle, HelpCircle, Link as LinkIcon, ChevronLeft, ChevronRight, Menu
} from "lucide-react";

/** -----------------------------------------
 * Redacted docs content (no internal routes or API snippets)
 * ---------------------------------------- */
type DocItem = {
  id: string;
  title: string;
  summary: string;
  contentHtml: string;
  tags?: string[];
};

type DocSection = {
  id: string;
  title: string;
  icon: React.ElementType;
  items: DocItem[];
};

const DOCS: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    items: [
      {
        id: "intro",
        title: "Introduction",
        summary: "What the app does and how to use the main features.",
        contentHtml: `
<h2>Welcome</h2>
<p>This app helps you build polished, ATS-friendly resumes. Explore template options, edit content with live preview, check an ATS-style score, and export to PDF.</p>
<p>Use the left navigation to browse topics or search the docs.</p>
`,
      },
      {
        id: "quick-start",
        title: "Quick Start",
        summary: "Create your first resume fast.",
        contentHtml: `
<h2>Quick Start</h2>
<ol>
  <li>Open the templates area and choose a design you like.</li>
  <li>Name your resume and create it.</li>
  <li>Open the editor to fill in your details.</li>
  <li>Export to PDF when you're done.</li>
</ol>
<p>Tip: Use clear section headings and concise bullets.</p>
`,
      },
    ],
  },
  {
    id: "templates",
    title: "Templates",
    icon: LayoutTemplate,
    items: [
      {
        id: "pick-template",
        title: "Choosing a Template",
        summary: "Differences between various designs.",
        contentHtml: `
<h2>Choosing a Template</h2>
<p>Templates vary in density, typography, and layout. Pick one that fits your experience and the role. You can switch later without losing your content.</p>
`,
      },
      {
        id: "preview-thumbs",
        title: "Previews",
        summary: "Why placeholders may appear and how to refresh.",
        contentHtml: `
<h2>Previews</h2>
<p>Previews update when you save key fields. If you see a placeholder, open your resume and save once to refresh the thumbnail.</p>
`,
      },
    ],
  },
  {
    id: "editor",
    title: "Editor",
    icon: FileText,
    items: [
      {
        id: "editing",
        title: "Editing Basics",
        summary: "Sections, bullets, and saving.",
        contentHtml: `
<h2>Editing Basics</h2>
<ul>
  <li>Use clear section headings (e.g., Summary, Experience, Skills).</li>
  <li>Prefer short, action-oriented bullets with measurable outcomes.</li>
  <li>Save regularly while you work.</li>
</ul>
`,
      },
      {
        id: "ai-suggestions",
        title: "AI Suggestions",
        summary: "Refine bullets and emphasize impact.",
        contentHtml: `
<h2>AI Suggestions</h2>
<p>Use AI assistance to tighten wording and add measurable results. Always verify accuracy before saving.</p>
`,
      },
    ],
  },
  {
    id: "ats",
    title: "ATS Checker",
    icon: Wand2,
    items: [
      {
        id: "ats-upload",
        title: "Upload & Extract",
        summary: "Supported files and best results.",
        contentHtml: `
<h2>Upload & Extract</h2>
<p>Upload your resume (PDF/DOCX/TXT/MD). For scanned PDFs, use a version with selectable text or run OCR first for best results.</p>
`,
      },
      {
        id: "ats-scoring",
        title: "Score Overview",
        summary: "What influences the score.",
        contentHtml: `
<h2>Score Overview</h2>
<p>The score blends keyword coverage, tech-skill density, basic formatting signals, and length range. Use the suggestions to improve alignment with the job description.</p>
`,
      },
    ],
  },
  {
    id: "export",
    title: "Export",
    icon: Download,
    items: [
      {
        id: "export-pdf",
        title: "Export to PDF",
        summary: "One-click export with a clean filename.",
        contentHtml: `
<h2>Export to PDF</h2>
<p>When your resume is ready, export to PDF directly from your resume. Use a concise title for a professional filename.</p>
`,
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    items: [
      {
        id: "profile",
        title: "Profile",
        summary: "Update your display name and photo.",
        contentHtml: `
<h2>Profile</h2>
<p>Adjust your display name and profile image in account settings. Changes reflect across your workspace.</p>
`,
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    icon: ShieldCheck,
    items: [
      {
        id: "auth",
        title: "Sign-in & Access",
        summary: "Protecting your content.",
        contentHtml: `
<h2>Sign-in & Access</h2>
<p>Your resume content is scoped to your account. Keep your login details secure and sign out on shared devices.</p>
`,
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: AlertTriangle,
    items: [
      {
        id: "common-issues",
        title: "Common Issues",
        summary: "Quick fixes for typical hiccups.",
        contentHtml: `
<h2>Common Issues</h2>
<ul>
  <li><strong>Preview not showing</strong>: Open the resume, make a small edit, and save.</li>
  <li><strong>Upload fails</strong>: Check file size/type and try again.</li>
  <li><strong>Export looks off</strong>: Ensure sections are filled and headings are consistent.</li>
</ul>
`,
      },
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    icon: HelpCircle,
    items: [
      {
        id: "general-faq",
        title: "General FAQ",
        summary: "Common questions, clear answers.",
        contentHtml: `
<h2>FAQ</h2>
<p><strong>Can I switch templates?</strong> Yes — your content is preserved.</p>
<p><strong>Is the ATS score exact?</strong> It’s directional. Always tailor your resume to each job description.</p>
<p><strong>Can I export multiple versions?</strong> Absolutely. Create variations for different roles and export each.</p>
`,
      },
    ],
  },
];

/** -----------------------------------------
 * Helpers
 * ---------------------------------------- */
function flatDocs() {
  const list: Array<{ section: DocSection; item: DocItem }> = [];
  for (const s of DOCS) for (const it of s.items) list.push({ section: s, item: it });
  return list;
}

function findByHash(hash: string) {
  const id = hash.replace(/^#/, "");
  for (const s of DOCS) {
    if (s.id === id) return { section: s, item: s.items[0] ?? null };
    for (const it of s.items) if (it.id === id) return { section: s, item: it };
  }
  return null;
}

function useHashSelection() {
  const [sel, setSel] = React.useState<{ section: DocSection; item: DocItem } | null>(null);
  React.useEffect(() => {
    const pick = () => {
      const h = window.location.hash || "";
      const found = findByHash(h);
      if (found) setSel(found);
      else setSel({ section: DOCS[0], item: DOCS[0].items[0] });
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, []);
  return [sel, setSel] as const;
}

function copyLink(id: string) {
  const url = `${window.location.origin}${window.location.pathname}#${id}`;
  navigator?.clipboard?.writeText(url).catch(() => {});
}

/** -----------------------------------------
 * Page
 * ---------------------------------------- */
export default function DocsPage() {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [sel, setSel] = useHashSelection();
  const [q, setQ] = React.useState("");

  const results = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return null;
    const out: Array<{ section: DocSection; item: DocItem }> = [];
    for (const section of DOCS) {
      for (const item of section.items) {
        const hay =
          `${section.title} ${item.title} ${item.summary} ${item.tags?.join(" ") ?? ""} ${item.contentHtml.replace(/<[^>]+>/g," ")}`.toLowerCase();
        if (hay.includes(s)) out.push({ section, item });
      }
    }
    return out;
  }, [q]);

  const flat = React.useMemo(() => flatDocs(), []);
  const idx = sel ? flat.findIndex((f) => f.item.id === sel.item.id) : -1;
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  function goTo(item: DocItem, section: DocSection) {
    window.location.hash = `#${item.id}`;
    setOpenSidebar(false);
    setSel({ section, item });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Top bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpenSidebar((v) => !v)}
            aria-label="Toggle docs navigation"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">Documentation</h1>
        </div>
        <div className="w-full max-w-md">
          <Input
            placeholder="Search docs…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <aside
          className={[
            "w-full lg:w-64 shrink-0",
            openSidebar ? "block" : "hidden lg:block",
          ].join(" ")}
        >
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Guides</CardTitle>
              <CardDescription>Browse by topic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {DOCS.map((section) => {
                const Icon = section.icon;
                const isActiveSection = sel?.section.id === section.id;
                return (
                  <div key={section.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <button
                        className={[
                          "text-sm font-medium",
                          isActiveSection ? "text-primary" : "",
                        ].join(" ")}
                        onClick={() => section.items[0] && goTo(section.items[0], section)}
                      >
                        {section.title}
                      </button>
                    </div>
                    <div className="ml-6 flex flex-col">
                      {section.items.map((item) => {
                        const active = sel?.item.id === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => goTo(item, section)}
                            className={[
                              "text-left text-sm py-1.5 px-2 rounded-md",
                              active ? "bg-muted font-medium" : "hover:bg-muted",
                            ].join(" ")}
                          >
                            {item.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <Separator />
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Templates</Badge>
                <Badge variant="secondary">Editor</Badge>
                <Badge variant="secondary">ATS</Badge>
                <Badge variant="secondary">Export</Badge>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Content */}
        <main className="flex-1">
          {/* Search results view */}
          {results && (
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Search Results</CardTitle>
                <CardDescription>
                  {results.length} match{results.length === 1 ? "" : "es"} for “{q}”
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col">
                {results.length === 0 ? (
                  <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
                    No results. Try different keywords.
                  </div>
                ) : (
                  results.map(({ section, item }) => (
                    <button
                      key={item.id}
                      onClick={() => goTo(item, section)}
                      className="mb-3 rounded-md border p-4 text-left hover:bg-muted"
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs uppercase text-muted-foreground">{section.title}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.summary}</p>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Selected doc view */}
          {sel && !results && (
            <article className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col">
                  <div className="text-xs uppercase text-muted-foreground">{sel.section.title}</div>
                  <h2 className="text-xl font-semibold">{sel.item.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => copyLink(sel.item.id)}
                  >
                    <LinkIcon className="h-4 w-4" /> Copy link
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/dashboard/changelog">Changelog</Link>
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none p-6">
                  <style dangerouslySetInnerHTML={{ __html: `
                    .prose h2 { margin-top: 0; }
                    .prose pre, .prose code { display:none !important; } /* hard redact code blocks */
                  `}} />
                  <div dangerouslySetInnerHTML={{ __html: sel.item.contentHtml }} />
                </CardContent>
              </Card>

              {/* Prev/Next */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  {prev ? (
                    <Button
                      variant="ghost"
                      className="gap-2"
                      onClick={() => goTo(prev.item, prev.section)}
                    >
                      <ChevronLeft className="h-4 w-4" /> {prev.item.title}
                    </Button>
                  ) : <span />}
                </div>
                <div>
                  {next ? (
                    <Button
                      variant="ghost"
                      className="gap-2"
                      onClick={() => goTo(next.item, next.section)}
                    >
                      {next.item.title} <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : <span />}
                </div>
              </div>
            </article>
          )}
        </main>
      </div>

      {/* Bottom CTA (generic, no paths shown to users) */}
      <div className="mt-10">
        <Card>
          <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold">Need more help?</div>
              <div className="text-sm text-muted-foreground">
                Explore templates, try the ATS checker, or see what's new.
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild><Link href="/dashboard/templates">Browse Templates</Link></Button>
              <Button asChild variant="outline"><Link href="/dashboard/ats-score">Try ATS Checker</Link></Button>
              <Button asChild variant="ghost"><Link href="/dashboard/changelog">Changelog</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
