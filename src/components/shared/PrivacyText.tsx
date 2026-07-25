import { cn } from "@/lib/utils";
import { usePreferences } from "@/lib/preferences";
import type { ReactNode } from "react";

/**
 * Wraps sensitive values so Privacy Mode masks them consistently across routes.
 * Share/Export inherit privacy through the same context.
 */
export function PrivacyText({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const { privacyMode } = usePreferences();
  return (
    <Tag className={cn(privacyMode && "privacy-mask", className)} aria-hidden={privacyMode}>
      {children}
    </Tag>
  );
}
