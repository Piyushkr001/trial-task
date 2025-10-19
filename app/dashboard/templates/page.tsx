import Link from "next/link";
import { Button } from "@/components/ui/button";
import TemplateGallery from "./_components/TemplateGallery";

export default function TemplatesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Choose a Resume Template</h1>
          <p className="text-sm text-muted-foreground">
            Pick a template to start designing your resume. You can tweak every detail later.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/resumes">Back to Resumes</Link>
        </Button>
      </div>

      <TemplateGallery />
    </main>
  );
}
