import type { ReactNode } from "react";

export default function Page({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div>
      {title ? <h1 className="text-2xl font-semibold tracking-tight">{title}</h1> : null}
      <div className={title ? "mt-6" : ""}>{children}</div>
    </div>
  );
}
