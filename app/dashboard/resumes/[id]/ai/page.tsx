"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ResumeAI() {
  const { id } = useParams<{ id: string }>();
  const [notes, setNotes] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [output, setOutput] = React.useState<string[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function runAI() {
    setLoading(true);
    setError(null);
    setOutput(null);
    try {
      const res = await fetch(`/api/resumes/${id}/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error(`AI failed: ${res.status}`);
      const data = await res.json();
      setOutput(Array.isArray(data) ? data : data?.suggestions ?? null);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">AI Suggestions</h1>
        <Button asChild variant="outline">
          <Link href={'/dashboard/resumes'}>Back</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Give the AI some context (optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="E.g., target SDE-1 roles; emphasize leadership and recent achievements."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button onClick={runAI} disabled={loading}>
            {loading ? "Generating..." : "Generate Suggestions"}
          </Button>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {error && <div className="text-sm text-destructive">{error}</div>}
      {output && (
        <Card>
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {output.map((line, i) => (
                <li key={i} className="mb-1">
                  {line}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
