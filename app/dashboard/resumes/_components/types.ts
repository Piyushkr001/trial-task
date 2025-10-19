// app/resumes/_components/types.ts
export type Resume = {
  id: string;
  title: string;
  template: "classic" | "modern" | "compact";
  updatedAt: string;          // ISO string
  previewUrl?: string | null; // optional thumb
};

export type ResumesResponse = { items: Resume[] };
