"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Shield, Lock, Database, Cookie, Globe,
  FileCheck, UserCheck, Clock, Mail, AlertTriangle,
} from "lucide-react";

const LAST_UPDATED = "Oct 19, 2025";

const sections = [
  { id: "information-we-collect", label: "Information We Collect", icon: Database },
  { id: "how-we-use", label: "How We Use Information", icon: Shield },
  { id: "legal-bases", label: "Legal Bases", icon: FileCheck },
  { id: "cookies", label: "Cookies & Tracking", icon: Cookie },
  { id: "sharing", label: "Sharing with Third Parties", icon: Globe },
  { id: "transfers", label: "International Transfers", icon: Globe },
  { id: "retention", label: "Data Retention", icon: Clock },
  { id: "your-rights", label: "Your Rights", icon: UserCheck },
  { id: "security", label: "Security", icon: Lock },
  { id: "children", label: "Children’s Privacy", icon: AlertTriangle },
  { id: "changes", label: "Changes to this Policy", icon: FileCheck },
  { id: "contact", label: "Contact Us", icon: Mail },
] as const;

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Privacy Policy</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your data, your control. This page explains what we collect and how we handle it.
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3.5 w-3.5" />
          Updated {LAST_UPDATED}
        </Badge>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Main content */}
        <div className="w-full lg:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                We’re committed to keeping your personal information safe, transparent, and in your control.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTitle>Plain-language summary</AlertTitle>
                <AlertDescription>
                  We only collect what we need to provide the service, don’t sell personal data, and give you tools to access or delete it.
                </AlertDescription>
              </Alert>

              <Separator />

              {/* Information We Collect */}
              <Section id="information-we-collect" title="Information We Collect" Icon={Database}>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong>Account</strong>: name, email, and authentication identifiers.
                  </li>
                  <li>
                    <strong>Resume Content</strong>: data you upload or type (e.g., work history, skills).
                  </li>
                  <li>
                    <strong>Usage</strong>: device info, pages viewed, approximate location (from IP), and basic analytics.
                  </li>
                  <li>
                    <strong>Support</strong>: messages you send us and related metadata.
                  </li>
                </ul>
              </Section>

              <Separator />

              {/* How We Use */}
              <Section id="how-we-use" title="How We Use Information" Icon={Shield}>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Provide, operate, and improve features (e.g., resume editing, template rendering, ATS scoring).</li>
                  <li>Personalize content (e.g., recently used templates, saved preferences).</li>
                  <li>Detect and prevent abuse, fraud, and security incidents.</li>
                  <li>Communicate updates, respond to support, and fulfill legal obligations.</li>
                </ul>
              </Section>

              <Separator />

              {/* Legal Bases */}
              <Section id="legal-bases" title="Legal Bases (EEA/UK)" Icon={FileCheck}>
                <ul className="list-disc space-y-2 pl-5">
                  <li><strong>Contract</strong>: to deliver the service you requested.</li>
                  <li><strong>Legitimate Interests</strong>: to secure and improve the product.</li>
                  <li><strong>Consent</strong>: where required (e.g., certain analytics or marketing).</li>
                  <li><strong>Legal Obligation</strong>: compliance with applicable laws.</li>
                </ul>
              </Section>

              <Separator />

              {/* Cookies */}
              <Section id="cookies" title="Cookies & Tracking" Icon={Cookie}>
                <p className="mb-2">
                  We use cookies and similar technologies to keep you signed in, remember preferences, and measure what’s working.
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li><strong>Strictly necessary</strong>: authentication and session management.</li>
                  <li><strong>Preferences</strong>: UI and editor settings you choose.</li>
                  <li><strong>Analytics</strong>: aggregated metrics to improve reliability and UX.</li>
                </ul>
                <p className="mt-2 text-sm text-muted-foreground">
                  You can control cookies in your browser settings. Blocking some types may impact your experience.
                </p>
              </Section>

              <Separator />

              {/* Sharing */}
              <Section id="sharing" title="Sharing with Third Parties" Icon={Globe}>
                <p className="mb-2">We don’t sell personal data. We share limited info with:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li><strong>Service providers</strong> (e.g., hosting, analytics, file processing) under contract.</li>
                  <li><strong>Security & fraud prevention</strong> partners when needed to protect users.</li>
                  <li><strong>Legal</strong> requests, if required by law or to protect rights, safety, or property.</li>
                </ul>
              </Section>

              <Separator />

              {/* Transfers */}
              <Section id="transfers" title="International Transfers" Icon={Globe}>
                <p>
                  Your data may be processed in countries different from your own. When we transfer data, we use appropriate
                  safeguards (e.g., standard contractual clauses) as required by law.
                </p>
              </Section>

              <Separator />

              {/* Retention */}
              <Section id="retention" title="Data Retention" Icon={Clock}>
                <p>
                  We keep information only for as long as necessary to provide the service and fulfill the purposes above.
                  You may delete your content or account at any time; we’ll then remove associated data unless retention is
                  required for legal, security, or operational reasons (e.g., backups).
                </p>
              </Section>

              <Separator />

              {/* Rights */}
              <Section id="your-rights" title="Your Rights" Icon={UserCheck}>
                <ul className="list-disc space-y-2 pl-5">
                  <li><strong>Access</strong> your data and get a copy.</li>
                  <li><strong>Rectify</strong> inaccurate or incomplete information.</li>
                  <li><strong>Delete</strong> your account and associated data (subject to legal limits).</li>
                  <li><strong>Restrict or object</strong> to certain processing.</li>
                  <li><strong>Portability</strong>: receive data in a portable format where applicable.</li>
                  <li><strong>Withdraw consent</strong> where we rely on it.</li>
                </ul>
                <p className="mt-2 text-sm text-muted-foreground">
                  To exercise these rights, see <Link href="#contact" className="underline">Contact Us</Link>.
                </p>
              </Section>

              <Separator />

              {/* Security */}
              <Section id="security" title="Security" Icon={Lock}>
                <p>
                  We use technical and organizational measures to protect your data (e.g., encryption in transit, access
                  controls, monitoring). No system is perfectly secure, but we work continuously to improve our defenses.
                </p>
              </Section>

              <Separator />

              {/* Children */}
              <Section id="children" title="Children’s Privacy" Icon={AlertTriangle}>
                <p>
                  Our services aren’t directed to children under 13 (or the minimum age in your jurisdiction). If you
                  believe a child provided us personal information, please contact us so we can take appropriate action.
                </p>
              </Section>

              <Separator />

              {/* Changes */}
              <Section id="changes" title="Changes to this Policy" Icon={FileCheck}>
                <p>
                  We may update this policy to reflect changes in our practices or legal requirements. We’ll adjust the
                  “Last updated” date and, when appropriate, notify you in-product or by email.
                </p>
              </Section>

              <Separator />

              {/* Contact */}
              <Section id="contact" title="Contact Us" Icon={Mail}>
                <p className="mb-2">
                  Questions or requests? We’re here to help.
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Email: <a className="underline" href="mailto:privacy@example.com">privacy@example.com</a></li>
                  <li>Subject: <span className="font-mono text-sm">Privacy Request</span></li>
                </ul>
              </Section>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-1/3">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-base">Quick Links</CardTitle>
              <CardDescription>Jump to a section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {sections.map(({ id, label, icon: Icon }) => (
                <Link
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-2 rounded-md border p-2 text-sm hover:bg-muted"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{label}</span>
                </Link>
              ))}
            </CardContent>
          </Card>

          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Privacy</CardTitle>
                <CardDescription>Short reminders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• You control what you upload and can delete it anytime.</p>
                <p>• We don’t sell your personal data.</p>
                <p>• You can request a copy of your data.</p>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  Icon,
  children,
}: {
  id: string;
  title: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
