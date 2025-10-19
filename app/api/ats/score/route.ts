import { NextResponse } from "next/server";
export const runtime = "nodejs";

const STOPWORDS = new Set(["the","a","an","and","or","but","if","then","else","for","to","from","by","on","in","of","with","as","at","is","are","was","were","be","been","being","that","this","these","those","it","its","into","your","you"]);
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s\-+.]/gu, " ").replace(/\s+/g, " ").trim();
const tok = (s: string) => norm(s).split(" ").filter(Boolean).filter((w) => !STOPWORDS.has(w));
const extractKeywords = (jd: string, limit = 30) => {
  const counts = new Map<string, number>();
  for (const w of tok(jd)) counts.set(w, (counts.get(w) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([w]) => w);
};

function scoreResume(resume: string, jd: string) {
  const resumeTokens = tok(resume);
  const resumeSet = new Set(resumeTokens);
  const jdKeywords = extractKeywords(jd, 30);

  const matched = jdKeywords.filter((k) => resumeSet.has(k));
  const keywordCoverage = (matched.length / Math.max(jdKeywords.length, 1)) * 55;

  const techish = jdKeywords.filter((k) =>
    /react|node|sql|python|typescript|docker|kubernetes|aws|gcp|azure|java|go|ci|cd|tailwind|next|graphql|api|microservice|redis|postgres|mongodb|django|flask|spring|kafka|spark|etl|ml|data|pipeline/i.test(k)
  );
  let techScore = 0;
  for (const t of techish) {
    const freq = resumeTokens.filter((w) => w === t).length;
    techScore += freq >= 3 ? 3 : freq === 2 ? 2 : freq === 1 ? 1 : 0;
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

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const resume = String(body?.resume || "");
  const jd = String(body?.jd || "");
  if (!resume || !jd) {
    return NextResponse.json({ error: "Provide { resume, jd }." }, { status: 400 });
  }
  const result = scoreResume(resume, jd);
  return NextResponse.json(result);
}
