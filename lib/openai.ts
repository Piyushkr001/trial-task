import OpenAI from "openai";

export async function generateSuggestions(input: {
  title: string;
  template: "classic" | "modern" | "compact";
  notes?: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return `Suggestions for "${input.title}" (${input.template}):
• Add 1–2 quantified bullet points under each recent role.
• Keep resume to 1 page; de-emphasize older items.
• Lead with action verbs and measurable outcomes.
• Mirror keywords from the job description (ATS).
• Ensure consistent tense, spacing, and punctuation.
• Prefer impact over responsibilities.`;
  }

  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      { role: "system", content: "You are a concise resume improvement assistant." },
      {
        role: "user",
        content: `Give 6–10 concise, actionable, metric-focused bullets to improve a resume.
Title: ${input.title}
Template: ${input.template}
Context: ${input.notes || "(none)"}`,
      },
    ],
  });
  return completion.choices[0]?.message?.content?.trim() || "No suggestions.";
}
