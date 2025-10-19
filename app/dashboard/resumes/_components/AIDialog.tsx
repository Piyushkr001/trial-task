// app/resumes/_components/AIDialog.tsx
"use client";

import * as React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Wand2, Loader2 } from "lucide-react";
import { Resume } from "./types";

export default function AIDialog({ resumes }: { resumes: Resume[] }) {
  const [open, setOpen] = React.useState(false);
  const [resumeId, setResumeId] = React.useState<string>("");
  const [notes, setNotes] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSuggest() {
    if (!resumeId) return;
    setIsLoading(true);
    setSuggestions("");
    try {
      const res = await fetch("/api/resumes/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, notes }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = (await res.json()) as { suggestions: string };
      setSuggestions(json.suggestions);
    } catch {
      setSuggestions("Could not generate suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    if (!open) {
      setResumeId("");
      setNotes("");
      setSuggestions("");
      setIsLoading(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <Wand2 className="h-4 w-4" /> AI Suggestions
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Get AI suggestions</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Select a resume</label>
            <Select value={resumeId} onValueChange={setResumeId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a resume" />
              </SelectTrigger>
              <SelectContent>
                {resumes.length === 0 ? (
                  <div className="px-2 py-1 text-sm text-muted-foreground">No resumes found</div>
                ) : (
                  resumes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.title} · <span className="capitalize">{r.template}</span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Context (optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add role, target company, or any constraints…"
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Suggestions</label>
            <div className="rounded-md border p-3">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-4 w-3/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : suggestions ? (
                <pre className="whitespace-pre-wrap text-sm">{suggestions}</pre>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Choose a resume and click <strong>Generate</strong> to see suggestions here.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={handleSuggest} disabled={!resumeId || isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
