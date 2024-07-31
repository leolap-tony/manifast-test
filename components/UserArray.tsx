import { User } from "@prisma/client";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import UserAvatar from "./elements/UserAvatar";

const userArrayStyles = cva("flex items-center", {
  variants: {
    orientation: {
      row: "flex-row",
      col: "flex-col",
    },
    isFull: {
      true: "-space-x-2 flex-row",
      false: "gap-2",
    },
  },
  compoundVariants: [
    {
      isFull: true,
      className: "flex-row -space-x-2",
    },
  ],
  defaultVariants: {
    orientation: "row",
    isFull: false,
  },
});

const UserArray = ({
  users,
  maxAmount,
  orientation,
}: {
  users: User[];
  maxAmount: number;
  orientation: "col" | "row";
}) => {
  const isFull = users.length > maxAmount;

  return (
    <div
      className={userArrayStyles({
        orientation: isFull ? "row" : orientation,
        isFull,
      })}
    >
      {users.slice(0, maxAmount).map((user, i) => (
        <UserAvatar key={i} user={user} label={!isFull} />
      ))}
      {isFull && users.length > maxAmount && (
        <div className="flex items-center justify-center w-6 h-6 bg-gray-300 rounded-full text-body-sm-n">
          +{users.length - maxAmount}
        </div>
      )}
    </div>
  );
};

export default UserArray;
