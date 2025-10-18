import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db, schema } from "@/config/db"; // your neon+drizzle instance
import { eq } from "drizzle-orm";

export const runtime = "edge"; // works great with Neon HTTP driver

export async function POST() {
  const me = await currentUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // get primary email
  const email =
    me.emailAddresses.find((e) => e.id === me.primaryEmailAddressId)?.emailAddress ??
    me.emailAddresses[0]?.emailAddress;

  if (!email) return NextResponse.json({ error: "No email on user" }, { status: 400 });

  const fullName =
    me.firstName || me.lastName
      ? `${me.firstName ?? ""} ${me.lastName ?? ""}`.trim()
      : email.split("@")[0];

  // find by email (unique)
  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (existing) {
    const [updated] = await db
      .update(schema.users)
      .set({
        name: fullName,
        imageUrl: me.imageUrl ?? existing.imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, existing.id))
      .returning();

    return NextResponse.json({ ok: true, user: updated });
  }

  const [created] = await db
    .insert(schema.users)
    .values({
      email,
      name: fullName,
      imageUrl: me.imageUrl ?? undefined,
    })
    .returning();

  return NextResponse.json({ ok: true, user: created }, { status: 201 });
}
