// app/resumes/_components/NewResumeDialog.tsx
"use client";

import * as React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";

const TEMPLATES: Array<{ key: "classic" | "modern" | "compact"; label: string }> = [
  { key: "classic", label: "Classic" },
  { key: "modern", label: "Modern" },
  { key: "compact", label: "Compact" },
];

export default function NewResumeDialog({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [template, setTemplate] = React.useState<"classic" | "modern" | "compact">("classic");
  const [isSaving, setIsSaving] = React.useState(false);

  async function handleCreate() {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, template }),
      });
      if (!res.ok) throw new Error("Failed");
      setOpen(false);
      setTitle("");
      onDone();
    } catch {
      alert("Could not create resume.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Resume
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a resume</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <label className="text-sm font-medium">Title</label>
          <Input
            placeholder="e.g., SDE Internship Resume"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="mt-2 text-sm font-medium">Template</label>
          <Select value={template} onValueChange={(v) => setTemplate(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Pick a template" />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((t) => (
                <SelectItem key={t.key} value={t.key}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isSaving || !title.trim()}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
