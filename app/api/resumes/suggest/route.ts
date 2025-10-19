// app/api/resumes/suggest/route.ts
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { resumes, users, resumeActivities } from "@/config/schema";
import { requireUser } from "@/lib/auth";
import { aiSuggestSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { generateSuggestions } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { email } = await requireUser();
    const body = await req.json();
    const parsed = aiSuggestSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    const row = await db.query.resumes.findFirst({ where: eq(resumes.id, parsed.data.resumeId) });
    if (!row) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

    const owner = await db.query.users.findFirst({ where: eq(users.id, row.userId) });
    if (!owner || owner.email !== email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const suggestions = await generateSuggestions({
      title: row.title,
      template: row.template,
      notes: parsed.data.notes,
    });

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
