I extracted your Genesis Pack (13 spec docs + 4 reference images, ~1,400 lines of spec) and read the full build order. Before I start writing code, here is how I'll execute it — this is a very large build (12 routes, VI/EN i18n, full design system, responsive down to 390px, control-inventory reconciliation), so I want to align on sequencing.

## Approach

I'll build it in 4 phases. After each phase you get a working preview and can course-correct before I spend credits on the next one.

### Phase 1 — Foundations (no route pages yet)
- Design tokens, typography, dark/light theme in `src/styles.css` derived from the SignalOps screenshot identity
- App shell: collapsible sidebar (ChatGPT-style expand/collapse + mini-rail), top header, global account scope selector, Privacy Mode toggle, VI/EN switcher
- i18n runtime (VI + EN strings, no mixing), locale-aware formatters (native sizing rule: USC stays USC in config, USC/100 → USD only in reporting)
- URL/filter state helpers, account-scope persistence
- Shared primitives: PageHeader, DataTable + card/list responsive collapse, Dialog / Drawer / BottomSheet, Status/Empty/Loading/Error/NotConnected/Blocked patterns, control-id registry (`data-control-id`)
- Route tree stubs for all 12 sections so navigation works end-to-end (stubs render a labelled "backend-required" state, never "Coming soon")

### Phase 2 — Dashboard + Signal Sources + Accounts
- Full Dashboard: all 11 cards, carousel with drag/scrubber/keyboard/auto-slide/pause/reduced-motion, Revello-style Heatmap with tooltip + deep-link to Order History
- Signal Sources: Active / Performance / Archive tabs with the enabled/disabled/draining/archived lifecycle
- Accounts: Active / Archive tabs

### Phase 3 — Signals, Open Positions, Order History, Risk Management, Processing Inbox, Trace
- Tables with filter bottom sheets on mobile, full-screen detail sheets, privacy masking

### Phase 4 — Telegram, Hermes (all tabs), Runtime (incl. Providers)
- All "operational" flows show real UI but return not-connected / blocked / unavailable states (no fake success, per your boundaries)
- Final pass: control-inventory reconciliation, VI/EN sweep, Privacy on/off sweep, 1440/1024/768/390 sweep, build + typecheck + lint

## Technical notes
- Stack is fixed: TanStack Start v1 + React 19 + Tailwind v4 + shadcn (per platform). Routes live under `src/routes/` with file-based routing.
- Spec files copied into `docs/genesis-pack/` in the repo for traceability; reference images kept out of the bundle.
- `control_id` values from `04_CONTROL_INVENTORY.md` go into `src/lib/control-registry.ts` and are applied as `data-control-id` attributes for later Codex mapping.
- No backend, no secrets, no broker/Telegram/runtime side-effects — fixtures are clearly labelled.

## Question before I start
This will be a large build across multiple turns. Confirm:
1. Proceed with Phase 1 now (foundations + route stubs), then check in?
2. Any of the boundaries I should tighten or loosen (e.g. do you want fixture data on Dashboard right away, or empty/not-connected states everywhere until Codex wires the backend)?

Reply "go" (or "go, with fixtures" / "go, empty states only") and I'll start Phase 1.