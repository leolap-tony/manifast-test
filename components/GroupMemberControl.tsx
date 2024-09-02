"use client";
import { Button } from "@/components/elements/Button";
import KeyValueLabel from "@/components/elements/KeyValueLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/elements/Select";
import UserAvatar from "@/components/elements/UserAvatar";
import Header from "@/components/navigation/Header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/elements/Dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Authority, Role, User } from "@prisma/client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { updateOwner } from "../app/(work)/info/actions";

export default function GroupMemberControl({
  userId,
  groupId,
  members,
}: {
  userId: string;
  groupId: string;
  members: Partial<User>[];
}) {
  const [isOwner, setIsOwner] = useState(
    userId === members.find((member) => member.authority === "OWNER")?.id,
  );
  const [isAdmin, setIsAdmin] = useState(
    userId ===
      members.find((member) => member.authority === ("ADMIN" || "OWNER"))?.id,
  );
  const [memberState, setMemberState] = useState(members);
  const [selectedOwner, setSelectedOwner] = useState<Partial<User> | undefined>(
    members.find((member) => member.authority === "OWNER"),
  );
  const [loading, setLoading] = useState(false);

  const columns: ColumnDef<Partial<User>>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "이름",
        cell: ({ row }) => {
          return (
            <UserAvatar
              user={{ name: row.original.name, image: row.original.image }}
              label
            />
          );
        },
      },
      {
        accessorKey: "email",
        header: "이메일",
      },
      {
        accessorKey: "authority",
        header: "권한",
        cell: ({ row }) =>
          row.original.authority === "OWNER" ? (
            "그룹 관리자"
          ) : isAdmin ? (
            <Select
              defaultValue={row.original.authority as string}
              onValueChange={(newValue) =>
                setMemberState((prev) =>
                  prev.map((item) =>
                    item.id === row.original.id
                      ? { ...item, authority: newValue as Authority }
                      : item,
                  ),
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">관리자</SelectItem>
                <SelectItem value="MEMBER">구성원</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            row.original.authority
          ),
      },
      {
        accessorKey: "role",
        header: "역할",
        cell: ({ row }) =>
          isAdmin ? (
            <Select
              defaultValue={
                memberState.find((item) => item.id === row.original.id)
                  ?.role as string
              }
              onValueChange={(newValue) =>
                setMemberState((prev) =>
                  prev.map((item) =>
                    item.id === row.original.id
                      ? { ...item, role: newValue as Role }
                      : item,
                  ),
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MANAGER">책임자</SelectItem>
                <SelectItem value="WORKER">작업자</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            row.original.role
          ),
      },
    ],
    [memberState, isAdmin],
  );

  const table = useReactTable({
    columns: columns,
    data: memberState,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleChangeOwner = async () => {
    setLoading(true);
    await updateOwner(selectedOwner?.id as string, groupId)
      .then((result) =>
        setMemberState((prev) =>
          prev.map((item) =>
            item.id === result.ownerId
              ? { ...item, authority: "OWNER" }
              : item.authority === "OWNER"
                ? { ...item, authority: "ADMIN" }
                : item,
          ),
        ),
      )
      .finally(() => setLoading(false));
  };
  return (
    <section>
      <Header type="section" title="멤버 정보">
        {isOwner && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>그룹 관리자 변경</Button>
            </DialogTrigger>
            <DialogContent className="w-[346px]">
              <DialogTitle>그룹 관리자 변경</DialogTitle>
              <KeyValueLabel
                direction="row"
                label="그룹 관리자"
                labelWidth={80}
              >
                <Select
                  defaultValue={selectedOwner?.id}
                  onValueChange={(e) => {
                    setSelectedOwner(members.find((member) => member.id === e));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={<UserAvatar user={selectedOwner} label />}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {memberState.map((user) => {
                      return (
                        <SelectItem key={user.id} value={user.id as string}>
                          <UserAvatar user={user} label></UserAvatar>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </KeyValueLabel>
              <Button onClick={handleChangeOwner} disabled={loading}>
                변경하기
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </Header>
      <div className="px-6 pb-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-1.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-4 text-center">
                  결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
