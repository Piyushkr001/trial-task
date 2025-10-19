"use client";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ResumeTemplate = "minimal" | "compact";

export default function TemplatePicker({
  value, onChange
}: { value: ResumeTemplate; onChange: (t: ResumeTemplate) => void }) {
  return (
    <div className="space-y-2">
      <Label>Template</Label>
      <Select value={value} onValueChange={(v) => onChange(v as ResumeTemplate)}>
        <SelectTrigger><SelectValue placeholder="Choose template" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="minimal">Minimal</SelectItem>
          <SelectItem value="compact">Compact (2-column)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
