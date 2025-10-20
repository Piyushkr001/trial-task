"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Twitter, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  const onSubscribe: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // TODO: hook this up to your API or service (Resend/Mailchimp/etc.)
    // const email = new FormData(e.currentTarget).get("email");
    // await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) });
  };

  return (
    <footer className="mt-16 border-t bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-12">
        {/* Top: brand + columns */}
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand column */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <Image
                src="/Images/Logo/logo.svg"
                alt="TrialTask logo"
                width={140}
                height={140}
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Build a dynamic, verified resume in minutes—AI summary, clean templates, and export-ready layouts.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <Button asChild variant="ghost" size="icon" aria-label="GitHub">
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" aria-label="LinkedIn">
                <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" aria-label="Twitter / X">
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" aria-label="Email">
                <Link href="mailto:hello@trialtask.app">
                  <Mail className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 md:max-w-3xl">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold">Product</h4>
              <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link>
              <Link href="/dashboard/templates" className="text-sm text-muted-foreground hover:text-foreground">Templates</Link>
              <Link href="/changelog" className="text-sm text-muted-foreground hover:text-foreground">Changelog</Link>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold">Resources</h4>
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">Docs</Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
              <Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground">Guides</Link>
            </div>

            <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
              <h4 className="text-sm font-semibold">Company</h4>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>© {year} TrialTask. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/cookies" className="hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
