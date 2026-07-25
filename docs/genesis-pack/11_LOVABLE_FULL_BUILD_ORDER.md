# LOVABLE FULL BUILD ORDER — PASTE READY

PROJECT: SignalOps Panel Next  
MODE: Build new from zero  
OUTPUT: Frontend donor repository only

## Goal

Build a complete, polished, responsive SignalOps operations panel from zero using the supplied specification files and four visual references.

Done means:
- every final route exists;
- no page says Coming soon;
- no dead, duplicated or orphan controls;
- no fake backend success;
- Vietnamese and English are complete and never mixed;
- desktop/tablet/mobile are usable;
- one coherent design system is used across all routes;
- code is clean enough for Codex to map to the real SignalOps backend.

## Evidence to read before coding

Read every supplied file in this order:

1. `00_START_HERE.md`
2. `01_PROJECT_KNOWLEDGE.md`
3. `02_MASTER_PRODUCT_BRIEF.md`
4. `03_INFORMATION_ARCHITECTURE_AND_ROUTES.md`
5. `04_CONTROL_INVENTORY.md`
6. `05_UI_STATE_AND_LIFECYCLE_CONTRACTS.md`
7. `07_DATA_AND_METRIC_CONTRACTS.md`
8. `06_DESIGN_SYSTEM_AND_RESPONSIVE.md`
9. `08_I18N_COPY_GUIDE.md`
10. `09_VISUAL_REFERENCE_GUIDE.md`
11. `10_ACCEPTANCE_CHECKLIST.md`

Read:
- `references/01_signalops_current_panel.png`
- `references/02_revello_dashboard_reference.webp`
- `references/03_chatgpt_sidebar_expanded.png`
- `references/04_chatgpt_sidebar_collapsed.png`

Do not request extra heatmap, source-management, mobile or logo images.

## Visual interpretation

- SignalOps screenshot is the primary identity source.
- Revello is only a composition/density reference.
- ChatGPT images are only sidebar interaction references.
- Do not copy branding, ecommerce content, exact colors/icons/data.
- Design the Heatmap, Signal Sources page, mobile layouts and text wordmark yourself from the written contracts.

## Autonomy

You may:
- create the frontend architecture;
- choose clean React component boundaries;
- build shared design-system components;
- implement routing/i18n/local preferences/responsive behavior;
- implement drawers/dialogs/tables/cards/charts;
- use clearly marked visual fixtures.

Preserve stable `control_id` values from `04_CONTROL_INVENTORY.md` in a central registry, component metadata or test IDs.

## Boundaries

Do not:
- implement broker execution;
- call order_check/order_send;
- arm routes or enable execution;
- perform Telegram live sending/authentication;
- restart/update runtime;
- switch providers for real;
- activate Provider B;
- implement risk sizing;
- convert native sizing amounts;
- add a backend server;
- store real secrets;
- show operational success without a real adapter;
- leave fixture data looking live;
- rewrite pushed Git history.

When a backend adapter does not exist:
- show complete UI flow;
- show loading/blocked/error/not-connected/unavailable states;
- label fixture data;
- never claim success.

## Product invariants

### Native sizing
USC account configured `2000` means `2000 USC`; USD account `100` means `100 USD`. Never convert configured native sizing amount.

Reporting only:
- USD remains USD;
- USC / 100 → display USD.

### Source lifecycle
Enabled, Disabled, Draining, Archived/Frozen are distinct.

Disabled stays in Active and remains visible; it stops new intake/analysis but accepted lifecycle remains visible.

Archived moves to Archive, freezes configuration, is excluded from live ranking by default, supports Restore and Permanent Delete of configuration, while immutable history remains.

### Privacy
Privacy Mode masks sensitive data across all routes. Share and Export inherit privacy settings.

### Language
Never mix Vietnamese and English in the active locale.

## Required routes

Build:
- Dashboard
- Accounts
- Signals
- Open Positions
- Order History
- Signal Sources
- Risk Management
- Telegram
- Hermes
- Runtime
- Processing Inbox
- Trace

Runtime contains Providers.
Signal Sources contains Active/Performance/Archive.
Accounts contains Active/Archive.
Hermes contains all specified tabs.

## Foundation first

Create shared foundations first:

1. Design tokens and typography
2. App shell
3. Collapsible sidebar
4. Global account scope
5. Header
6. Privacy Mode
7. i18n
8. URL/filter state
9. Shared page header
10. Shared table/card/list
11. Shared dialog/drawer/bottom sheet
12. Shared status/empty/loading/error patterns
13. Responsive primitives

Then build every route with these foundations. Do not stop after Dashboard.

## Dashboard

Create:
- Trading P&L
- Total Income
- Active Exposure
- Signal Execution Rate
- Balance & Equity
- P&L Over Time
- Trade Activity Heatmap
- Risk Today
- Source Performance Summary
- Open Positions/Recent Orders
- Runtime/Inbox summary

Carousel:
- mouse/touch/touchpad drag;
- draggable scrubber;
- keyboard;
- auto-slide about 10 seconds;
- pause during interaction;
- pause 20 seconds after manual use;
- remember Play/Pause;
- reduced motion.

Heatmap:
- design it in the visual language of the Revello analytics cards;
- horizontal date axis;
- vertical hour axis;
- green/red/gray only;
- dot size = total orders;
- rich tooltip;
- click deep-links to filtered Order History.

## Responsive

Validate:
- 1440 px
- 1024 px
- 768 px
- 390 px

Mobile must use:
- navigation drawer;
- account selector near top;
- filter bottom sheets;
- tables as cards/lists;
- full-screen detail sheets;
- all major controls reachable;
- no horizontal overflow.

## Verification

Before completion:

1. Run build.
2. Run TypeScript checks.
3. Run lint if configured.
4. Navigate every route.
5. Check VI and EN.
6. Check Privacy On/Off.
7. Check sidebar expanded/collapsed.
8. Check account scope persistence.
9. Check loading/empty/error/not-connected/stale/blocked.
10. Check all four viewport sizes.
11. Reconcile every `control_id` as implemented, visual-only/backend-required, missing, duplicated or dead.
12. Fix every missing, duplicated or dead control.
13. Confirm no fake success and no Coming soon.

## Completion report

Return:
- exact commit/reference;
- routes completed;
- files/components created;
- shared foundations;
- control inventory reconciliation;
- backend-required controls;
- fixtures used;
- build/typecheck/lint results;
- known UI-only limitations;
- screenshots at 1440 and 390;
- explicit confirmation of no Coming soon, dead buttons, mixed locale or fake success.
