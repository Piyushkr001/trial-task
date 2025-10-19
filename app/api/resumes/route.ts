// app/api/resumes/route.ts
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { resumes, resumeActivities, users } from "@/config/schema";
import { eq, desc } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { getOrCreateUserByEmail } from "@/lib/users";
import { createResumeSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { email } = await requireUser();
    const userRow = await db.query.users.findFirst({ where: eq(users.email, email) });

    if (!userRow) return NextResponse.json({ items: [] });

    const rows = await db.query.resumes.findMany({
      where: eq(resumes.userId, userRow.id),
      orderBy: [desc(resumes.updatedAt)],
    });

    return NextResponse.json({
      items: rows.map((r) => ({
        id: r.id,
        title: r.title,
        template: r.template,
        updatedAt: (r.updatedAt instanceof Date ? r.updatedAt : new Date()).toISOString(),
        previewUrl: (r as any).previewUrl ?? null,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user, email } = await requireUser();
    const body = await req.json().catch(() => ({}));

    const parsed = createResumeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const userRow = await getOrCreateUserByEmail({
      email,
      name: user.fullName,
      imageUrl: user.imageUrl,
    });

    const [row] = await db
      .insert(resumes)
      .values({
        userId: userRow.id,
        title: parsed.data.title || "Untitled Resume",
        template: parsed.data.template || "modern",
      })
      .returning();

    await db.insert(resumeActivities).values({
      resumeId: row.id,
      userId: userRow.id,
      item: row.title,
      type: "Resume",
      status: "Created",
    });

    return NextResponse.json({ id: row.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal Error" }, { status: 500 });
  }
}
