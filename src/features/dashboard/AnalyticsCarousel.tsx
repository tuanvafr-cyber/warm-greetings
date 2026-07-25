import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, GripHorizontal, Pause, Play } from "lucide-react";
import { usePreferences } from "@/lib/preferences";
import { useT } from "@/lib/i18n";
import { controls } from "@/lib/control-registry";
import { cn } from "@/lib/utils";

const HEIGHT_KEY = "signalops.analyticsHeight";
const DEFAULT_H = 360;
const MIN_H = 320;
const MAX_H = 520;
const MOBILE_H = 320;

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const upd = () => setM(mql.matches);
    upd();
    mql.addEventListener("change", upd);
    return () => mql.removeEventListener("change", upd);
  }, []);
  return m;
}

/**
 * Analytics carousel with a single shared viewport height. All slides
 * fill the same height so switching never causes layout jumps. Desktop
 * users can drag the bottom handle to resize (320–520 px, persisted).
 * Mobile uses a fixed compact height without a resize handle.
 */
export function AnalyticsCarousel({
  slides,
  onHeightChange,
}: {
  slides: { key: string; label: string; content: ReactNode }[];
  onHeightChange?: (h: number) => void;
}) {
  const t = useT();
  const { carouselAutoSlide, setCarouselAutoSlide } = usePreferences();
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, dragFree: false });
  const [selected, setSelected] = useState(0);
  const [interactPause, setInteractPause] = useState(false);
  const interactTimer = useRef<number | null>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const isMobile = useIsMobile();

  const [height, setHeight] = useState<number>(DEFAULT_H);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(HEIGHT_KEY);
      if (raw) {
        const n = Number(JSON.parse(raw));
        if (Number.isFinite(n)) setHeight(Math.min(MAX_H, Math.max(MIN_H, n)));
      }
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    onHeightChange?.(isMobile ? MOBILE_H : height);
  }, [height, isMobile, onHeightChange]);

  // Resize handle with rAF throttling
  const resizingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const startYRef = useRef(0);
  const startHRef = useRef(height);
  const onResizeDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isMobile) return;
      resizingRef.current = true;
      startYRef.current = e.clientY;
      startHRef.current = height;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [height, isMobile],
  );
  const onResizeMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizingRef.current) return;
    const delta = e.clientY - startYRef.current;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const next = Math.min(MAX_H, Math.max(MIN_H, startHRef.current + delta));
      setHeight(next);
    });
  }, []);
  const onResizeUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizingRef.current) return;
    resizingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    try {
      window.localStorage.setItem(HEIGHT_KEY, JSON.stringify(startHRef.current));
    } catch {
      /* ignore */
    }
  }, []);
  // Persist height on change (after resize ends we snapshot latest)
  useEffect(() => {
    if (isMobile) return;
    try {
      window.localStorage.setItem(HEIGHT_KEY, JSON.stringify(height));
    } catch {
      /* ignore */
    }
  }, [height, isMobile]);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  useEffect(() => {
    if (!embla || !carouselAutoSlide || interactPause) return;
    if (typeof window !== "undefined") {
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
    }
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      embla.scrollNext();
    }, 10_000);
    return () => window.clearInterval(id);
  }, [embla, carouselAutoSlide, interactPause]);

  const pauseAfterInteract = () => {
    setInteractPause(true);
    if (interactTimer.current) window.clearTimeout(interactTimer.current);
    interactTimer.current = window.setTimeout(() => setInteractPause(false), 20_000);
  };

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!embla) return;
    if (e.key === "ArrowLeft") {
      embla.scrollPrev();
      pauseAfterInteract();
    }
    if (e.key === "ArrowRight") {
      embla.scrollNext();
      pauseAfterInteract();
    }
  };

  const onScrubDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!embla) return;
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    pauseAfterInteract();
  };
  const onScrubMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!embla || !dragging.current || !scrubberRef.current) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx = Math.round(ratio * (slides.length - 1));
    embla.scrollTo(idx);
  };
  const onScrubUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const bodyHeight = isMobile ? MOBILE_H : height;

  return (
    <div
      className="flex flex-col rounded-xl border border-border bg-card"
      onMouseEnter={pauseAfterInteract}
      tabIndex={0}
      onKeyDown={onKey}
      role="region"
      aria-label="Analytics carousel"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => {
                embla?.scrollTo(i);
                pauseAfterInteract();
              }}
              className={cn(
                "text-xs font-medium transition-colors",
                i === selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            data-control-id={controls.dashboard.carouselPrev}
            onClick={() => {
              embla?.scrollPrev();
              pauseAfterInteract();
            }}
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            data-control-id={controls.dashboard.carouselNext}
            onClick={() => {
              embla?.scrollNext();
              pauseAfterInteract();
            }}
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-control-id={controls.dashboard.carouselPlayPause}
            onClick={() => setCarouselAutoSlide(!carouselAutoSlide)}
            aria-pressed={carouselAutoSlide}
            className="gap-1.5"
          >
            {carouselAutoSlide ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline text-xs">
              {carouselAutoSlide ? t("dashboard.pause") : t("dashboard.play")}
            </span>
          </Button>
        </div>
      </div>

      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex" style={{ height: bodyHeight }}>
          {slides.map((s) => (
            <div key={s.key} className="min-w-0 flex-[0_0_100%] overflow-hidden p-4">
              <div className="h-full w-full">{s.content}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={scrubberRef}
        data-control-id={controls.dashboard.carouselScrub}
        onPointerDown={onScrubDown}
        onPointerMove={onScrubMove}
        onPointerUp={onScrubUp}
        onPointerCancel={onScrubUp}
        className="relative mx-4 mb-2 mt-3 h-2 cursor-pointer rounded-full bg-muted"
        role="slider"
        aria-label="Carousel scrubber"
        aria-valuemin={0}
        aria-valuemax={slides.length - 1}
        aria-valuenow={selected}
      >
        <div
          className="pointer-events-none absolute left-0 top-0 h-full rounded-full bg-primary/30"
          style={{ width: `${((selected + 1) / slides.length) * 100}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-primary shadow-md ring-2 ring-background"
          style={{ left: `calc(${(selected / Math.max(1, slides.length - 1)) * 100}% - 8px)` }}
        />
      </div>

      {!isMobile && (
        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize analytics"
          onPointerDown={onResizeDown}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeUp}
          onPointerCancel={onResizeUp}
          className="flex h-3 cursor-ns-resize items-center justify-center border-t border-border/60 text-muted-foreground/60 hover:text-muted-foreground"
        >
          <GripHorizontal className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}
