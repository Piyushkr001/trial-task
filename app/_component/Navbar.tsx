"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ModeToggle";

import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { api } from "@/lib/axios";

type NavItem = { label: string; href: string };

const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Docs", href: "/docs" },
  { label: "Contact", href: "/contact" },
];

function NavLink({
  item,
  activePath,
}: {
  item: NavItem;
  activePath: string;
}) {
  const isActive =
    item.href === "/"
      ? activePath === "/"
      : activePath.startsWith(item.href) && item.href !== "/";

  const isDashboard = item.href === "/dashboard";
  const isDashboardActive =
    isDashboard && (activePath === "/dashboard" || activePath.startsWith("/dashboard"));

  // If this is the Dashboard link and we're already on /dashboard*, render a disabled pill
  if (isDashboardActive) {
    return (
      <span
        aria-current="page"
        aria-disabled="true"
        className={[
          "rounded-md px-2.5 py-2 text-sm font-medium sm:px-3",
          "bg-accent text-accent-foreground",
          "cursor-not-allowed opacity-60 pointer-events-none",
        ].join(" ")}
      >
        {item.label}
      </span>
    );
  }

  // Normal link
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={[
        "rounded-md px-2.5 py-2 text-sm font-medium transition-colors sm:px-3",
        "hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "text-foreground/80",
      ].join(" ")}
    >
      {item.label}
    </Link>
  );
}

export default function SiteNavbar() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();
  const didSync = React.useRef(false);

  // One-time user sync after sign-in
  React.useEffect(() => {
    if (!isSignedIn || !user || didSync.current) return;
    didSync.current = true;

    api.post("/api/me").catch((err) => console.error("User sync failed", err));

    const email =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ?? user.emailAddresses[0]?.emailAddress;

    api
      .post("/api/users", {
        email,
        name: user.fullName || email?.split("@")[0],
        imageUrl: user.imageUrl,
      })
      .catch((err) => console.error("User upsert failed", err));
  }, [isSignedIn, user?.id]);

  const onDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* wider responsive gutters */}
      <div className="mx-auto flex h-14 items-center justify-between gap-2 px-4 sm:h-16 sm:gap-3 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* Left: Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/Images/Logo/logo.svg"
            alt="TrialTask logo"
            width={150}
            height={150}
            className="h-9 w-auto sm:h-10"
            priority
          />
        </Link>

        {/* Middle: Desktop nav */}
        <nav className="hidden items-center gap-1.5 md:flex lg:gap-2">
          {NAV.map((it) => (
            <NavLink key={it.href} item={it} activePath={pathname} />
          ))}
        </nav>

        {/* Right: Actions (Desktop) */}
        <div className="hidden items-center gap-1.5 sm:gap-2 md:flex">
          <ModeToggle />
          <SignedOut>
            <Button variant="ghost" asChild className="px-3">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="px-4">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            {/* Disable the Dashboard button if we're already on dashboard */}
            {onDashboard ? (
              <Button disabled aria-disabled className="px-4 cursor-not-allowed opacity-60">
                Dashboard
              </Button>
            ) : (
              <Button asChild className="px-4">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            )}
          </SignedIn>
        </div>

        {/* Mobile: Menu button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            {/* narrower on small screens, caps at 24rem */}
            <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Primary navigation for TrialTask.</SheetDescription>
              </SheetHeader>

              {/* Drawer header */}
              <div className="flex items-center gap-2 px-4 py-3">
                <Image
                  src="/Images/Logo/logo.svg"
                  alt="TrialTask logo"
                  width={120}
                  height={120}
                  className="h-9 w-auto"
                />
              </div>
              <Separator />

              {/* Drawer nav */}
              <div className="flex flex-col gap-1.5 p-2">
                {NAV.map((it) => {
                  const isActive =
                    it.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(it.href) && it.href !== "/";
                  const isDashboard = it.href === "/dashboard";
                  const isDashboardActive =
                    isDashboard && (pathname === "/dashboard" || pathname.startsWith("/dashboard"));

                  if (isDashboardActive) {
                    return (
                      <span
                        key={it.href}
                        aria-current="page"
                        aria-disabled="true"
                        className="rounded-md px-3 py-2.5 text-sm font-medium bg-accent text-accent-foreground cursor-not-allowed opacity-60 pointer-events-none"
                      >
                        {it.label}
                      </span>
                    );
                  }

                  return (
                    <Link
                      key={it.href}
                      href={it.href}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        "rounded-md px-3 py-2.5 text-sm font-medium",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
                      ].join(" ")}
                    >
                      {it.label}
                    </Link>
                  );
                })}
              </div>

              <Separator className="my-2" />

              {/* Drawer actions */}
              <div className="flex items-center gap-2 p-3">
                <ModeToggle />
                <SignedOut>
                  <Button variant="ghost" asChild className="flex-1">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                  {onDashboard ? (
                    <Button className="flex-1 cursor-not-allowed opacity-60" disabled aria-disabled>
                      Dashboard
                    </Button>
                  ) : (
                    <Button asChild className="flex-1">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  )}
                </SignedIn>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
