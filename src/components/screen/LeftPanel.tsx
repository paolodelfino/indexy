"use client";
import Toolbar from "@/components/Toolbar";
import { useMediaQuery } from "@mantine/hooks";

export default function LeftPanel() {
  const isMonitor = useMediaQuery("(min-width: 1600px)", false);

  if (isMonitor) {
    return (
      <div className="flex-1">
        <Toolbar variant="monitor" />
      </div>
    );
  }
}
