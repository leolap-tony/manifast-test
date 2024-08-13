import KeyValueLabel from "@/components/elements/KeyValueLabel";
import { Tabs, TabsList, TabsTrigger } from "@/components/elements/Tabs";
import Header from "@/components/navigation/Header";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <section className="page-section">
      <Header
        type="section"
        title={<Skeleton className="w-[50px] h-6 rounded-md" />}
      ></Header>
      <div className="flex flex-col gap-3 px-6 mb-6">
        <KeyValueLabel
          label={<Skeleton className="w-[50px] h-5 rounded-md" />}
          direction="row"
          labelWidth={80}
        >
          <Skeleton className="w-[80px] h-5 rounded-md" />
        </KeyValueLabel>
        <KeyValueLabel
          label={<Skeleton className="w-[50px] h-5  rounded-md" />}
          direction="row"
          labelWidth={80}
        >
          <Skeleton className="w-[120px] h-5 rounded-md" />
        </KeyValueLabel>
        <KeyValueLabel
          label={<Skeleton className="w-[30px] h-5  rounded-md" />}
          direction="row"
          labelWidth={80}
        >
          <Skeleton className="w-[30px] h-5 rounded-md" />
        </KeyValueLabel>
        <KeyValueLabel
          label={<Skeleton className="w-[40px] h-5  rounded-md" />}
          direction="row"
          labelWidth={80}
        >
          <Skeleton className="w-[80px] h-5 rounded-md" />
        </KeyValueLabel>
        <KeyValueLabel
          label={<Skeleton className="w-[44px] h-5 rounded-md" />}
          direction="row"
          labelWidth={80}
        >
          <Skeleton className="w-[80px] h-5 rounded-md" />
        </KeyValueLabel>
        <KeyValueLabel
          label={<Skeleton className="w-[36px] h-5  rounded-md" />}
          direction="row"
          labelWidth={80}
        >
          <Skeleton className="w-[80px] h-5 rounded-md" />
        </KeyValueLabel>
        <KeyValueLabel
          label={<Skeleton className="w-[120px] h-5 rounded-md" />}
          direction="row"
          labelWidth={80}
        >
          <Skeleton className="w-10 h-10 rounded-full" />
        </KeyValueLabel>
      </div>
    </section>
  );
}
