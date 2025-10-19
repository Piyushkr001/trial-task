// src/lib/users.ts
import { db } from "@/config/db"; // ⬅ adjust to your db export
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function getOrCreateUserByEmail({
  email,
  name,
  imageUrl,
}: { email: string; name?: string | null; imageUrl?: string | null; }) {
  const row = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (row) return row;

  const [inserted] = await db
    .insert(users)
    .values({ email, name: name ?? email.split("@")[0], imageUrl: imageUrl ?? null })
    .returning();
  return inserted;
}
