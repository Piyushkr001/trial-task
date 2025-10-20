// app/api/resumes/[id]/route.ts
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/config/db";
import { resumes, users } from "@/config/schema";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Body = {
  title?: string;
  template?: string;
  previewUrl?: string | null;
};

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  // ✅ Next 15: params is a Promise
  const { id } = await ctx.params;

  try {
    const body = (await req.json().catch(() => ({}))) as Body;

    // pick only allowed fields
    const updates: Partial<typeof resumes.$inferInsert> = {};
    if (typeof body.title === "string") updates.title = body.title.trim();

    // validate template against allowed templates and narrow the type
    const ALLOWED_TEMPLATES = [
      "classic",
      "modern",
      "compact",
      "minimal",
      "elegant",
      "tech",
      "creative",
      "executive",
      "timeline",
      "twocol",
    ] as const;
    type AllowedTemplate = typeof ALLOWED_TEMPLATES[number];
    if (typeof body.template === "string" && (ALLOWED_TEMPLATES as readonly string[]).includes(body.template)) {
      updates.template = body.template as AllowedTemplate;
    }

    if (body.previewUrl === null || typeof body.previewUrl === "string") {
      updates.previewUrl = body.previewUrl ?? null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Nothing to update. Provide at least one of: title, template, previewUrl." },
        { status: 400 }
      );
    }

    // always bump updatedAt
    updates.updatedAt = new Date();

    const { email } = await requireUser();
    const me = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!me) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ensure the resume belongs to the user
    const row = await db.query.resumes.findFirst({
      where: and(eq(resumes.id, id), eq(resumes.userId, me.id)),
    });
    if (!row) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

    const [updated] = await db
      .update(resumes)
      .set(updates)
      .where(and(eq(resumes.id, id), eq(resumes.userId, me.id)))
      .returning({
        id: resumes.id,
        title: resumes.title,
        template: resumes.template,
        previewUrl: resumes.previewUrl,
        updatedAt: resumes.updatedAt,
      });

    return NextResponse.json({ ok: true, resume: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal Error" }, { status: 500 });
  }
}

// (Optional) block accidental GET/DELETE with a clear 405 instead of 404
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
