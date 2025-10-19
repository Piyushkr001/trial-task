"use client";
import { ResumeJSON } from "@/lib/resume-types";

type Options = {
  accent: string;
  template: "minimal" | "compact";
  toggles: {
    summary: boolean; experience: boolean; projects: boolean; skills: boolean; education: boolean; achievements: boolean;
  };
};

export default function ResumePreview({ data, options }: { data: ResumeJSON; options: Options }) {
  const { accent, template, toggles } = options;

  return (
    <div className="a4 w-[210mm] min-h-[297mm] bg-white shadow-xl ring-1 ring-black/5 print:shadow-none"
         style={{ colorScheme: "light" }}>
      <div className="mx-auto h-full max-w-[190mm] p-8" style={{ ["--accent" as any]: accent }}>
        {template === "minimal"
          ? <MinimalTemplate data={data} toggles={toggles} />
          : <CompactTemplate data={data} toggles={toggles} />}
      </div>
    </div>
  );
}

/* ====== Minimal (single column) ====== */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-6 border-b pb-1 text-sm font-semibold" style={{ borderColor: "var(--accent)" }}>
      {children}
    </h2>
  );
}

function MinimalTemplate({ data, toggles }: { data: ResumeJSON; toggles: Options["toggles"] }) {
  const { profile, summary, skills, experience, projects, education, achievements } = data;

  return (
    <div className="text-[12px] leading-5">
      <div className="mb-3">
        <h1 className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{profile.name}</h1>
        <div className="mt-1 text-[11px] text-neutral-700">
          {[profile.email, profile.phone, profile.location].filter(Boolean).join(" · ")}
        </div>
        {!!profile.links?.length && (
          <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-neutral-700">
            {profile.links.map((l) => <span key={l.url}>{l.label}: {l.url}</span>)}
          </div>
        )}
      </div>

      {toggles.summary && summary && (<><SectionTitle>Summary</SectionTitle><p className="mt-1">{summary}</p></>)}
      {toggles.skills && skills.length > 0 && (<><SectionTitle>Skills</SectionTitle><p className="mt-1">{skills.join(" · ")}</p></>)}

      {toggles.experience && experience.length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          <div className="mt-1 space-y-2">
            {experience.map((e,i)=>(
              <div key={i}>
                <div className="font-medium">
                  {e.role} — {e.org} <span className="text-[11px] text-neutral-600">({e.start}–{e.end ?? "Present"})</span>
                </div>
                {e.points?.length ? <ul className="ml-4 list-disc">{e.points.map((p,j)=><li key={j}>{p}</li>)}</ul> : null}
              </div>
            ))}
          </div>
        </>
      )}

      {toggles.projects && projects.length > 0 && (
        <>
          <SectionTitle>Projects</SectionTitle>
          <div className="mt-1 space-y-2">
            {projects.map((p,i)=>(
              <div key={i}>
                <div className="font-medium">{p.name} {p.link ? <span className="text-[11px] text-neutral-600">({p.link})</span> : null}</div>
                {p.tech?.length ? <div className="text-[11px] text-neutral-700">Tech: {p.tech.join(", ")}</div> : null}
                {p.highlights?.length ? <ul className="ml-4 list-disc">{p.highlights.map((h,j)=><li key={j}>{h}</li>)}</ul> : null}
              </div>
            ))}
          </div>
        </>
      )}

      {toggles.education && education.length > 0 && (
        <>
          <SectionTitle>Education</SectionTitle>
          <div className="mt-1 space-y-1">
            {education.map((ed,i)=>(
              <div key={i} className="flex items-baseline justify-between">
                <div className="font-medium">{ed.degree}</div>
                <div className="text-[11px] text-neutral-700">{ed.inst} — {ed.end ?? ""}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {toggles.achievements && achievements.length > 0 && (
        <>
          <SectionTitle>Achievements</SectionTitle>
          <ul className="ml-4 list-disc">{achievements.map((a,i)=><li key={i}>{a}</li>)}</ul>
        </>
      )}
    </div>
  );
}

/* ====== Compact (two column) ====== */
function CompactTemplate({ data, toggles }: { data: ResumeJSON; toggles: Options["toggles"] }) {
  const { profile, summary, skills, experience, projects, education, achievements } = data;

  return (
    <div className="grid grid-cols-3 gap-6 text-[12px] leading-5">
      <aside className="col-span-1">
        <h1 className="text-xl font-bold" style={{ color: "var(--accent)" }}>{profile.name}</h1>
        <div className="mt-1 text-[11px] text-neutral-700">
          {[profile.email, profile.phone, profile.location].filter(Boolean).join(" · ")}
        </div>
        {!!profile.links?.length && (
          <div className="mt-1 space-y-0.5 text-[11px] text-neutral-700">
            {profile.links.map((l)=> <div key={l.url}>{l.label}: {l.url}</div>)}
          </div>
        )}

        {toggles.skills && skills.length > 0 && (
          <>
            <h2 className="mt-4 border-b pb-1 text-sm font-semibold" style={{ borderColor: "var(--accent)" }}>Skills</h2>
            <ul className="mt-1 ml-4 list-disc">{skills.map((s,i)=><li key={i}>{s}</li>)}</ul>
          </>
        )}

        {toggles.education && education.length > 0 && (
          <>
            <h2 className="mt-4 border-b pb-1 text-sm font-semibold" style={{ borderColor: "var(--accent)" }}>Education</h2>
            <div className="mt-1 space-y-1">
              {education.map((ed,i)=>(
                <div key={i}>
                  <div className="font-medium">{ed.degree}</div>
                  <div className="text-[11px] text-neutral-700">{ed.inst} — {ed.end ?? ""}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </aside>

      <section className="col-span-2">
        {toggles.summary && summary && (
          <>
            <h2 className="border-b pb-1 text-sm font-semibold" style={{ borderColor: "var(--accent)" }}>Summary</h2>
            <p className="mt-1">{summary}</p>
          </>
        )}

        {toggles.experience && experience.length > 0 && (
          <>
            <h2 className="mt-4 border-b pb-1 text-sm font-semibold" style={{ borderColor: "var(--accent)" }}>Experience</h2>
            <div className="mt-1 space-y-2">
              {experience.map((e,i)=>(
                <div key={i}>
                  <div className="font-medium">
                    {e.role} — {e.org} <span className="text-[11px] text-neutral-600">({e.start}–{e.end ?? "Present"})</span>
                  </div>
                  {e.points?.length ? <ul className="ml-4 list-disc">{e.points.map((p,j)=><li key={j}>{p}</li>)}</ul> : null}
                </div>
              ))}
            </div>
          </>
        )}

        {toggles.projects && projects.length > 0 && (
          <>
            <h2 className="mt-4 border-b pb-1 text-sm font-semibold" style={{ borderColor: "var(--accent)" }}>Projects</h2>
            <div className="mt-1 space-y-2">
              {projects.map((p,i)=>(
                <div key={i}>
                  <div className="font-medium">{p.name} {p.link ? <span className="text-[11px] text-neutral-600">({p.link})</span> : null}</div>
                  {p.tech?.length ? <div className="text-[11px] text-neutral-700">Tech: {p.tech.join(", ")}</div> : null}
                  {p.highlights?.length ? <ul className="ml-4 list-disc">{p.highlights.map((h,j)=><li key={j}>{h}</li>)}</ul> : null}
                </div>
              ))}
            </div>
          </>
        )}

        {toggles.achievements && achievements.length > 0 && (
          <>
            <h2 className="mt-4 border-b pb-1 text-sm font-semibold" style={{ borderColor: "var(--accent)" }}>Achievements</h2>
            <ul className="ml-4 list-disc">{achievements.map((a,i)=><li key={i}>{a}</li>)}</ul>
          </>
        )}
      </section>
    </div>
  );
}
