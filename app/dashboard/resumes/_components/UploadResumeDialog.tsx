// app/resumes/_components/UploadResumeDialog.tsx
"use client";

import * as React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, X } from "lucide-react";

type Props = {
  onDone: (newId?: string) => void;
  /** Optional: attach upload to an existing resume */
  resumeId?: string;
  /** Optional override (bytes). Defaults to 5MB. */
  maxBytes?: number;
};

const ACCEPT_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
];
const ACCEPT_EXT = [".pdf", ".docx", ".doc"];

export default function UploadResumeDialog({ onDone, resumeId, maxBytes = 5 * 1024 * 1024 }: Props) {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  function resetState() {
    setFile(null);
    setError(null);
    setIsUploading(false);
    abortRef.current?.abort();
    abortRef.current = null;
    if (inputRef.current) inputRef.current.value = "";
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function validateFile(f: File): string | null {
    if (!ACCEPT_MIME.includes(f.type)) {
      // Some browsers don’t set type for .doc/.docx reliably; fallback to extension check.
      const lower = f.name.toLowerCase();
      const okByExt = ACCEPT_EXT.some(ext => lower.endsWith(ext));
      if (!okByExt) return "Unsupported file type. Please upload a PDF or Word document (.pdf, .docx, .doc).";
    }
    if (f.size > maxBytes) {
      return `File is too large. Max size is ${formatSize(maxBytes)}.`;
    }
    return null;
  }

  function pickFile(f: File | null) {
    setError(null);
    if (!f) {
      setFile(null);
      return;
    }
    const v = validateFile(f);
    if (v) {
      setError(v);
      setFile(null);
      return;
    }
    setFile(f);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    pickFile(e.target.files?.[0] ?? null);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    pickFile(e.dataTransfer.files?.[0] ?? null);
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  async function handleUpload() {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file, file.name);
    if (resumeId) fd.append("resumeId", resumeId);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: fd,
        signal: controller.signal,
      });

      if (!res.ok) {
        // Try to read structured error
        let msg = "Upload failed. Please try again.";
        try {
          const j = await res.json();
          if (j?.error) msg = j.error;
        } catch {
          // ignore
        }
        throw new Error(`${msg} (HTTP ${res.status})`);
      }

      // Expecting something like { id: "<resumeId>" } or maybe the full row.
      let createdId: string | undefined;
      try {
        const data = await res.json();
        createdId = data?.id ?? data?.resumeId ?? undefined;
      } catch {
        // Some backends return 204/empty; that’s okay.
      }

      // Close & reset
      setOpen(false);
      resetState();

      // Let parent refresh list / navigate
      onDone(createdId);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      console.error("Upload error:", err);
      setError(err?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      abortRef.current = null;
    }
  }

  // If user closes dialog mid-upload, abort the request
  function onOpenChange(next: boolean) {
    if (!next) {
      abortRef.current?.abort();
      resetState();
    }
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" /> Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a resume</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <p className="text-sm text-muted-foreground">
            Supported formats: <strong>PDF</strong>, <strong>DOCX</strong>, <strong>DOC</strong>. Max {formatSize(maxBytes)}.
          </p>

          {/* Dropzone */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center"
          >
            <div className="text-sm">
              Drag & drop your file here, or choose a file
            </div>
            <Input
              ref={inputRef}
              type="file"
              accept={ACCEPT_EXT.join(",") + "," + ACCEPT_MIME.join(",")}
              onChange={onInputChange}
              className="mt-2 cursor-pointer"
            />
          </div>

          {/* Selected file chip */}
          {file && (
            <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
              <div className="truncate">
                <span className="font-medium">{file.name}</span>{" "}
                <span className="text-muted-foreground">({formatSize(file.size)})</span>
              </div>
              <button
                type="button"
                className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-muted"
                onClick={() => pickFile(null)}
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || !!error || isUploading}>
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isUploading ? "Uploading…" : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
