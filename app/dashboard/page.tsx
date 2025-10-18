"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Menu,
  Download,
  Wand2,
  Shield,
  LayoutTemplate,
  FileText,
  FilePlus2,
} from "lucide-react";
import { DashboardSidebar } from "./_components/Sidebar";
import { ModeToggle } from "@/components/ModeToggle";
import { UserButton } from "@clerk/nextjs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/* Types expected from /api/dashboard */
type DashboardStats = {
  totalResumes: number;
  templatesUsed: number;
  lastExportDate: string | null;
  profileCompletion: number;
  linkedCertificates: number;
  pendingVerifications: number;
};
type DashboardActivity = {
  id: string;
  item: string;
  type: "Resume" | "Template" | "AI Summary" | "Verification";
  status: string;
  updatedAt: string;
};
type DashboardPayload = {
  stats: DashboardStats;
  recentActivity: DashboardActivity[];
};

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to load");
    return r.json() as Promise<DashboardPayload>;
  });

function formatDay(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "2-digit" });
}

export default function DashboardPage() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const { data, error, isLoading } = useSWR<DashboardPayload>("/api/dashboard", fetcher, {
    revalidateOnFocus: false,
  });

  const stats = data?.stats;
  const activities = data?.recentActivity ?? [];

  const profileBadge =
    (stats?.profileCompletion ?? 0) >= 80 ? "Good" :
    (stats?.profileCompletion ?? 0) >= 50 ? "Average" : "Low";

  return (
    <div className="flex min-h-[100dvh]">
      {/* Desktop sidebar */}
      <div className="hidden w-64 border-r md:block">
        <DashboardSidebar />
      </div>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
          <div className="flex h-14 items-center gap-2 px-4 sm:px-6 lg:px-8">
            {/* Mobile: open sidebar */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" aria-label="Open navigation">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <DashboardSidebar onNav={() => setOpen(false)} />
              </SheetContent>
            </Sheet>

            {/* Search */}
            <div className="relative ml-0 flex w-full max-w-xl items-center sm:ml-1">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input className="w-full pl-9" placeholder="Search resumes, templates, or activity…" />
            </div>

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" className="hidden gap-2 sm:flex" onClick={() => router.push("/get-started")}>
                <Plus className="h-4 w-4" /> New Resume
              </Button>
              <ModeToggle />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
          {/* Error state */}
          {error && (
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle>Couldn’t load your dashboard</CardTitle>
                <CardDescription>Please refresh or try again later.</CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Top stats */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                <CardDescription>All versions you created</CardDescription>
              </CardHeader>
              <CardContent className="flex items-baseline justify-between">
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-6 w-20" />
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold">{stats?.totalResumes ?? 0}</div>
                    <Badge variant="secondary">auto</Badge>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Templates Used</CardTitle>
                <CardDescription>Classic, Modern, Compact</CardDescription>
              </CardHeader>
              <CardContent className="flex items-baseline justify-between">
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-24" />
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold">{stats?.templatesUsed ?? 0}</div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/templates" className="gap-1">
                        Explore <LayoutTemplate className="h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last Export</CardTitle>
                <CardDescription>PDF downloads</CardDescription>
              </CardHeader>
              <CardContent className="flex items-baseline justify-between">
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold">{formatDay(stats?.lastExportDate ?? null)}</div>
                    <Button variant="ghost" size="sm" className="gap-1" asChild>
                      <Link href="/dashboard/exports">
                        <Download className="h-4 w-4" /> View
                      </Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
                <CardDescription>Fill details for better AI results</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <Skeleton className="h-5 w-10" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                  </>
                ) : (
                  <>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span>{stats?.profileCompletion ?? 0}%</span>
                      <Badge variant="outline">{profileBadge}</Badge>
                    </div>
                    <Progress value={stats?.profileCompletion ?? 0} />
                  </>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Quick actions + AI */}
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Start faster with shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button className="gap-2" onClick={() => router.push("/get-started")}>
                    <FilePlus2 className="h-4 w-4" />
                    New Resume
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => router.push("/dashboard/import")}>
                    <Download className="h-4 w-4" />
                    Import Data
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => router.push("/templates")}>
                    <LayoutTemplate className="h-4 w-4" />
                    Pick Template
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-[50ch] text-sm text-muted-foreground">
                    Let AI craft your professional summary & bullet points from your raw notes.
                  </div>
                  <Button variant="secondary" className="gap-2" onClick={() => router.push("/dashboard/ai-summary")}>
                    <Wand2 className="h-4 w-4" />
                    Generate AI Summary
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verification
                </CardTitle>
                <CardDescription>Keep credentials up to date</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-6 w-8" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-6 w-8" />
                    </div>
                    <Skeleton className="mt-2 h-9 w-full" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Linked certificates</span>
                      <Badge variant="secondary">{stats?.linkedCertificates ?? 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pending verifications</span>
                      <Badge variant="outline">{stats?.pendingVerifications ?? 0}</Badge>
                    </div>
                    <Button variant="outline" className="mt-2 w-full" asChild>
                      <Link href="/dashboard/verification">Manage</Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Recent activity */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest changes to your resumes & templates</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-2/5" />
                  </div>
                ) : activities.length === 0 ? (
                  <div className="p-6 text-sm text-muted-foreground">No recent activity yet.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Item</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden sm:table-cell">Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.item}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{r.type}</Badge>
                          </TableCell>
                          <TableCell>{r.status}</TableCell>
                          <TableCell className="hidden sm:table-cell">{formatDay(r.updatedAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
