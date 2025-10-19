// app/api/resumes/[id]/duplicate/route.ts
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/config/db";
import { resumes, resumeActivities, users } from "@/config/schema";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  try {
    const { email } = await requireUser();
    const me = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!me) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const src = await db.query.resumes.findFirst({
      where: and(eq(resumes.id, id), eq(resumes.userId, me.id)),
    });
    if (!src) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

    const newTitle = `Copy of ${src.title ?? "Untitled"}`;

    const [dup] = await db
      .insert(resumes)
      .values({
        userId: me.id,
        title: newTitle,
        template: src.template,
        // previewUrl: src.previewUrl ?? null, // if you store previews
      })
      .returning();

    await db.insert(resumeActivities).values({
      resumeId: dup.id,
      userId: me.id,
      item: dup.title,
      type: "Resume",
      status: "Duplicated",
    });

    return NextResponse.json({ id: dup.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal Error" }, { status: 500 });
  }
}
