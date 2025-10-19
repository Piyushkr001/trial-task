// app/resumes/_components/ResumesSkeleton.tsx
"use client";

import * as React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResumesSkeleton() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="mt-1 h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-md" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
