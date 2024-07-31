import React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { User } from "next-auth";
import { cva, type VariantProps } from "class-variance-authority";

interface AvatarProps {
  size?: "xl" | "lg" | "md";
  label?: boolean;
  user: Pick<User, "image" | "name">;
}

const avatarVariants = cva(
  "inline-flex select-none items-center justify-center overflow-hidden rounded-full align-middle border",
  {
    variants: {
      size: {
        xl: "w-10 h-10",
        lg: "w-7 h-7",
        md: "w-6 h-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const labelVariants = cva("h-ful text-nowrap", {
  variants: {
    size: {
      xl: "text-title-sm",
      lg: "text-title-lg",
      md: "text-body-md-n",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export default function UserAvatar({
  size = "md",
  label = false,
  user,
}: AvatarProps) {
  return (
    user && (
      <div className="flex flex-row items-center gap-2">
        <Avatar.Root className={avatarVariants({ size })}>
          <Avatar.AvatarImage
            src={user.image as string}
            className="w-full h-full object-cover"
            alt={user.name as string}
          />
          <Avatar.AvatarFallback>ER</Avatar.AvatarFallback>
        </Avatar.Root>
        {label && <div className={labelVariants({ size })}>{user?.name}</div>}
      </div>
    )
  );
}
