"use client";
import MonitorToolbar from "@/components/toolbar/MonitorToolbar";
import { useMediaQuery } from "@mantine/hooks";

export default function LeftPanel() {
  const isMonitor = useMediaQuery("(min-width: 1600px)", false);

  if (isMonitor) {
    return (
      <div className="flex-1">
        <MonitorToolbar />
      </div>
    );
  }
}
