"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ResumeJSON } from "@/lib/resume-types";

export type SectionToggleState = {
  summary: boolean; experience: boolean; projects: boolean; skills: boolean; education: boolean; achievements: boolean;
};

export default function CustomizerPanel({
  accent, onAccentChange, toggles, onTogglesChange, data, onDataChange
}: {
  accent: string;
  onAccentChange: (v: string) => void;
  toggles: SectionToggleState;
  onTogglesChange: (v: SectionToggleState) => void;
  data: ResumeJSON | null;
  onDataChange: (v: ResumeJSON) => void;
}) {
  const [local, setLocal] = useState<ResumeJSON | null>(data);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Accent color</Label>
        <div className="flex items-center gap-2">
          <Input type="color" value={accent} onChange={(e) => onAccentChange(e.target.value)} className="h-9 w-16 p-1" />
          <Input value={accent} onChange={(e) => onAccentChange(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Sections</Label>
        {(
          [
            ["summary","Summary"],
            ["experience","Experience"],
            ["projects","Projects"],
            ["skills","Skills"],
            ["education","Education"],
            ["achievements","Achievements"]
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm">{label}</span>
            <Switch checked={toggles[key]} onCheckedChange={(v: any) => onTogglesChange({ ...toggles, [key]: v })} />
          </div>
        ))}
      </div>

      {local ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Name</Label>
              <Input value={local.profile.name}
                     onChange={(e) => setLocal({ ...local, profile: { ...local.profile, name: e.target.value } })}/>
            </div>
            <div>
              <Label>Email</Label>
              <Input value={local.profile.email}
                     onChange={(e) => setLocal({ ...local, profile: { ...local.profile, email: e.target.value } })}/>
            </div>
          </div>
          <div>
            <Label>Summary</Label>
            <Textarea value={local.summary}
                      onChange={(e) => setLocal({ ...local, summary: e.target.value })}
                      className="min-h-[100px]"/>
          </div>
          <div>
            <Label>Skills (comma separated)</Label>
            <Input value={local.skills.join(", ")}
                   onChange={(e) => setLocal({
                     ...local,
                     skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                   })}/>
          </div>
          <Button variant="secondary" onClick={() => onDataChange(local)} className="w-full">
            Apply Edits
          </Button>
        </div>
      ) : null}
    </div>
  );
}
