export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import JSZip from "jszip";

// --- helpers -------------------------------------------------
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

function bad(status: number, message: string, detail?: unknown) {
  return NextResponse.json({ error: message, detail }, { status });
}

function extOf(name?: string) {
  const m = /\.([a-z0-9]+)$/i.exec(name || "");
  return (m?.[1] || "").toLowerCase();
}

type Kind = "pdf" | "docx" | "txt" | "md" | null;

function sniffKind(buf: Buffer, name?: string, mime?: string): Kind {
  const ext = extOf(name);
  const t = (mime || "").toLowerCase();

  if (t.includes("pdf")) return "pdf";
  if (t.includes("wordprocessingml.document")) return "docx";
  if (t.includes("markdown")) return "md";
  if (t.startsWith("text/")) return ext === "md" ? "md" : "txt";

  if (ext === "pdf") return "pdf";
  if (ext === "docx") return "docx";
  if (ext === "md") return "md";
  if (ext === "txt" || ext === "text") return "txt";

  if (buf.length >= 4) {
    if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) return "pdf"; // %PDF
    if (buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04) return "docx"; // ZIP
  }
  return null;
}

function xmlToText(xml: string) {
  // Add paragraph and break hints to keep spacing
  const withBreaks = xml
    .replace(/<\/w:p>/g, "\n")
    .replace(/<w:tab\/?>/g, "\t")
    .replace(/<w:br\/?>/g, "\n");

  // Strip all tags
  const stripped = withBreaks.replace(/<[^>]+>/g, " ");

  // Decode a few common entities
  return stripped
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

// --- PDF text using pdfjs-dist --------------------------------
async function pdfBufferToText(buffer: Buffer) {
  // Use the legacy ESM build which works well in Node
  const pdfjs: any = await import("pdfjs-dist/legacy/build/pdf.mjs");
  // Small polyfills for Node if needed
  if (!(globalThis as any).atob) (globalThis as any).atob = (b64: string) => Buffer.from(b64, "base64").toString("binary");
  if (!(globalThis as any).btoa) (globalThis as any).btoa = (s: string) => Buffer.from(s, "binary").toString("base64");

  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  let out = "";
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const items = content.items as Array<any>;
    const text = items.map((i) => i?.str || "").join(" ");
    out += text + "\n";
  }
  return out.trim();
}

// --- DOCX text using JSZip ------------------------------------
async function docxBufferToText(buffer: Buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const filesToRead = [
    "word/document.xml",
    "word/footnotes.xml",
    "word/endnotes.xml",
    "word/header1.xml", "word/header2.xml", "word/header3.xml",
    "word/footer1.xml", "word/footer2.xml", "word/footer3.xml",
  ];

  let combined = "";
  for (const path of filesToRead) {
    const f = zip.file(path);
    if (!f) continue;
    const xml = await f.async("string");
    combined += xml + "\n";
  }
  if (!combined) return "";

  return xmlToText(combined);
}

// --- Route -----------------------------------------------------
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return bad(422, "No file uploaded", "Expected field 'file'");

    if (file.size > MAX_BYTES) {
      return bad(422, "File too large", { maxMB: 5, size: file.size });
    }

    const arrayBuf = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    const kind = sniffKind(buffer, file.name, (file as any).type);
    if (!kind) return bad(422, "Unsupported file type", { name: file.name, type: (file as any).type });

    let text = "";
    if (kind === "pdf") {
      try {
        text = await pdfBufferToText(buffer);
      } catch (e: any) {
        console.error("[/api/ats/extract] pdfjs-dist failed:", e);
        return bad(500, "PDF extract failed", { message: e?.message });
      }
    } else if (kind === "docx") {
      try {
        text = await docxBufferToText(buffer);
      } catch (e: any) {
        console.error("[/api/ats/extract] jszip docx failed:", e);
        return bad(500, "DOCX extract failed", { message: e?.message });
      }
    } else {
      text = buffer.toString("utf8");
    }

    if (!text.trim()) return bad(422, "Could not read any text from file", { name: file.name });
    return NextResponse.json({ text });
  } catch (e: any) {
    console.error("[/api/ats/extract] fatal:", e);
    return bad(500, "Internal Error", { message: e?.message });
  }
}
