import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "success" | "danger" | "light" | "outline-light";
type Size = "sm" | "md" | "lg";

type Common = {
  variant?: ButtonVariant;
  size?: Size;
  block?: boolean;
  /** Mostra spinner e troca o texto (ex.: "Consultando...") */
  loading?: boolean;
  loadingText?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children: ReactNode;
};

function classes({ variant = "primary", size = "md", block, className }: Common) {
  return ["btn", `btn--${variant}`, size !== "md" && `btn--${size}`, block && "btn--block", className]
    .filter(Boolean)
    .join(" ");
}

function Content({ loading, loadingText, iconLeft, iconRight, children }: Common) {
  if (loading)
    return (
      <>
        <span className="spinner" aria-hidden="true" />
        <span>{loadingText ?? children}</span>
      </>
    );
  return (
    <>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </>
  );
}

export function Button(props: Common & Omit<ComponentProps<"button">, "children">) {
  const { variant, size, block, loading, loadingText, iconLeft, iconRight, className, children, disabled, type, ...rest } = props;
  return (
    <button
      type={type ?? "button"}
      className={classes(props)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <Content {...props} />
    </button>
  );
}

export function ButtonLink(props: Common & Omit<ComponentProps<typeof Link>, "children" | "className">) {
  const { variant, size, block, loading, loadingText, iconLeft, iconRight, className, children, ...rest } = props;
  return (
    <Link className={classes(props)} {...rest}>
      <Content {...props} />
    </Link>
  );
}

/** Para links externos (WhatsApp, tel:, mailto:) */
export function ButtonAnchor(props: Common & Omit<ComponentProps<"a">, "children" | "className">) {
  const { variant, size, block, loading, loadingText, iconLeft, iconRight, className, children, ...rest } = props;
  const external = typeof rest.href === "string" && rest.href.startsWith("http");
  return (
    <a className={classes(props)} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      <Content {...props} />
    </a>
  );
}
