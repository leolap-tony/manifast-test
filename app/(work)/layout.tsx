import { TooltipProvider } from "@/components/elements/Tooltip";
import SideNav from "@/components/navigation/SideNav";

export default function WorkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TooltipProvider>
      <SideNav />
      {children}
    </TooltipProvider>
  );
}
