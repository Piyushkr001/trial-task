import { notFound } from "next/navigation";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { db } from "@/config/db";
import { resumes, users } from "@/config/schema";
import { requireUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import PreviewBuilder from "./_components/PreviewBuilder";

export default async function PreviewPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // guard: only owner can preview/customize
  const { email } = await requireUser();
  const me = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!me) notFound();

  const row = await db.query.resumes.findFirst({
    where: and(eq(resumes.id, id), eq(resumes.userId, me.id)),
  });
  if (!row) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Resume Preview & Customization</h1>
          <p className="text-sm text-muted-foreground">
            {row.title ?? "Untitled"} — Template: <span className="font-medium">{row.template ?? "—"}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/resumes/${id}/edit`}>Edit</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/api/resumes/${id}/export`} target="_blank" rel="noopener noreferrer">
              Export
            </Link>
          </Button>
        </div>
      </div>

      <PreviewBuilder resumeId={id} />
    </main>
  );
}
