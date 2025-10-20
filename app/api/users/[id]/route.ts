// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db, schema } from "@/config/db";
import { eq } from "drizzle-orm";

// ⚠ If your DB driver isn't Edge-compatible, switch to:
// export const runtime = "nodejs";
export const runtime = "edge";

const idParam = z.object({ id: z.string().uuid() });
const patchBody = z.object({
  name: z.string().min(1).max(255).optional(),
  imageUrl: z.string().url().nullable().optional(),
});

// GET /api/users/:id
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> } // ✅ Next 15: params is a Promise
) {
  const { id } = idParam.parse(await ctx.params);

  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, id),
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user });
}

// PATCH /api/users/:id
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> } // ✅ must await
) {
  const { id } = idParam.parse(await ctx.params);

  const bodyJson = await req.json().catch(() => null);
  const body = patchBody.safeParse(bodyJson);
  if (!body.success) {
    return NextResponse.json({ error: body.error.flatten() }, { status: 400 });
  }

  const [updated] = await db
    .update(schema.users)
    .set({
      ...(body.data.name !== undefined ? { name: body.data.name } : {}),
      ...(body.data.imageUrl !== undefined ? { imageUrl: body.data.imageUrl ?? null } : {}),
      updatedAt: new Date(),
    })
    .where(eq(schema.users.id, id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, user: updated });
}

// DELETE /api/users/:id
export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> } // ✅ must await
) {
  const { id } = idParam.parse(await ctx.params);

  const [deleted] = await db
    .delete(schema.users)
    .where(eq(schema.users.id, id))
    .returning();

  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
