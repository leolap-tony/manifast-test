import Header from "@/components/navigation/Header";
import { Skeleton } from "@/components/ui/skeleton";

import React from "react";

export default function Loading() {
  return (
    <section className="page-section">
      <Header type="section" title={<Skeleton className="w-[320px] h-10" />} />
      <div className="w-full h-[60vh] px-6">
        <Skeleton className="w-full h-full" />
      </div>
    </section>
  );
}
