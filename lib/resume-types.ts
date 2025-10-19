import { z } from "zod";

export const resumeSchema = z.object({
  profile: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([])
  }),
  summary: z.string().default(""),
  skills: z.array(z.string()).default([]),
  experience: z.array(z.object({
    role: z.string(),
    org: z.string(),
    start: z.string(),        // "YYYY-MM"
    end: z.string().optional(),
    points: z.array(z.string()).default([])
  })).default([]),
  projects: z.array(z.object({
    name: z.string(),
    tech: z.array(z.string()).default([]),
    highlights: z.array(z.string()).default([]),
    link: z.string().url().optional()
  })).default([]),
  education: z.array(z.object({
    degree: z.string(),
    inst: z.string(),
    end: z.string().optional()
  })).default([]),
  achievements: z.array(z.string()).default([])
});

export type ResumeJSON = z.infer<typeof resumeSchema>;

export const defaultResume: ResumeJSON = {
  profile: {
    name: "Piyush Kumar",
    email: "krvpiyush@gmail.com",
    phone: "+91 00000 00000",
    location: "India",
    links: [{ label: "GitHub", url: "https://github.com/..." }]
  },
  summary: "Frontend developer with Next.js, TypeScript, Shadcn and Drizzle.",
  skills: ["Next.js","TypeScript","Tailwind","Shadcn","Drizzle","Neon"],
  experience: [
    {
      role: "Web Dev Trainee",
      org: "Zidio Development",
      start: "2025-06",
      end: "2025-09",
      points: [
        "Built Excel Analytics Platform (Upload → Parse → Charts).",
        "Developed JWT auth & role-based dashboards."
      ]
    }
  ],
  projects: [
    { name: "Excel Analytics Platform", tech: ["Vite","React","Chart.js"], highlights: ["AI insights","PDF export"], link: "https://..." }
  ],
  education: [{ degree: "B.Tech (CSE)", inst: "BIT Mesra", end: "2025" }],
  achievements: ["Hackathon finalist"]
};
