// app/dashboard/ats/page.tsx
import AtsChecker from "./_components/AtsChecker";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "ATS Score Checker",
};

export default function AtsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">ATS Score Checker</h1>
          <p className="text-sm text-muted-foreground">
            Upload your resume (PDF/DOCX/TXT) and paste the job description to see your ATS match score.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/resumes">Back to Resumes</Link>
        </Button>
      </div>

      <AtsChecker />
    </main>
  );
}
