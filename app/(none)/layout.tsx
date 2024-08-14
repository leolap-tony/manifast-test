import Logo from "@/components/elements/Logo";

export default function WorkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="page-layout h-[100vh] relative">
      <div className="absolute top-8 left-9">
        <Logo />
      </div>
      {children}
    </main>
  );
}
