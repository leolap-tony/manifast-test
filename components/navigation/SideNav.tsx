"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../elements/Logo";

import { usePathname } from "next/navigation";

interface SideNavItemProps {
  page: string;
  href: string;
  isSelected: boolean;
}

export function SideNavItem({ page, href, isSelected }: SideNavItemProps) {
  const StateStyle = {
    Default:
      "w-full h-8 pl-8 py-1.5 flex items-center rounded-l-md text-body-md-n",
    Selected:
      "w-full h-8 pl-8 py-1.5 flex items-center rounded-l-md bg-slate-100 text-body-md-m",
  };

  return (
    <li className={isSelected ? StateStyle.Selected : StateStyle.Default}>
      <Link href={href}>{page}</Link>
    </li>
  );
}

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-shrink-0 flex flex-col gap-5 w-[200px] h-full py-8 border-r">
      <div className="w-full h-fit flex justify-center items-center">
        <Logo />
      </div>
      <ul className="flex flex-col h-fit p-1 pr-0 text-text-title">
        <SideNavItem
          page="홈"
          href="/dashboard"
          isSelected={pathname === "/dashboard"}
        />
        <SideNavItem
          page="고객"
          href="/customer"
          isSelected={pathname === "/customer"}
        />
        <SideNavItem
          page="프로젝트"
          href="/project"
          isSelected={pathname === "/project"}
        />
        <SideNavItem
          page="멤버"
          href="/member"
          isSelected={pathname === "/member"}
        />
        <SideNavItem
          page="내 정보"
          href="/myinfo"
          isSelected={pathname === "/myinfo"}
        />
      </ul>
    </nav>
  );
}
