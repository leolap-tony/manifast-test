import KeyValueLabel from "@/components/elements/KeyValueLabel";
import Header from "@/components/navigation/Header";
import { Skeleton } from "@/components/ui/skeleton";

import React from "react";

export default function Loading() {
  return (
    <>
      <Header type="page" title={<Skeleton className="w-[320px] h-10" />} />
      <section className="page-section">
        <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-background-light">
          <KeyValueLabel
            direction="row"
            label={<Skeleton className="w-[80px] h-4" />}
            labelWidth={86}
          >
            <Skeleton className="w-[180px] h-6" />
          </KeyValueLabel>
          <KeyValueLabel
            direction="row"
            label={<Skeleton className="w-[80px] h-4" />}
            labelWidth={86}
          >
            <Skeleton className="w-[180px] h-6" />
          </KeyValueLabel>
          <KeyValueLabel
            direction="row"
            label={<Skeleton className="w-[80px] h-4" />}
            labelWidth={86}
          >
            <Skeleton className="w-[180px] h-6" />
          </KeyValueLabel>
          <KeyValueLabel
            direction="row"
            label={<Skeleton className="w-[80px] h-4" />}
            labelWidth={86}
          >
            <Skeleton className="w-[180px] h-6" />
          </KeyValueLabel>
          <KeyValueLabel
            direction="row"
            label={<Skeleton className="w-[80px] h-4" />}
            labelWidth={86}
          >
            <Skeleton className="w-[180px] h-6" />
          </KeyValueLabel>
          <KeyValueLabel
            direction="row"
            label={<Skeleton className="w-[80px] h-4" />}
            labelWidth={86}
          >
            <Skeleton className="w-[180px] h-6" />
          </KeyValueLabel>
        </div>
      </section>
    </>
  );
}
