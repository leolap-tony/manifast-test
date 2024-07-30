import {
  IconArrow,
  IconCalendar,
  IconCheck,
  IconCross,
  IconDelete,
  IconEdit,
  IconFile,
  IconHandle,
  IconInfo,
  IconMnfstsys,
  IconPlus,
  IconSend,
} from "@/public/icons/iconLibrary";
import React from "react";

interface IconProps {
  icon: keyof typeof icons;
  fill?: string;
  className?: string;
}

const icons = {
  arrow: IconArrow,
  calendar: IconCalendar,
  check: IconCheck,
  cross: IconCross,
  delete: IconDelete,
  edit: IconEdit,
  file: IconFile,
  handle: IconHandle,
  info: IconInfo,
  mnfstsys: IconMnfstsys,
  plus: IconPlus,
  send: IconSend,
};

export default function Icon({ icon, fill, className, ...props }: IconProps) {
  const SvgIcon = icons[icon];
  if (!SvgIcon) {
    return null; // 아이콘이 존재하지 않는 경우
  }
  return <SvgIcon fill={fill} className={className} {...props} />;
}
