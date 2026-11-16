"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type PageLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/** Ссылки «Подробнее» в общих секциях не возвращают человека на ту же страницу. */
export function PageLink({ href, ...props }: PageLinkProps) {
  const pathname = usePathname();
  if (href === pathname || (href !== "/" && `${href}/` === pathname))
    return null;
  return <Link href={href} {...props} />;
}
