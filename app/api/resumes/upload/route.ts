// app/api/resumes/upload/route.ts
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { resumes, resumeActivities, resumeFiles, users } from "@/config/schema";
import { requireUser } from "@/lib/auth";
import { getOrCreateUserByEmail } from "@/lib/users";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { user, email } = await requireUser();
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const mimetype = file.type || "application/octet-stream";
    if (!/pdf|msword|officedocument\.wordprocessingml/.test(mimetype)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const arrayBuf = await file.arrayBuffer();
    const buf = Buffer.from(arrayBuf);

    const userRow = await getOrCreateUserByEmail({
      email,
      name: user.fullName,
      imageUrl: user.imageUrl,
    });

    const guessedTitle =
      file.name.replace(/\.(pdf|docx?|rtf)$/i, "") || "Uploaded Resume";

    const [resumeRow] = await db.insert(resumes).values({
      userId: userRow.id,
      title: guessedTitle,
      template: "classic",
      storageUrl: null,
      storageKey: null,
    }).returning();

    const [fileRow] = await db.insert(resumeFiles).values({
      resumeId: resumeRow.id,
      filename: file.name,
      mimetype,
      bytes: buf,
    }).returning();

    // mark storageUrl to indicate DB storage
    await db.update(resumes)
      .set({ storageUrl: `db://resume_files/${fileRow.id}` })
      .where(eq(resumes.id, resumeRow.id));

    await db.insert(resumeActivities).values({
      resumeId: resumeRow.id,
      userId: userRow.id,
      item: guessedTitle,
      type: "Resume",
      status: "Uploaded",
    });

    return NextResponse.json({ id: resumeRow.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Internal Error" }, { status: 500 });
  }
}
