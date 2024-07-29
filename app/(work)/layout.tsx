import SideNav from "@/components/navigation/SideNav";

export default function WorkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SideNav />
      {children}
    </>
  );
}
