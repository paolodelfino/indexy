"use client";
import { useMediaQuery } from "@mantine/hooks";

// TODO: Take more space

export default function RightPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMonitor = useMediaQuery("(min-width: 1600px)", false);

  if (isMonitor) {
    return <div className="flex-1 overflow-hidden p-2">{children}</div>;
  }
}
