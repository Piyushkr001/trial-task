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
  ScrollText, Scale, FileText, CreditCard, Ban,
  Shield, User, Globe, AlertTriangle, Mail,
} from "lucide-react";

const LAST_UPDATED = "Oct 19, 2025";

const sections = [
  { id: "acceptance", label: "Acceptance of Terms", icon: ScrollText },
  { id: "eligibility", label: "Eligibility & Accounts", icon: User },
  { id: "use-license", label: "License & Acceptable Use", icon: FileText },
  { id: "prohibited", label: "Prohibited Conduct", icon: Ban },
  { id: "billing", label: "Subscriptions & Billing", icon: CreditCard },
  { id: "content", label: "Your Content", icon: FileText },
  { id: "ip", label: "Intellectual Property", icon: Shield },
  { id: "third-parties", label: "Third-Party Services", icon: Globe },
  { id: "disclaimer", label: "Disclaimers", icon: AlertTriangle },
  { id: "liability", label: "Limitation of Liability", icon: Scale },
  { id: "indemnity", label: "Indemnification", icon: Shield },
  { id: "termination", label: "Termination", icon: Ban },
  { id: "law", label: "Governing Law", icon: Scale },
  { id: "changes", label: "Changes to Terms", icon: ScrollText },
  { id: "contact", label: "Contact Us", icon: Mail },
] as const;

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ScrollText className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Terms of Service</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Please read these terms carefully before using our services.
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1">
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
                These Terms govern your access to and use of our website and services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTitle>Heads up</AlertTitle>
                <AlertDescription>
                  This summary is for convenience only. The binding terms are detailed below.
                </AlertDescription>
              </Alert>

              <Separator />

              <Section id="acceptance" title="Acceptance of Terms" Icon={ScrollText}>
                <p>
                  By creating an account, accessing, or using the services, you agree to be bound by these Terms and our
                  Privacy Policy. If you do not agree, you must not use the services.
                </p>
              </Section>

              <Separator />

              <Section id="eligibility" title="Eligibility & Accounts" Icon={User}>
                <ul className="list-disc space-y-2 pl-5">
                  <li>You must be at least the age of majority in your jurisdiction to use the services.</li>
                  <li>You are responsible for maintaining the confidentiality of your account and credentials.</li>
                  <li>You must provide accurate information and update it as necessary.</li>
                </ul>
              </Section>

              <Separator />

              <Section id="use-license" title="License & Acceptable Use" Icon={FileText}>
                <p className="mb-2">
                  We grant you a limited, non-exclusive, non-transferable license to access and use the services for your
                  personal or internal business purposes in accordance with these Terms.
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Do not reverse engineer, copy, or resell the services without permission.</li>
                  <li>Do not circumvent security or access controls.</li>
                  <li>Comply with all applicable laws and regulations.</li>
                </ul>
              </Section>

              <Separator />

              <Section id="prohibited" title="Prohibited Conduct" Icon={Ban}>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Uploading unlawful, infringing, or harmful content.</li>
                  <li>Interfering with or disrupting the services or networks.</li>
                  <li>Using automated means without authorization (e.g., scraping, bots).</li>
                </ul>
              </Section>

              <Separator />

              <Section id="billing" title="Subscriptions & Billing" Icon={CreditCard}>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Paid features may require a subscription; fees are billed in advance per term.</li>
                  <li>Unless canceled, subscriptions auto-renew at the end of each term.</li>
                  <li>Taxes may apply. Refunds, if any, are provided at our discretion and where required by law.</li>
                </ul>
              </Section>

              <Separator />

              <Section id="content" title="Your Content" Icon={FileText}>
                <p className="mb-2">
                  You retain ownership of content you upload (e.g., resumes). You grant us a limited license to host,
                  process, and display your content solely to provide the services to you.
                </p>
                <p className="text-sm text-muted-foreground">
                  You are responsible for ensuring you have the necessary rights to upload and share your content.
                </p>
              </Section>

              <Separator />

              <Section id="ip" title="Intellectual Property" Icon={Shield}>
                <p>
                  We and our licensors own all rights, title, and interest in the services, including all software, designs,
                  and trademarks. Except for the limited license above, no rights are granted to you.
                </p>
              </Section>

              <Separator />

              <Section id="third-parties" title="Third-Party Services" Icon={Globe}>
                <p>
                  The services may integrate or link to third-party products. We are not responsible for third-party content,
                  policies, or practices. Your use is subject to their terms.
                </p>
              </Section>

              <Separator />

              <Section id="disclaimer" title="Disclaimers" Icon={AlertTriangle}>
                <p>
                  The services are provided “as is” and “as available” without warranties of any kind, whether express or
                  implied, including merchantability, fitness for a particular purpose, and non-infringement.
                </p>
              </Section>

              <Separator />

              <Section id="liability" title="Limitation of Liability" Icon={Scale}>
                <p>
                  To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special,
                  consequential, or punitive damages, or any loss of profits, revenues, data, or goodwill.
                </p>
              </Section>

              <Separator />

              <Section id="indemnity" title="Indemnification" Icon={Shield}>
                <p>
                  You agree to defend, indemnify, and hold us harmless from any claims arising out of your use of the
                  services or violation of these Terms.
                </p>
              </Section>

              <Separator />

              <Section id="termination" title="Termination" Icon={Ban}>
                <p>
                  We may suspend or terminate your access at any time for any violation of these Terms. You may stop using
                  the services at any time. Certain provisions survive termination.
                </p>
              </Section>

              <Separator />

              <Section id="law" title="Governing Law" Icon={Scale}>
                <p>
                  These Terms are governed by the laws of your applicable jurisdiction, without regard to its conflict of
                  laws principles. Venue and exclusive jurisdiction will lie in the competent courts of that jurisdiction.
                </p>
              </Section>

              <Separator />

              <Section id="changes" title="Changes to Terms" Icon={ScrollText}>
                <p>
                  We may update these Terms from time to time. We will update the “Last updated” date and, when appropriate,
                  provide notice through the services or via email.
                </p>
              </Section>

              <Separator />

              <Section id="contact" title="Contact Us" Icon={Mail}>
                <p>
                  Questions about these Terms? Contact us at{" "}
                  <a className="underline" href="mailto:legal@example.com">legal@example.com</a>.
                </p>
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
                <CardTitle className="text-base">Summary</CardTitle>
                <CardDescription>Not legal advice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Use the service responsibly and lawfully.</p>
                <p>• Paid features may auto-renew unless canceled.</p>
                <p>• We’re not liable for indirect or special damages.</p>
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
