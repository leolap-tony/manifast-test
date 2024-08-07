import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="w-full h-[500px] p-6">
      <Skeleton className="w-full h-full rounded-md" />
    </div>
  );
}
