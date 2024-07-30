import * as React from "react";

import { cn } from "@/lib/utils";
import Icon from "./Icon";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  submitButton?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, submitButton, ...props }, ref) => {
    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[100px] w-full h-fit overflow-hidden rounded-md border border-input bg-background px-2.5 py-2.5 text-body-md-n ring-offset-background resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {submitButton && (
          <button className="absolute w-5 h-5 right-2.5 bottom-2.5">
            <Icon icon="send" className="fill-foreground" />
          </button>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
