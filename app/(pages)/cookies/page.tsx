"use client";

import * as React from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import {
  Cookie, ShieldCheck, Info, Settings2, RotateCcw, CheckCircle2,
} from "lucide-react";

type CookiePrefs = {
  essential: boolean;   // always on (locked)
  functional: boolean;
  analytics: boolean;
  performance: boolean;
  marketing: boolean;
};

const DEFAULT_PREFS: CookiePrefs = {
  essential: true,
  functional: true,
  analytics: true,
  performance: true,
  marketing: false,
};

const STORAGE_KEY = "cookie:prefs:v1";

function loadPrefs(): CookiePrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

export default function CookiesPage() {
  const [prefs, setPrefs] = React.useState<CookiePrefs>(DEFAULT_PREFS);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  function update(key: keyof CookiePrefs, v: boolean) {
    // essential cannot be turned off
    if (key === "essential") return;
    setPrefs((p) => ({ ...p, [key]: v }));
    setSaved(false);
  }

  function save() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function reset() {
    setPrefs(DEFAULT_PREFS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PREFS));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cookie className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Cookies</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Learn how we use cookies and manage your preferences.
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1">
          <ShieldCheck className="h-3.5 w-3.5" /> GDPR/CCPA friendly
        </Badge>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left column: Policy & Details */}
        <section className="w-full lg:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>How we use cookies</CardTitle>
              <CardDescription>
                Cookies help us provide, protect, and improve the product experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>What is a cookie?</AlertTitle>
                <AlertDescription>
                  A small text file placed on your device that stores settings and identifiers
                  for your browser. Some cookies are strictly necessary; others are optional.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border p-4">
                  <div className="mb-1 text-sm font-medium">Essential</div>
                  <p className="text-sm text-muted-foreground">
                    Needed for core functionality like authentication, security, and basic site features.
                    Always on.
                  </p>
                </div>
                <div className="rounded-md border p-4">
                  <div className="mb-1 text-sm font-medium">Functional</div>
                  <p className="text-sm text-muted-foreground">
                    Remember choices (language, theme) and enhance usability without tracking across sites.
                  </p>
                </div>
                <div className="rounded-md border p-4">
                  <div className="mb-1 text-sm font-medium">Analytics</div>
                  <p className="text-sm text-muted-foreground">
                    Help us understand usage and improve performance via aggregated metrics.
                  </p>
                </div>
                <div className="rounded-md border p-4">
                  <div className="mb-1 text-sm font-medium">Performance</div>
                  <p className="text-sm text-muted-foreground">
                    Measure load times and reliability to keep things fast and stable.
                  </p>
                </div>
                <div className="rounded-md border p-4 sm:col-span-2">
                  <div className="mb-1 text-sm font-medium">Marketing</div>
                  <p className="text-sm text-muted-foreground">
                    Personalize content or ads. Off by default; only enabled with consent.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Cookie inventory (example)</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[160px]">Name</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead className="hidden md:table-cell">Provider</TableHead>
                        <TableHead className="hidden sm:table-cell">Expiry</TableHead>
                        <TableHead className="hidden sm:table-cell">Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>__session</TableCell>
                        <TableCell>Authentication / session management</TableCell>
                        <TableCell className="hidden md:table-cell">First-party</TableCell>
                        <TableCell className="hidden sm:table-cell">Session</TableCell>
                        <TableCell className="hidden sm:table-cell">Essential</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>pref_lang</TableCell>
                        <TableCell>Stores language preference</TableCell>
                        <TableCell className="hidden md:table-cell">First-party</TableCell>
                        <TableCell className="hidden sm:table-cell">6 months</TableCell>
                        <TableCell className="hidden sm:table-cell">Functional</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>analytics_id</TableCell>
                        <TableCell>Aggregated usage analytics</TableCell>
                        <TableCell className="hidden md:table-cell">First-party</TableCell>
                        <TableCell className="hidden sm:table-cell">1 year</TableCell>
                        <TableCell className="hidden sm:table-cell">Analytics</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>perf_beacon</TableCell>
                        <TableCell>Measures performance timings</TableCell>
                        <TableCell className="hidden md:table-cell">First-party</TableCell>
                        <TableCell className="hidden sm:table-cell">90 days</TableCell>
                        <TableCell className="hidden sm:table-cell">Performance</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>mkt_campaign</TableCell>
                        <TableCell>Remembers campaign attribution</TableCell>
                        <TableCell className="hidden md:table-cell">First/Third-party</TableCell>
                        <TableCell className="hidden sm:table-cell">30 days</TableCell>
                        <TableCell className="hidden sm:table-cell">Marketing</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <p className="text-xs text-muted-foreground">
                  Note: The actual cookies and retention may change as we evolve our product.
                </p>
              </div>

              <Separator />

              <div className="text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Right column: Preferences */}
        <aside className="w-full lg:w-1/3">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Manage preferences
              </CardTitle>
              <CardDescription>Choose which optional cookies we can use.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">Essential</div>
                  <p className="text-xs text-muted-foreground">
                    Required for the site to work. Cannot be disabled.
                  </p>
                </div>
                <Switch checked={true} disabled aria-readonly />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">Functional</div>
                  <p className="text-xs text-muted-foreground">Saves your preferences.</p>
                </div>
                <Switch
                  checked={prefs.functional}
                  onCheckedChange={(v) => update("functional", v)}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">Analytics</div>
                  <p className="text-xs text-muted-foreground">Helps us improve via anonymized data.</p>
                </div>
                <Switch
                  checked={prefs.analytics}
                  onCheckedChange={(v) => update("analytics", v)}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">Performance</div>
                  <p className="text-xs text-muted-foreground">Keeps things fast and reliable.</p>
                </div>
                <Switch
                  checked={prefs.performance}
                  onCheckedChange={(v) => update("performance", v)}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">Marketing</div>
                  <p className="text-xs text-muted-foreground">Personalized content or ads.</p>
                </div>
                <Switch
                  checked={prefs.marketing}
                  onCheckedChange={(v) => update("marketing", v)}
                />
              </div>

              <Separator />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button variant="outline" className="gap-2" onClick={reset}>
                  <RotateCcw className="h-4 w-4" /> Reset to defaults
                </Button>
                <Button className="gap-2" onClick={save}>
                  {saved ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Save preferences
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Your choices are stored in your browser. Clearing cookies will reset your preferences.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
