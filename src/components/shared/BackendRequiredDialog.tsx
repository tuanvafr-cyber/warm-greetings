import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlugZap } from "lucide-react";
import { useT } from "@/lib/i18n";

/**
 * Truthful backend-required flow:
 *   idle → dialog → optional impact preview → submit request → clearly
 *   labelled backend-not-connected result. NEVER fake-success.
 *
 * Consumers pass the intent as a payload preview and any preceding form
 * as `children`. This component owns the confirm + result surface.
 */
export function BackendRequiredDialog({
  trigger,
  title,
  description,
  payloadPreview,
  children,
  controlId,
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  payloadPreview?: unknown;
  children?: ReactNode;
  controlId?: string;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setSubmitted(false);
      }}
    >
      <DialogTrigger asChild data-control-id={controlId}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        {children}

        {payloadPreview !== undefined ? (
          <div className="mt-2">
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              {t("backend.will_submit")}
            </p>
            <pre className="max-h-40 overflow-auto rounded-md border border-border bg-muted/40 p-2 text-[11px] leading-snug">
              {JSON.stringify(payloadPreview, null, 2)}
            </pre>
          </div>
        ) : null}

        {submitted ? (
          <Alert variant="default" className="mt-3 border-warning/40 bg-warning/10">
            <PlugZap className="h-4 w-4" />
            <AlertTitle>{t("backend.title")}</AlertTitle>
            <AlertDescription>{t("backend.desc")}</AlertDescription>
          </Alert>
        ) : null}

        <DialogFooter className="mt-3 gap-2 sm:justify-end">
          {submitted ? (
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {t("backend.ack")}
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={() => setSubmitted(true)}>{t("common.confirm")}</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
