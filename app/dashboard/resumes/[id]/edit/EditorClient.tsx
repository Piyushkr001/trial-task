"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditorClient({ id, initialTitle }: { id: string; initialTitle: string }) {
  const [title, setTitle] = React.useState(initialTitle);
  const [saving, setSaving] = React.useState(false);
  const router = useRouter();

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} className="max-w-sm" />
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
