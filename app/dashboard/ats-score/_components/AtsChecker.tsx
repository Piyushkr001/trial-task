"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, FileText, Target, Wand2, Lightbulb, Upload } from "lucide-react";

/** -------------------------------
 * Scoring utilities (simple, explainable)
 * -------------------------------- */
const STOPWORDS = new Set([
  "the","a","an","and","or","but","if","then","else","for","to","from","by","on","in","of","with","as","at","is","are","was","were","be","been","being","that","this","these","those","it","its","into","your","you",
]);

function normalizeText(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s\-+.]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s: string) {
  return normalizeText(s)
    .split(" ")
    .filter(Boolean)
    .filter((w) => !STOPWORDS.has(w));
}

function extractKeywords(jd: string, limit = 30) {
  const counts = new Map<string, number>();
  for (const w of tokenize(jd)) counts.set(w, (counts.get(w) ?? 0) + 1);
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

function scoreResume({ resume, jd }: { resume: string; jd: string }) {
  const resumeTokens = tokenize(resume);
  const resumeSet = new Set(resumeTokens);
  const jdKeywords = extractKeywords(jd, 30);

  const matched = jdKeywords.filter((k) => resumeSet.has(k));
  const keywordCoverage = (matched.length / Math.max(jdKeywords.length, 1)) * 55;

  const techish = jdKeywords.filter((k) =>
    /react|node|sql|python|typescript|docker|kubernetes|aws|gcp|azure|java|go|ci|cd|tailwind|next|graphql|api|microservice|redis|postgres|mongodb|django|flask|spring|kafka|spark|etl|ml|data|pipeline/i.test(
      k
    )
  );
  let techScore = 0;
  for (const t of techish) {
    const freq = resumeTokens.filter((w) => w === t).length;
    if (freq >= 3) techScore += 3;
    else if (freq === 2) techScore += 2;
    else if (freq === 1) techScore += 1;
  }
  techScore = Math.min(25, techScore);

  const bulletCount = (resume.match(/(^|\n)\s*[-•*]\s+/g) || []).length;
  const headings = (resume.match(/\n[A-Z][A-Za-z ]{2,}\n/g) || []).length;
  const formattingScore = Math.min(10, bulletCount * 1.5 + Math.min(4, headings));

  const words = resume.split(/\s+/g).filter(Boolean).length;
  let lengthScore = 10;
  if (words < 350) lengthScore = Math.max(0, 10 - Math.ceil((350 - words) / 50));
  if (words > 900) lengthScore = Math.max(0, 10 - Math.ceil((words - 900) / 75));

  const total = Math.round(keywordCoverage + techScore + formattingScore + lengthScore);
  const missing = jdKeywords.filter((k) => !resumeSet.has(k)).slice(0, 20);
  const matchedTop = matched.slice(0, 20);

  return {
    total: Math.max(0, Math.min(100, total)),
    parts: {
      keywords: Math.round(keywordCoverage),
      tech: Math.round(techScore),
      formatting: Math.round(formattingScore),
      length: Math.round(lengthScore),
    },
    matched: matchedTop,
    missing,
    allKeywords: jdKeywords,
  };
}

/** Gauge */
function Gauge({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const hue = (clamped * 120) / 100; // 0->red, 120->green
  const angle = (clamped / 100) * 360;
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative h-36 w-36 rounded-full"
        style={{
          background: `conic-gradient(hsl(${hue} 90% 45%) ${angle}deg, hsl(0 0% 90%) ${angle}deg 360deg)`,
        }}
        aria-label={`ATS score ${clamped}`}
      >
        <div className="absolute inset-2 rounded-full bg-background" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-semibold">{clamped}</div>
            <div className="text-xs text-muted-foreground">ATS Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AtsChecker() {
  const [resumeText, setResumeText] = React.useState("");
  const [jdText, setJdText] = React.useState("");
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [extracting, setExtracting] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<ReturnType<typeof scoreResume> | null>(null);

  function loadExample() {
    setError(null);
    setResumeText(
      `JANE DOE
Frontend Engineer — 5+ yrs
Skills: React, Next.js, TypeScript, Tailwind, Node, REST, GraphQL, CI/CD, Docker, AWS

EXPERIENCE
- Built React/Next.js apps with TypeScript, Tailwind, and GraphQL.
- Implemented CI/CD pipelines, Dockerized services, deployed to AWS.
- Collaborated on API design, caching (Redis), and performance optimization.

PROJECTS
- Micro-frontend platform; reduced build times by 40%.
- Analytics dashboard with charts, SSR, and accessibility compliance.`
    );
    setJdText(
      `We seek a Frontend Engineer skilled in React, Next.js, TypeScript, REST/GraphQL APIs, and cloud (AWS/GCP/Azure).
Responsibilities include UI development, CI/CD, Docker, and performance optimization.
Nice to have: Node.js, Redis, Tailwind, accessibility, microservices, Kubernetes.`
    );
    setFileName(null);
    setResult(null);
  }

  function reset() {
    setError(null);
    setResumeText("");
    setJdText("");
    setFileName(null);
    setResult(null);
  }

  async function handleUpload(file: File) {
    setError(null);
    setExtracting(true);
    setFileName(file.name);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/ats/extract", { method: "POST", body: fd });

      // Read JSON or text to surface detailed errors
      let data: any = null;
      const ctype = res.headers.get("content-type") || "";
      if (ctype.includes("application/json")) {
        data = await res.json().catch(() => null);
      } else {
        const txt = await res.text().catch(() => "");
        try { data = JSON.parse(txt); } catch { data = { error: txt || res.statusText }; }
      }

      if (!res.ok) {
        const msg = data?.error || data?.message || `Upload failed (${res.status})`;
        const extra = data?.detail?.message || data?.detail || "";
        throw new Error(extra ? `${msg} — ${extra}` : msg);
      }

      setResumeText(String(data?.text || "").slice(0, 200000));
    } catch (e: any) {
      setError(e?.message || "Failed to extract text from file.");
    } finally {
      setExtracting(false);
    }
  }

  async function analyze() {
    setLoading(true);
    setError(null);
    try {
      if (!resumeText || !jdText) {
        setResult(null);
        return;
      }
      const r = scoreResume({ resume: resumeText, jd: jdText });
      setResult(r);
    } finally {
      setLoading(false);
    }
  }

  const ready = !!resumeText && !!jdText;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Left: Inputs */}
      <div className="w-full lg:w-1/2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" /> Upload & Analyze
            </CardTitle>
            <CardDescription>
              Upload your resume file (PDF/DOCX/TXT) and paste the job description.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? (
              <Alert variant="destructive">
                <AlertTitle>Upload error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="resume-file">
                Resume File
              </label>
              <div className="flex items-center gap-2">
                <Input
                  id="resume-file"
                  type="file"
                  accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleUpload(f);
                  }}
                />
                {fileName ? (
                  <Badge variant="secondary" className="shrink-0">
                    <Upload className="mr-1 h-3.5 w-3.5" /> {fileName}
                  </Badge>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">
                Max 5MB. We extract text server-side for better accuracy (especially for PDFs/DOCX).
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Extracted Resume Text</label>
              <Textarea
                placeholder="The extracted resume text will appear here (you can edit it)…"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-[180px]"
                disabled={extracting}
              />
              {extracting && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Extracting…
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium">Job Description</label>
              <Textarea
                placeholder="Paste the job description here…"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                className="min-h-[160px]"
              />
            </div>

            <div className="flex justify-between gap-2 pt-2">
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={loadExample}>
                  <Wand2 className="mr-1 h-4 w-4" /> Load Example
                </Button>
                <Button variant="ghost" size="sm" onClick={reset}>
                  Reset
                </Button>
              </div>
              <Button onClick={analyze} disabled={!ready || loading || extracting} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                {loading ? "Analyzing…" : "Check ATS Score"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Results */}
      <div className="w-full lg:w-1/2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" /> Results & Suggestions
            </CardTitle>
            <CardDescription>Your ATS-style score and a breakdown of improvements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result ? (
              <Alert>
                <AlertTitle>No analysis yet</AlertTitle>
                <AlertDescription>
                  Upload your resume and paste the job description, then click <strong>Check ATS Score</strong>.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Score Gauge */}
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Gauge value={result.total} />
                  <div className="w-full max-w-sm space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Keyword Match</span>
                      <span className="font-medium">{result.parts.keywords}/55</span>
                    </div>
                    <Progress value={(result.parts.keywords / 55) * 100} />

                    <div className="flex items-center justify-between text-sm">
                      <span>Skills & Tech</span>
                      <span className="font-medium">{result.parts.tech}/25</span>
                    </div>
                    <Progress value={(result.parts.tech / 25) * 100} />

                    <div className="flex items-center justify-between text-sm">
                      <span>Formatting</span>
                      <span className="font-medium">{result.parts.formatting}/10</span>
                    </div>
                    <Progress value={(result.parts.formatting / 10) * 100} />

                    <div className="flex items-center justify-between text-sm">
                      <span>Length</span>
                      <span className="font-medium">{result.parts.length}/10</span>
                    </div>
                    <Progress value={(result.parts.length / 10) * 100} />
                  </div>
                </div>

                <Separator />

                {/* Keywords */}
                <div className="flex flex-col gap-4 lg:flex-row">
                  <div className="w-full lg:w-1/2">
                    <h3 className="mb-2 text-sm font-medium">Matched Keywords</h3>
                    {result.matched.length ? (
                      <div className="flex flex-wrap gap-2">
                        {result.matched.map((k) => (
                          <Badge key={k} variant="secondary" className="capitalize">
                            {k}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No strong matches yet.</p>
                    )}
                  </div>

                  <div className="w-full lg:w-1/2">
                    <h3 className="mb-2 text-sm font-medium">Missing Keywords</h3>
                    {result.missing.length ? (
                      <div className="flex flex-wrap gap-2">
                        {result.missing.map((k) => (
                          <Badge key={k} variant="outline" className="capitalize">
                            {k}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nice! You’ve covered the top JD keywords.</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Suggestions */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Suggestions</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {result.parts.keywords < 40 && (
                      <li>
                        Add more <strong>role-specific keywords</strong> from the JD naturally in your summary and experience bullets.
                      </li>
                    )}
                    {result.parts.tech < 18 && (
                      <li>
                        Emphasize <strong>tech stack</strong> with quantified context (e.g., “Built Next.js SSR app, reduced TTFB 35%”).
                      </li>
                    )}
                    {result.parts.formatting < 8 && (
                      <li>
                        Improve readability: use <strong>bullets</strong>, clear <strong>section headings</strong>, and consistent punctuation.
                      </li>
                    )}
                    {result.parts.length < 7 && (
                      <li>
                        Adjust resume length to about <strong>350–900 words</strong>, prioritizing recent and relevant experience.
                      </li>
                    )}
                    {result.missing.length > 0 && (
                      <li>
                        Weave in missing keywords (e.g.,{" "}
                        <em>{result.missing.slice(0, 5).join(", ")}</em>) where you truly have experience.
                      </li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
