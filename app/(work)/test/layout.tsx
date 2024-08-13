import Header from "@/components/navigation/Header";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="page-contents">
      <Header type="page" title="페이지" />
      {children}
    </main>
  );
}
