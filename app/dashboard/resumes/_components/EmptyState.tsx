// app/resumes/_components/EmptyState.tsx
"use client";

import * as React from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { LayoutTemplate } from "lucide-react";
import NewResumeDialog from "./NewResumeDialog";
import UploadResumeDialog from "./UploadResumeDialog";

export default function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 p-10 text-center">
      <LayoutTemplate className="h-6 w-6 text-muted-foreground" />
      <CardTitle className="text-lg">No resumes yet</CardTitle>
      <CardDescription>
        Create one with a template or upload an existing resume to get started.
      </CardDescription>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <NewResumeDialog onDone={onRefresh} />
        <UploadResumeDialog onDone={onRefresh} />
      </div>
    </Card>
  );
}
