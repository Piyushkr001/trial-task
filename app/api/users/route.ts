import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/config/db";
import { eq } from "drizzle-orm";

export const runtime = "edge";

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  imageUrl: z.string().url().optional(),
});

// POST: upsert by email
export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { email, name, imageUrl } = parsed.data;

  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (existing) {
    const [updated] = await db
      .update(schema.users)
      .set({
        name,
        imageUrl: imageUrl ?? existing.imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, existing.id))
      .returning();

    return NextResponse.json({ ok: true, user: updated });
  }

  const [created] = await db
    .insert(schema.users)
    .values({ email, name, imageUrl })
    .returning();

  return NextResponse.json({ ok: true, user: created }, { status: 201 });
}

// GET: by email (optional) or list
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (email) {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, email),
    });
    return NextResponse.json({ user });
  }

  const users = await db.select().from(schema.users).limit(100);
  return NextResponse.json({ users });
}
