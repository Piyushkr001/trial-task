// app/api/ats/extract/route.ts
import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const maxDuration = 30;

const FIVE_MB = 5 * 1024 * 1024;
const SUPPORTED = {
  pdf: /application\/pdf|\.pdf$/i,
  docx: /application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|\.docx$/i,
  txt: /text\/plain|\.txt$/i,
};

function inferType(contentType: string | null, filename?: string) {
  const name = filename || "";
  const t = contentType || "";
  if (SUPPORTED.pdf.test(t) || SUPPORTED.pdf.test(name)) return "pdf";
  if (SUPPORTED.docx.test(t) || SUPPORTED.docx.test(name)) return "docx";
  if (SUPPORTED.txt.test(t) || SUPPORTED.txt.test(name)) return "txt";
  return "unknown";
}

function cleanText(s: string) {
  return s
    .replace(/\r/g, "")
    .replace(/\u0000/g, "")
    .replace(/-\n(?=\w)/g, "")     // join hyphen-broken words
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// --- PDF helper (use Uint8Array, not Buffer) ---
async function pdfBytesToText(bytes: Uint8Array) {
  // Use legacy build in Node to avoid worker issues
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  // In Node, workers aren’t used by default; no need to set workerSrc
  const task = pdfjs.getDocument({ data: bytes, isEvalSupported: false });
  const doc = await task.promise;

  let out = "";
  for (let p = 1; p <= doc.numPages; p++) {
    try {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();
      out +=
        content.items
          .map((it: any) => (typeof it.str === "string" ? it.str : ""))
          .join(" ") + "\n\n";
    } catch {
      // continue on per-page failure
    }
  }
  await doc.destroy();
  return out;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const fileAny = form.get("file");

    if (!fileAny || !(fileAny instanceof Blob)) {
      return NextResponse.json({ error: "Missing 'file' in FormData." }, { status: 400 });
    }

    const file = fileAny as File;
    const filename = file.name || "upload";
    const size = file.size ?? 0;
    const contentType = file.type || null;

    if (!size) return NextResponse.json({ error: "Empty file uploaded." }, { status: 400 });
    if (size > FIVE_MB) return NextResponse.json({ error: "File too large. Max 5 MB." }, { status: 413 });

    const kind = inferType(contentType, filename);
    if (kind === "unknown") {
      return NextResponse.json({ error: "Unsupported file. Allowed: PDF, DOCX, TXT." }, { status: 415 });
    }

    // Read once, branch per type
    const arrayBuffer = await file.arrayBuffer();

    let raw = "";
    if (kind === "pdf") {
      // ✅ Convert to plain Uint8Array (NOT Buffer)
      const bytes = new Uint8Array(arrayBuffer);
      raw = await pdfBytesToText(bytes);
    } else if (kind === "docx") {
      // DOCX libs like mammoth expect Buffer
      const mammoth = (await import("mammoth")).default;
      const buf = Buffer.from(arrayBuffer); // Buffer OK here
      const { value } = await mammoth.extractRawText({ buffer: buf });
      raw = String(value || "");
    } else {
      // TXT: decode as UTF-8 without Buffer
      const decoder = new TextDecoder("utf-8");
      raw = decoder.decode(new Uint8Array(arrayBuffer));
    }

    const text = cleanText(raw);
    if (!text) {
      return NextResponse.json(
        { error: "Could not extract readable text from the file." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      text,
      meta: {
        filename,
        size,
        contentType,
        kind,
        chars: text.length,
        words: text.split(/\s+/).filter(Boolean).length,
      },
    });
  } catch (err: any) {
    console.error("[/api/ats/extract] error:", err);
    const message =
      err?.message?.slice?.(0, 400) ||
      "Unexpected server error while extracting text.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
