import { auth } from "@/auth";
import React from "react";
import { getProjectInfo } from "../project/actions";

const page = async () => {
  const session = await auth();
  return (
    <div className="h-screen">
      <h1>dashboard</h1>
      <p>{JSON.stringify(session)}</p>
      <p>test page for dashboard</p>
    </div>
  );
};

export default page;
