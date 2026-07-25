# MASTER PRODUCT BRIEF

## Product vision

Tạo Panel SignalOps hiện đại, sạch, responsive, có mật độ thông tin tốt như SaaS cao cấp nhưng giữ đúng trading/operations identity.

- Ảnh SignalOps hiện tại: authority về nhận diện.
- Ảnh Revello: tham chiếu bố cục và nhịp card.
- Hai ảnh ChatGPT: tham chiếu sidebar mở/thu gọn.

Không clone branding, wording hoặc ecommerce content.

## App shell

### Sidebar
- Expanded 264–280 px.
- Collapsed icon rail 68–76 px.
- Nút toggle cạnh brand.
- Active route rõ; tooltip khi collapsed.
- Account Scope Switcher gần cuối.
- Mobile dùng drawer.
- Ghi nhớ local; không reset route/filter/scope.

### Header
- page title/description;
- runtime health;
- last updated;
- language;
- inbox;
- privacy;
- export;
- share report.

Loại bỏ payout, fake user, fake program, fake latency, fake account, fake MT5 linked.

## Dashboard

### Global controls
Account scope; Today; Yesterday; 7d; 30d; 90d; MTD; YTD; Custom; Refresh; Export; Share.

### KPI row
1. Trading P&L
2. Total Income
3. Active Exposure
4. Signal Execution Rate

### Analytics carousel
1. Balance & Equity
2. P&L Over Time
3. Trade Activity Heatmap

Carousel:
- mouse/touch/touchpad drag;
- draggable scrubber;
- keyboard;
- auto-slide 10 giây;
- pause khi hover/drag/tooltip/tab inactive;
- pause 20 giây sau manual interaction;
- Play/Pause;
- nhớ preference;
- reduced motion.

### Heatmap
Lovable tự thiết kế theo phong cách chart của ảnh Revello:
- ngang là ngày;
- dọc là giờ;
- xanh lãi, đỏ lỗ, xám hòa/chưa kết quả;
- size = tổng lệnh;
- tooltip có orders, win/loss, USD P&L, pips, best/worst, top source;
- click deep-link Order History.

### Risk Today
Gộp daily loss, drawdown, risk budget và profit target nếu có cấu hình.

### Source Performance Summary
Top 5:
- Source;
- Win Rate;
- Net P&L USD;
- Today USD;
- Net Pips;
- Total Orders;
- Status.

## Accounts

Tabs Active/Archive. Actions:
- Add;
- Verify;
- Refresh;
- Edit metadata;
- Pin default;
- Archive;
- Restore;
- Permanent delete archived config;
- Details;
- deep-link Hermes activation.

Account có open lifecycle: Draining → Archived/Frozen.

## Signal Sources

Lovable tự thiết kế mới, không lấy trang hiện tại làm mẫu.

Tabs:
- Active;
- Performance;
- Archive.

Active:
name, enabled toggle, lifecycle, Telegram identity, group, parser, symbol profile, realtime/history access, last signal/check, Verify/Edit/Archive.

Performance:
signal win rate, order win rate, net P&L, total income, today, average/day, daily return, profit factor, average win/loss, RR, max drawdown, execution rate, technical failure, latency, best symbol/hour, total orders.

Archive:
historical view, restore, export, permanent delete config.

## Signals

Filters date/account/source/symbol/status/parser/search. Details gồm raw reference, parsed, normalized, dedupe, risk, sizing, execution gate, destinations, reason, correlation ID, related orders. Không Execute Again.

## Open Positions

Account/source/symbol/side/entry/current/SL/TP/native volume/floating P&L USD/pips/open time/ticket/correlation ID. Không fake Close action.

## Order History

Bounded date filter bắt buộc:
- default global range hoặc 7d;
- page size 25/50/100;
- server-pagination-ready;
- account/source/symbol/side/result/status/ticket/correlation;
- CSV/JSON;
- không edit/delete.

## Risk

Effective policy, version, account scope, modifier, sizing input, daily loss, drawdown, margin, risk budget, edit draft, impact preview, compare, apply, restore as new version, export. Không apply khi typing.

## Telegram

Thiết kế đầy đủ states missing config/auth/code/OTP/invalid OTP/2FA/ready/degraded/disconnected/revoked. Có API fields, save, send code, OTP, 2FA, cancel, read-only test, reconnect, revoke, identity, links. Không echo secret; không send-message test.

## Runtime

Tabs Overview/Components/Providers/Versions & Updates/Logs. Cards Panel API/Core/Bridge/Worker/Telegram/MT5/DB/runtime version/gates/last restart. Actions Refresh/self-test/logs/restart/inbox/update/rollback. Không fake success.

## Providers

Trong Runtime. Add/test/edit/preview switch/activate/deactivate/archive/restore/permanent delete. Provider mới inactive.

## Hermes

Top-level, tabs Overview/Accounts & Activation/Source Performance/Decisions & Recommendations/Learning Data/Policies & Versions/Trace. Không direct broker control.

## Processing Inbox

OTP/2FA, identity conflict, parser/symbol missing, account identity changed, runtime degraded, migration, broker unknown, reconciliation, blocked signal, rollback, provider degraded. Không fake Mark Resolved.

## Trace

Read-only timeline Telegram → Parser → Normalized → Dedupe → Risk → Sizing → Execution Gate → Broker → Lifecycle → P&L. Không edit/delete/retry execution.
