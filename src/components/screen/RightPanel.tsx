"use client"; // TODO: Forse questo pannello non dovrebbe essere un ClientComponent
import { useMediaQuery } from "@mantine/hooks";

export default function RightPanel() {
  const isMonitor = useMediaQuery("(min-width: 1600px)", false);

  if (isMonitor) {
    return <div className="flex-1" />;
  }
}
