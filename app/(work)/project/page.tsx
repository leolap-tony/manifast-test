import React, { Suspense } from "react";
import Link from "next/link";

import { Button } from "@/components/elements/Button";

import Header from "@/components/navigation/Header";
import MyProjects from "@/components/tables/MyProjects";
import Loading from "./loading";

export default function page() {
  return (
    <main className="page-contents">
      <Header type="page" title="프로젝트">
        <Button asChild>
          <Link href="/project/request">프로젝트 요청</Link>
        </Button>
      </Header>
      <Suspense fallback={<Loading />}>
        <MyProjects />
      </Suspense>
    </main>
  );
}
