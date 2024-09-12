import Providers from "@/components/Providers";
import CenterPanel from "@/components/screen/CenterPanel";
import LeftPanel from "@/components/screen/LeftPanel";
import RightPanel from "@/components/screen/RightPanel";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  rightPanel,
}: Readonly<{
  children: React.ReactNode;
  rightPanel: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} mx-auto flex max-w-screen-monitor bg-black font-sans text-white`}
      >
        <Providers>
          <LeftPanel />
          <CenterPanel>{children}</CenterPanel>
          <RightPanel>{rightPanel}</RightPanel>
        </Providers>
      </body>
    </html>
  );
}
