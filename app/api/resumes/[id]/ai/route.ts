// app/resumes/[id]/ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { resumes, users, resumeActivities } from "@/config/schema";
import { requireUser } from "@/lib/auth";
import { generateSuggestions } from "@/lib/openai";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resumeId = params.id;
    const { email } = await requireUser();

    // optional body: { notes?: string }
    const { notes = "" } = (await req.json().catch(() => ({}))) as { notes?: string };

    const row = await db.query.resumes.findFirst({ where: eq(resumes.id, resumeId) });
    if (!row) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

    const owner = await db.query.users.findFirst({ where: eq(users.id, row.userId) });
    if (!owner || owner.email !== email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const suggestions = await generateSuggestions({
      title: row.title,
      template: row.template,
      notes,
    });

    // log activity
    await db.insert(resumeActivities).values({
      resumeId: row.id,
      userId: row.userId,
      item: row.title,
      type: "AI Summary",
      status: "Generated",
    });

    return NextResponse.json({ suggestions });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal Error" }, { status: 500 });
  }
}

// Optional: make GET explicit 405 so you don't see 404s from accidental GETs
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
