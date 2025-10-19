// app/dashboard/layout.tsx
"use client";

import * as React from "react";
import { DashboardSidebar } from "./_components/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-[100dvh]">
      {/* Desktop sidebar */}
      <aside
        className="hidden w-64 shrink-0 border-r md:block"
        role="complementary"
        aria-label="Dashboard sidebar"
      >
        <DashboardSidebar />
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
