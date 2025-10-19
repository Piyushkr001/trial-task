// app/resumes/_components/ResumesView.tsx
"use client";

import * as React from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  Card, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ResumesResponse } from "./types";
import NewResumeDialog from "./NewResumeDialog";
import UploadResumeDialog from "./UploadResumeDialog";
import AIDialog from "./AIDialog";
import ResumesSkeleton from "./ResumesSkeleton";
import EmptyState from "./EmptyState";
import ResumeCard from "./ResumeCard";


const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to load");
    return r.json() as Promise<ResumesResponse>;
  });

export default function ResumesView() {
  const { data, error, isLoading, mutate } = useSWR<ResumesResponse>("/api/resumes", fetcher, {
    revalidateOnFocus: false,
  });

  const resumes = data?.items ?? [];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <section className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your Resumes</h1>
          <p className="text-sm text-muted-foreground">
            Create with templates, upload existing resumes, and get AI suggestions to polish them.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <NewResumeDialog onDone={() => mutate()} />
          <UploadResumeDialog onDone={() => mutate()} />
          <AIDialog resumes={resumes} />
        </div>
      </section>

      <Separator />

      {/* Content */}
      {error ? (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle>Couldn’t load your resumes</CardTitle>
            <CardDescription>Please refresh or try again later.</CardDescription>
          </CardHeader>
        </Card>
      ) : isLoading ? (
        <ResumesSkeleton />
      ) : resumes.length === 0 ? (
        <EmptyState onRefresh={() => mutate()} />
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((r) => (
            <ResumeCard key={r.id} resume={r} />
          ))}
        </section>
      )}
    </main>
  );
}
