"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { resumeSchema, type ResumeJSON, defaultResume } from "@/lib/resume-types";
import CustomizerPanel, { SectionToggleState } from "./CustomizerPanel";
import ResumePreview from "./ResumePreview";
import TemplatePicker, { ResumeTemplate } from "./TemplatePicker";
import { Loader2, Printer, Save } from "lucide-react";

export default function PreviewBuilder({ resumeId }: { resumeId: string }) {
  const [data, setData] = useState<ResumeJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [template, setTemplate] = useState<ResumeTemplate>("minimal");
  const [accent, setAccent] = useState<string>("#2563eb");
  const [toggles, setToggles] = useState<SectionToggleState>({
    summary: true, experience: true, projects: true, skills: true, education: true, achievements: true,
  });

  useEffect(() => {
    // Try a future API: /api/resumes/:id/data; otherwise use defaults
    (async () => {
      try {
        const res = await fetch(`/api/resumes/${resumeId}/data`, { cache: "no-store" });
        if (!res.ok) throw new Error("no api");
        const json = await res.json();
        const parsed = resumeSchema.safeParse(json);
        setData(parsed.success ? parsed.data : defaultResume);
      } catch {
        setData(defaultResume);
      } finally {
        setLoading(false);
      }
    })();
  }, [resumeId]);

  async function save() {
    if (!data) return;
    const parsed = resumeSchema.safeParse(data);
    if (!parsed.success) return alert("Validation failed");
    try {
      setSaving(true);
      // Future: implement this API in backend
      const res = await fetch(`/api/resumes/${resumeId}/data`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(await res.text());
      alert("Saved!");
    } catch (e: any) {
      alert("Save failed (you can still print): " + (e?.message ?? "Unknown error"));
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const previewOpts = useMemo(() => ({ accent, template, toggles }), [accent, template, toggles]);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      {/* Controls */}
      <Card className="no-print">
        <CardHeader><CardTitle>Customize</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <TemplatePicker value={template} onChange={setTemplate} />
          <Separator />
          <CustomizerPanel
            accent={accent}
            onAccentChange={setAccent}
            toggles={toggles}
            onTogglesChange={setToggles}
            data={data}
            onDataChange={setData}
          />
          <div className="flex gap-2 pt-2">
            <Button onClick={save} disabled={!data || saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
            </Button>
            <Button variant="secondary" onClick={() => window.print()} className="gap-2">
              <Printer className="h-4 w-4" /> Print / PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <div className="flex items-start justify-center">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : (
          <ResumePreview data={data!} options={previewOpts} />
        )}
      </div>
    </div>
  );
}
