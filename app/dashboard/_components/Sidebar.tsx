"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  Settings,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@clerk/nextjs";

type Item = { label: string; href: string; icon: React.ElementType };

const NAV: Item[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resumes", href: "/dashboard/resumes", icon: FileText },
  { label: "Templates", href: "/templates", icon: LayoutTemplate },
  { label: "Profile", href: "/dashboard/profile", icon: User2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <UserAvatar/>
        <h2>DashBoard</h2>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {NAV.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNav}
              className={[
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* CTA */}
      <div className="border-t p-3">
        <Button asChild className="w-full">
          <Link href="/get-started">Create New Resume</Link>
        </Button>
      </div>
    </aside>
  );
}
