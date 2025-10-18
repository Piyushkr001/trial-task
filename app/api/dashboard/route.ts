import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { users, resumes, resumeExports, credentials } from "@/config/schema";
import { and, desc, eq, sql } from "drizzle-orm";

export const runtime = "edge";

type DashboardPayload = {
  stats: {
    totalResumes: number;
    templatesUsed: number;
    lastExportDate: string | null;
    profileCompletion: number; // 0-100
    linkedCertificates: number;
    pendingVerifications: number;
  };
  recentActivity: Array<{
    id: string;
    item: string;
    type: "Resume" | "Template" | "AI Summary" | "Verification";
    status: string;
    updatedAt: string; // ISO
  }>;
};

export async function GET() {
  // Identify the signed-in user via Clerk (email is our DB key)
  const me = await currentUser().catch(() => null);
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const email =
    me.emailAddresses.find((e) => e.id === me.primaryEmailAddressId)?.emailAddress ??
    me.emailAddresses[0]?.emailAddress;
  if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

  // Find the app user row
  const dbUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (!dbUser) {
    // No app user yet => empty dashboard
    const empty: DashboardPayload = {
      stats: {
        totalResumes: 0,
        templatesUsed: 0,
        lastExportDate: null,
        profileCompletion: computeProfileCompletion({ name: me.fullName ?? "", hasImage: !!me.imageUrl, totalResumes: 0, linked: 0 }),
        linkedCertificates: 0,
        pendingVerifications: 0,
      },
      recentActivity: [],
    };
    return NextResponse.json(empty);
  }

  const userId = dbUser.id;

  // ---- counts ----
  const [{ cnt: totalResumes }] =
    await db.select({ cnt: sql<number>`count(*)` }).from(resumes).where(eq(resumes.userId, userId));

  const [{ distinctCnt: templatesUsed }] =
    await db.select({ distinctCnt: sql<number>`count(distinct ${resumes.template})` })
      .from(resumes)
      .where(eq(resumes.userId, userId));

  const lastExportRow = await db.query.resumeExports.findFirst({
    where: (t, { eq }) => eq(t.userId, userId),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  const [{ linked: linkedCertificates }] =
    await db.select({ linked: sql<number>`count(*)` })
      .from(credentials)
      .where(and(eq(credentials.userId, userId), eq(credentials.status, "linked")));

  const [{ pending: pendingVerifications }] =
    await db.select({ pending: sql<number>`count(*)` })
      .from(credentials)
      .where(and(eq(credentials.userId, userId), eq(credentials.status, "pending")));

  // ---- recent activity (merge 3 sources, newest first, top 10) ----
  const recentResumes = await db
    .select({ id: resumes.id, title: resumes.title, template: resumes.template, t: resumes.updatedAt })
    .from(resumes)
    .where(eq(resumes.userId, userId))
    .orderBy(desc(resumes.updatedAt))
    .limit(10);

  const recentExports = await db
    .select({ id: resumeExports.id, t: resumeExports.createdAt })
    .from(resumeExports)
    .where(eq(resumeExports.userId, userId))
    .orderBy(desc(resumeExports.createdAt))
    .limit(10);

  const recentCreds = await db
    .select({ id: credentials.id, name: credentials.name, status: credentials.status, t: credentials.updatedAt })
    .from(credentials)
    .where(eq(credentials.userId, userId))
    .orderBy(desc(credentials.updatedAt))
    .limit(10);

  const activity = [
    ...recentResumes.map((r) => ({
      id: r.id,
      item: r.title,
      type: "Resume" as const,
      status: "Edited",
      updatedAt: r.t.toISOString(),
    })),
    ...recentExports.map((e) => ({
      id: e.id,
      item: "PDF Export",
      type: "Template" as const, // you can introduce a dedicated "Export" type on the client if you want
      status: "Downloaded",
      updatedAt: e.t.toISOString(),
    })),
    ...recentCreds.map((c) => ({
      id: c.id,
      item: c.name,
      type: "Verification" as const,
      status: c.status === "linked" ? "Linked" : c.status === "pending" ? "Pending" : "Revoked",
      updatedAt: c.t.toISOString(),
    })),
  ]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 10);

  const payload: DashboardPayload = {
    stats: {
      totalResumes,
      templatesUsed,
      lastExportDate: lastExportRow?.createdAt?.toISOString() ?? null,
      profileCompletion: computeProfileCompletion({
        name: dbUser.name,
        hasImage: !!dbUser.imageUrl,
        totalResumes,
        linked: linkedCertificates,
      }),
      linkedCertificates,
      pendingVerifications,
    },
    recentActivity: activity,
  };

  return NextResponse.json(payload);
}

/* ------------ tiny helper: naive profile-completion % ------------ */
function computeProfileCompletion(input: {
  name: string;
  hasImage: boolean;
  totalResumes: number;
  linked: number;
}) {
  let pct = 0;
  if (input.name) pct += 30;
  if (input.hasImage) pct += 20;
  if (input.totalResumes > 0) pct += 30;
  if (input.linked > 0) pct += 20;
  return Math.min(100, pct);
}
