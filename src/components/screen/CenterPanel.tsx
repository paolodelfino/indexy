import MobileToolbar from "@/components/toolbar/MobileToolbar";

export default function CenterPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex max-h-screen w-full max-w-4xl flex-col pb-16 monitor:max-h-full monitor:flex-[3]">
      <div className="overflow-y-auto p-px pb-16 scrollbar-hidden">
        {children}
      </div>
      <MobileToolbar />
    </main>
  );
}
