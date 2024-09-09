"use client";
import { useMediaQuery } from "@mantine/hooks";

export default function RightPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMonitor = useMediaQuery("(min-width: 1600px)", false);

  if (isMonitor) {
    return <div className="flex-1">{children}</div>;
  }
}
