import KeyValueLabel from "@/components/elements/KeyValueLabel";
import Header from "@/components/navigation/Header";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import React from "react";

export default function Loading() {
  return (
    <section className="page-contents">
      <div className="w-full px-6 flex flex-col gap-6">
        <Skeleton className="w-full h-[140px]" />
        <Skeleton className="w-full h-[140px]" />
        <Skeleton className="w-full h-[140px]" />
      </div>
    </section>
  );
}
