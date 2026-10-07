import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export function EmptyState({
  icon, title, text, action, tone,
}: {
  icon: IconName;
  title: string;
  text: string;
  action?: ReactNode;
  tone?: "green";
}) {
  return (
    <div className="empty">
      <span className={`empty__icon ${tone === "green" ? "empty__icon--green" : ""}`}>
        <Icon name={icon} size={26} />
      </span>
      <h3 className="h-4">{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function Skeleton({ w, h = 14, r, className }: { w?: number | string; h?: number; r?: number; className?: string }) {
  return <span className={`skeleton ${className ?? ""}`} style={{ display: "block", width: w ?? "100%", height: h, borderRadius: r }} aria-hidden="true" />;
}

export function LoadingLine({ children }: { children: ReactNode }) {
  return (
    <p className="loading-line" role="status" aria-live="polite">
      <span className="spinner" style={{ color: "var(--blue)" }} aria-hidden="true" />
      {children}
    </p>
  );
}
