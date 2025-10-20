// app/api/resumes/[id]/ai/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { resumes, users, resumeActivities } from "@/config/schema";
import { requireUser } from "@/lib/auth";
import { generateSuggestions } from "@/lib/openai";
import { eq } from "drizzle-orm";

// ✅ Next 15: the 2nd arg's params is a Promise and must be awaited.
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  try {
    const { email } = await requireUser();

    // optional body: { notes?: string }
    const body = await req.json().catch(() => ({} as any));
    const notes: string = typeof body?.notes === "string" ? body.notes : "";

    // Fetch resume and verify ownership
    const row = await db.query.resumes.findFirst({ where: eq(resumes.id, id) });
    if (!row) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const owner = await db.query.users.findFirst({ where: eq(users.id, row.userId) });
    if (!owner || owner.email !== email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Generate AI suggestions (implement generateSuggestions accordingly)
    const template = (["classic", "modern", "compact"] as const).includes(
      row.template as any
    )
      ? (row.template as "classic" | "modern" | "compact")
      : "classic";

    const suggestions = await generateSuggestions({
      title: row.title ?? "",
      template,
      notes,
    });

    // Log activity
    await db.insert(resumeActivities).values({
      resumeId: row.id,
      userId: row.userId,
      item: row.title ?? "Untitled",
      type: "AI Summary",
      status: "Generated",
    });

    return NextResponse.json({ suggestions });
  } catch (e: any) {
    console.error("[/api/resumes/:id/ai] error:", e?.stack || e);
    return NextResponse.json({ error: e?.message || "Internal Error" }, { status: 500 });
  }
}

// Optional: explicit 405s for other methods
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
