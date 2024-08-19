import Header from "@/components/navigation/Header";
export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="page-layout">
      <Header type="dashboard" />
      {children}
    </main>
  );
}
