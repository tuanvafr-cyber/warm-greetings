# INFORMATION ARCHITECTURE AND ROUTES

## Final navigation

### Primary

| Route | VI | EN | Mục tiêu |
|---|---|---|---|
| `/` | Bảng điều khiển | Dashboard | Tổng quan vận hành |
| `/accounts` | Tài khoản | Accounts | Active/Archive accounts |
| `/signals` | Tín hiệu | Signals | Signal lifecycle |
| `/positions` | Lệnh đang mở | Open Positions | Vị thế/pending |
| `/orders` | Lịch sử lệnh | Order History | Lịch sử bounded |

### Operations

| Route | VI | EN | Mục tiêu |
|---|---|---|---|
| `/sources` | Nguồn tín hiệu | Signal Sources | Active/Performance/Archive |
| `/risk` | Quản trị rủi ro | Risk Management | Policy/effective risk |
| `/telegram` | Telegram | Telegram | Session/auth |

### Intelligence

| Route | VI | EN | Mục tiêu |
|---|---|---|---|
| `/hermes` | Hermes | Hermes | Intelligence/learning/recommendations |

### System

| Route | VI | EN | Mục tiêu |
|---|---|---|---|
| `/runtime` | Runtime | Runtime | Components/providers/update/logs |
| `/inbox` | Hộp xử lý | Processing Inbox | Input/blockers/reconciliation |
| `/trace` | Truy vết | Trace | Immutable lifecycle trace |

## Route contract

Mỗi route phải có:
- default data state;
- loading skeleton;
- empty;
- unavailable/not-connected;
- stale;
- error;
- blocked;
- desktop/tablet/mobile;
- VI/EN;
- privacy on/off.

## URL state

Lưu trong URL khi hợp lý:
- account scope;
- time range;
- tab;
- source;
- symbol;
- status;
- page/cursor;
- correlation ID;
- selected entity.

Local preference:
- language;
- sidebar state;
- privacy mode;
- pinned account;
- page size;
- carousel slide;
- auto-slide.

## Command ownership

| Command | Owner page |
|---|---|
| Add/Archive/Restore Account | Accounts |
| Enable/Disable/Archive Source | Sources |
| Risk policy edit/apply | Risk |
| Telegram auth/revoke | Telegram |
| Provider add/switch/archive | Runtime → Providers |
| Runtime restart/update/rollback | Runtime |
| Hermes activation bundle | Hermes → Accounts & Activation |

Trang khác chỉ deep-link tới owner page.
