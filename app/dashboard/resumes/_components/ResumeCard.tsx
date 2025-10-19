// app/resumes/_components/ResumeCard.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutTemplate, MoreHorizontal, FileText, Download, Eye } from "lucide-react";
import { Resume } from "./types";

const BASE = "/dashboard/resumes";

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const isImageUrl = (url?: string | null) =>
  !!url && /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(url);

function Preview({ r }: { r: Resume }) {
  // If you’ve stored a generated image preview, show it.
  if (isImageUrl(r.previewUrl)) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={r.previewUrl!}
        alt={`${r.title} preview`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    );
  }

  // Fallback: inline PDF (server export)
  return (
    <iframe
      title={`${r.title} preview`}
      src={`/api/resumes/${r.id}/export#toolbar=0&navpanes=0&scrollbar=0`}
      className="h-full w-full"
      loading="lazy"
    />
  );
}

export default function ResumeCard({ resume }: { resume: Resume }) {
  const r = resume;
  const [dupLoading, setDupLoading] = React.useState(false);

  async function handleDuplicate() {
    try {
      setDupLoading(true);
      const res = await fetch(`/api/resumes/${r.id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error(`Duplicate failed: ${res.status}`);
      const data = await res.json();
      window.location.href = `${BASE}/${data.id}/edit`;
    } catch (err) {
      console.error(err);
      alert("Could not duplicate resume. Please try again.");
    } finally {
      setDupLoading(false);
    }
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">{r.title}</CardTitle>
          <Badge variant="secondary" className="capitalize">{r.template}</Badge>
        </div>
        <CardDescription>Updated {formatWhen(r.updatedAt)}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        {/* Preview area with hover overlay → Preview page */}
        <div className="group relative aspect-[4/3] overflow-hidden rounded-md border bg-muted/30">
          <Preview r={r} />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/10 group-hover:opacity-100">
            <Button asChild size="sm" className="pointer-events-auto">
              <Link href={`${BASE}/${r.id}/preview`}>
                <LayoutTemplate className="mr-2 h-4 w-4" /> Open Preview
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`${BASE}/${r.id}/preview`}>
                <Eye className="mr-2 h-4 w-4" /> Preview
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`${BASE}/${r.id}/edit`}>
                <FileText className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/api/resumes/${r.id}/export`} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" /> Export
              </Link>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="More actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`${BASE}/${r.id}/preview`}>Preview</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`${BASE}/${r.id}`}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  if (!dupLoading) void handleDuplicate();
                }}
              >
                {dupLoading ? "Duplicating..." : "Duplicate"}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`${BASE}/${r.id}/ai`}>AI Suggestions</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
