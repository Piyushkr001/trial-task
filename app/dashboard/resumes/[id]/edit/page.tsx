// app/dashboard/resumes/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { db } from "@/config/db";
import { resumes, users } from "@/config/schema";
import { requireUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

// ⬇️ Add this import
import EditorClient from "./EditorClient";

export default async function EditResumePage(
  // Next 15: params is a Promise and must be awaited
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { email } = await requireUser();
  const me = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!me) notFound();

  const row = await db.query.resumes.findFirst({
    where: and(eq(resumes.id, id), eq(resumes.userId, me.id)),
  });
  if (!row) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Edit: {row.title ?? "Untitled"}</h1>
          <p className="text-sm text-muted-foreground">
            Resume ID: <code className="text-foreground/70">{id}</code>
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/resumes/${id}`}>View</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/api/resumes/${id}/export`} target="_blank" rel="noopener noreferrer">
              Export
            </Link>
          </Button>
        </div>
      </div>

      {/* ⬇️ Replace your old placeholder with this */}
      <section className="rounded-lg border bg-card p-4">
        <EditorClient id={id} initialTitle={row.title ?? ""} />
      </section>
    </main>
  );
}
