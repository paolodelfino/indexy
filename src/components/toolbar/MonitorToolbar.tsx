"use client";
import Toolbar from "@/components/toolbar/Toolbar";
import { useMediaQuery } from "@mantine/hooks";

export default function MonitorToolbar() {
  const isMonitor = useMediaQuery("(min-width: 1600px)", false);

  if (isMonitor) return <Toolbar variant="monitor" />;
}
