"use client";

import Toolbar from "@/components/Toolbar";
import useMediaQuery from "@/hooks/useMediaQuery";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const isMonitor = useMediaQuery("(min-width: 1600px)", false);

  return (
    <React.Fragment>
      {isMonitor && <Toolbar variant="monitor" />}
      {/* TODO: Maybe constrain to 100vh  */}
      <main className="mx-auto h-auto min-h-[calc(100vh-4rem)] max-w-4xl flex-[3] monitor:min-h-screen">
        {children}
      </main>
      {!isMonitor && <Toolbar variant="mobile" />}
      {isMonitor && <div className="flex-1" />}
    </React.Fragment>
  );
}
