// app/api/resumes/[id]/route.ts
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/config/db";
import { resumes, users } from "@/config/schema";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Next 15: params is a Promise — you must await it
export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  try {
    const body = await req.json().catch(() => ({}));
    const title = typeof body?.title === "string" ? body.title : undefined;

    const { email } = await requireUser();
    const me = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!me) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const row = await db.query.resumes.findFirst({
      where: and(eq(resumes.id, id), eq(resumes.userId, me.id)),
    });
    if (!row) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

    if (title !== undefined) {
      await db
        .update(resumes)
        .set({ title })
        .where(and(eq(resumes.id, id), eq(resumes.userId, me.id)));
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal Error" }, { status: 500 });
  }
}
