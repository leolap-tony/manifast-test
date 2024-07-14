import { Separator } from "@/components/ui/separator";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const page = () => {
  return (
    <div className="w-full flex flex-col gap-8 p-12">
      <h1 className="text-4xl font-bold">고객</h1>
      <Separator></Separator>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">고객</TableHead>
            <TableHead>전담 PM</TableHead>
            <TableHead>플랜</TableHead>
            <TableHead>계약 시작일</TableHead>
            <TableHead>계약 종료일</TableHead>
            <TableHead>프로젝트 수</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">[그룹명]</TableCell>
            <TableCell>Jane</TableCell>
            <TableCell>베이직</TableCell>
            <TableCell>2024.06.08</TableCell>
            <TableCell>2024.06.08</TableCell>
            <TableCell>3</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">[그룹명]</TableCell>
            <TableCell>Jane</TableCell>
            <TableCell>베이직</TableCell>
            <TableCell>2024.06.08</TableCell>
            <TableCell>2024.06.08</TableCell>
            <TableCell>3</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default page;
