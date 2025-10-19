// src/lib/validations.ts
import { z } from "zod";

export const createResumeSchema = z.object({
  title: z.string().min(1).max(255),
  template: z.enum(["classic", "modern", "compact"]).default("classic"),
});

export const aiSuggestSchema = z.object({
  resumeId: z.string().uuid(),
  notes: z.string().max(4000).optional().default(""),
});
