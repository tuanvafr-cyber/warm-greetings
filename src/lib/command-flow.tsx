/**
 * Shared frontend command lifecycle for backend-required flows.
 *
 * Every write in the panel goes through the same visible states:
 *   idle → previewing → preview_ready → confirming → submitting
 *        → authoritative_success | authoritative_rejection | transport_error
 *
 * The frontend NEVER treats a local state transition as an actual backend
 * success. `authoritative_success` is only reached when an integrated
 * PanelDataAdapter method returns a truthful result. Until that adapter is
 * connected, invoking a command lands in `preview_ready` and shows the
 * "backend required" acknowledgement.
 */
import { useCallback, useMemo, useState } from "react";

export type CommandPhase =
  | "idle"
  | "previewing"
  | "preview_ready"
  | "confirming"
  | "submitting"
  | "authoritative_success"
  | "authoritative_rejection"
  | "transport_error";

export type CommandState<TPreview = unknown, TResult = unknown> = {
  phase: CommandPhase;
  preview: TPreview | null;
  result: TResult | null;
  error: { code: string; message: string } | null;
  /** True when the backend integration seam is not yet connected. */
  backendRequired: boolean;
};

export type CommandRunners<TInput, TPreview, TResult> = {
  /** Compute a preview locally OR ask an adapter for one. */
  preview?: (input: TInput) => Promise<TPreview> | TPreview;
  /** Submit to the adapter. Absence → backend required. */
  submit?: (input: TInput, preview: TPreview | null) => Promise<TResult>;
};

export function useCommandFlow<TInput, TPreview = unknown, TResult = unknown>(
  runners: CommandRunners<TInput, TPreview, TResult> = {},
) {
  const [state, setState] = useState<CommandState<TPreview, TResult>>({
    phase: "idle",
    preview: null,
    result: null,
    error: null,
    backendRequired: !runners.submit,
  });

  const reset = useCallback(
    () =>
      setState({
        phase: "idle",
        preview: null,
        result: null,
        error: null,
        backendRequired: !runners.submit,
      }),
    [runners.submit],
  );

  const runPreview = useCallback(
    async (input: TInput) => {
      setState((s) => ({ ...s, phase: "previewing", error: null }));
      try {
        const preview = runners.preview ? await runners.preview(input) : (input as unknown as TPreview);
        setState((s) => ({ ...s, phase: "preview_ready", preview }));
        return preview;
      } catch (err) {
        setState((s) => ({
          ...s,
          phase: "transport_error",
          error: { code: "preview_failed", message: (err as Error).message },
        }));
        return null;
      }
    },
    [runners],
  );

  const confirm = useCallback(() => {
    setState((s) => ({ ...s, phase: "confirming" }));
  }, []);

  const submit = useCallback(
    async (input: TInput) => {
      if (!runners.submit) {
        setState((s) => ({ ...s, phase: "preview_ready", backendRequired: true }));
        return null;
      }
      setState((s) => ({ ...s, phase: "submitting", error: null }));
      try {
        const result = await runners.submit(input, state.preview);
        setState((s) => ({ ...s, phase: "authoritative_success", result }));
        return result;
      } catch (err) {
        const e = err as Error & { code?: string; kind?: string };
        setState((s) => ({
          ...s,
          phase: e.kind === "rejected" ? "authoritative_rejection" : "transport_error",
          error: { code: e.code ?? "unknown", message: e.message },
        }));
        return null;
      }
    },
    [runners, state.preview],
  );

  return useMemo(
    () => ({ state, reset, preview: runPreview, confirm, submit }),
    [state, reset, runPreview, confirm, submit],
  );
}

export function isTerminal(phase: CommandPhase): boolean {
  return (
    phase === "authoritative_success" ||
    phase === "authoritative_rejection" ||
    phase === "transport_error"
  );
}
