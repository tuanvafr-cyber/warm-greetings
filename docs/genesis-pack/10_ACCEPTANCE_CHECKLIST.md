# ACCEPTANCE CHECKLIST

## Build
- [ ] Build pass.
- [ ] TypeScript pass.
- [ ] Lint pass nếu có.
- [ ] Không console error.
- [ ] Không route `Coming soon`.
- [ ] Không dead button/menu.
- [ ] Không fake success.

## Shell
- [ ] Sidebar mở/thu gọn và giữ sau reload.
- [ ] Tooltip collapsed đúng locale.
- [ ] Account selector hoạt động ở cả hai state.
- [ ] Scope giữ khi chuyển route và có trong URL.
- [ ] Mobile drawer hoạt động.
- [ ] Không overflow ngang.
- [ ] Header không fake profile/payout/program/latency/health.

## i18n
- [ ] VI không lẫn EN.
- [ ] EN không lẫn VI.
- [ ] Tooltip/dialog/error đều dịch.
- [ ] Reason code có human explanation.

## Privacy
- [ ] Che tiền, login, ticket, server, Telegram/provider sensitive data.
- [ ] Không nhảy layout.
- [ ] Giữ sau reload.
- [ ] Share/Export có privacy option.

## Dashboard
- [ ] 4 KPI đúng.
- [ ] Time filters đầy đủ.
- [ ] Carousel 3 slide.
- [ ] Mouse/touch/touchpad drag.
- [ ] Draggable scrubber và keyboard.
- [ ] Auto-slide 10s, pause logic, remembered Play/Pause.
- [ ] Heatmap green/red/gray, size = total orders.
- [ ] Risk Today.
- [ ] Source Performance top 5.
- [ ] Dùng Total Orders, không Sample.

## Accounts
- [ ] Active/Archive.
- [ ] Add wizard, Verify, native currency, Pin.
- [ ] Draining, Restore, Permanent delete archived config.
- [ ] Không fake arm/execution.

## Sources
- [ ] Active/Performance/Archive.
- [ ] Enabled toggle.
- [ ] Disabled khác Archived.
- [ ] Draining.
- [ ] Verify/Edit/Archive.
- [ ] Performance full metrics.
- [ ] Restore/Permanent delete.
- [ ] Không fake local success.

## Signals/Positions/Orders
- [ ] Signals filters/detail/trace/related orders; không Execute Again.
- [ ] Positions filters/detail/P&L USD/pips/pending; không fake close.
- [ ] Orders bounded date, 25/50/100, filters, CSV/JSON; không edit/delete.

## Risk/Telegram
- [ ] Risk effective policy/version/preview/apply/restore; không apply while typing.
- [ ] Telegram full visual state flow; no secret echo; no message test.

## Runtime/Providers/Hermes
- [ ] Runtime tabs và component cards.
- [ ] Not connected/unavailable states.
- [ ] Provider add/test/switch/archive; provider mới inactive.
- [ ] Provider B không auto-active.
- [ ] Hermes top-level và đủ tabs.
- [ ] Không direct broker action.

## Inbox/Trace
- [ ] Inbox đủ item types; không fake Mark Resolved.
- [ ] Trace immutable; no edit/delete/retry execution.

## Data rules
- [ ] Native sizing amount không convert.
- [ ] USC reporting /100 only.
- [ ] Dashboard money USD.
- [ ] Deposit không phải Total Income.
- [ ] XAUUSD pip rule; symbols khác metadata-ready.

## Responsive
- [ ] 1440.
- [ ] 1024.
- [ ] 768.
- [ ] 390.
- [ ] Desktop/mobile functional parity.
