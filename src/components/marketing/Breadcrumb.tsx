import Link from "next/link";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

/** Pazarlama iç sayfalarındaki "Ana Sayfa / Tasarımlar / ..." izi. */
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <div className="mb-2 text-[13px]">
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {/* Ayraç dekoratif ama yine de okunur bir tonda kalmalı —
              oklch(70%) krem zeminde 2.5:1'de kalıyordu. */}
          {i > 0 && <span className="text-muted"> / </span>}
          {item.href ? (
            <Link href={item.href} className="text-gold">
              {item.label}
            </Link>
          ) : (
            <span className="text-muted">{item.label}</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
