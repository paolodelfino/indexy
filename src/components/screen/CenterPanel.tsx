import Toolbar from "@/components/Toolbar";

export default function CenterPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex max-h-screen w-full max-w-4xl flex-col pb-16 monitor:max-h-full monitor:max-w-6xl monitor:flex-[3]">
      <div className="overflow-y-auto scrollbar-hidden">{children}</div>
      <Toolbar variant="mobile" />
      {/* TODO: Why don't I use monitor instead of mini prop? */}
    </main>
  );
}
