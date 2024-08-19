"use client";

import React, { useRef, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../elements/Toggle-group";
import { Textarea } from "../elements/Textarea";
import { Button } from "../elements/Button";
import { useSession } from "next-auth/react";
import { postThreadMessage } from "@/app/(work)/project/actions";

export default function ThreadChatInput({ projectId }: { projectId: string }) {
  const [messageType, setMessageType] = useState("MESSAGE");
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const session = useSession();
  const handleSubmit = async () => {
    if (messageType === "PROJECT_REPORT_START") {
    }
    if (messageType === "PROJECT_REPORT_STOP") {
    }
    if (messageType === "MESSAGE") {
      await postThreadMessage({
        projectId,
        type: messageType,
        authorId: session.data?.user.sub,
        message: messageRef.current?.value,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full p-4 items-start"
    >
      <div className="relative w-full">
        <ToggleGroup
          type="single"
          className="border w-fit mb-2 rounded-md"
          onValueChange={(e) => setMessageType(e)}
        >
          <ToggleGroupItem value="MESSAGE">메시지</ToggleGroupItem>
          <ToggleGroupItem value="PROJECT_REPORT_START">시작</ToggleGroupItem>
          <ToggleGroupItem value="PROJECT_REPORT_STOP">중단</ToggleGroupItem>
        </ToggleGroup>
        {messageType === "MESSAGE" ? (
          <Textarea
            ref={messageRef}
            placeholder="메시지를 입력하세요."
            name="message"
            submitButton
          />
        ) : (
          <Button>{messageType}</Button>
        )}
      </div>
    </form>
  );
}
