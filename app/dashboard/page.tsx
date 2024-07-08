import { auth } from "@/auth";
import React from "react";
import { getProjectInfo } from "../project/actions";

const page = async () => {
  const session = await auth();
  const info = await getProjectInfo();
  return (
    <div className="h-screen">
      <h1>dashboard</h1>
      <p>{JSON.stringify(session)}</p>
      <p>{JSON.stringify(info)}</p>
      <p>test page for dashboard</p>
    </div>
  );
};

export default page;
