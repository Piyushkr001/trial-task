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
import { LayoutTemplate, MoreHorizontal, FileText, Download } from "lucide-react";
import { Resume } from "./types";

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
  const BASE = "/dashboard/resumes";

  if (isImageUrl(r.previewUrl)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={r.previewUrl!}
        alt={`${r.title} preview`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    );
  }

  // Fallback: inline PDF preview using your export API
  // Works even when there's no previewUrl image available.
  return (
    <div className="relative h-full w-full">
      <iframe
        title={`${r.title} preview`}
        src={`/api/resumes/${r.id}/export#toolbar=0&navpanes=0&scrollbar=0`}
        className="h-full w-full"
        loading="lazy"
      />
    </div>
  );
}

export default function ResumeCard({ resume }: { resume: Resume }) {
  const r = resume;
  const BASE = "/dashboard/resumes";
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
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border bg-muted/30">
          {r.previewUrl || true ? (
            <Preview r={r} />
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <LayoutTemplate className="mb-2 h-6 w-6" />
              <span className="text-xs">No preview</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-2">
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
            <DropdownMenuContent align="end" className="w-44">
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
