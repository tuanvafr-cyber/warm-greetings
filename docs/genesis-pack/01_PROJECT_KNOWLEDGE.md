# PROJECT KNOWLEDGE — SIGNALOPS PANEL

## Sản phẩm

SignalOps là hệ thống vận hành đa tài khoản MT5. Panel thống nhất để quan sát và quản lý tài khoản, nguồn Telegram, tín hiệu, lệnh, lịch sử, risk, Telegram session, runtime, providers, Hermes, inbox và trace.

Panel không phải terminal giao dịch thủ công. Frontend không tự gửi lệnh, arm route hoặc thay state runtime.

## Nguyên tắc

- Một frontend thống nhất.
- Không `Coming soon`.
- Không nút chết, menu rỗng hoặc toast thành công giả.
- Không browser-only mutation giả làm machine state.
- Command backend-required phải có confirm/loading/blocked/error/unavailable.
- Một command có một owner page; nơi khác deep-link.
- Desktop và mobile có chức năng tương đương.
- Một locale tại một thời điểm; không trộn Việt/Anh.

## Account Scope

- `all`: tổng hợp các tài khoản được chọn.
- `exact_account`: một tài khoản cụ thể.

Scope nằm ở sidebar, giữ khi chuyển route/reload, lưu trong URL và không tự đổi khi account offline. Scope chỉ để xem, không arm route hay đổi execution authority.

## Native sizing USD/USC

Mỗi account có native currency `USD` hoặc `USC`.

Configured sizing amount dùng đúng native unit:
- account USC đặt `2000` → sizing theo `2000 USC`;
- không hiểu là `2000 USD`;
- không đổi thành `200000 USC`;
- account USD đặt `100` → sizing theo `100 USD`.

Frontend không tính volume.

Reporting/analytics hiển thị chung bằng USD:
- USD giữ nguyên;
- USC chia 100 để hiển thị.

Quy đổi reporting không được ghi ngược vào sizing configuration.

## Pip

XAUUSD family:
- `1.0` giá = `10 pip`;
- `0.1` giá = `1 pip`.

Không áp công thức này cho mọi symbol. UI nhận `pip_size` từ symbol metadata.

## Source lifecycle

### Enabled
Nhận, parse và phân tích tín hiệu mới.

### Disabled
- dừng nhận/parse/phân tích mới;
- vẫn ở tab Đang sử dụng;
- vẫn hiện trên bảng vận hành/thông báo;
- lifecycle đã accepted trước cutoff vẫn hoàn tất;
- lệnh đã mở vẫn theo dõi và ghi P&L.

### Draining
Không nhận mới, còn lifecycle/lệnh cũ đang hoàn tất.

### Archived/Frozen
- sang tab Lưu trữ;
- cấu hình đóng băng;
- không nhận hoặc phân tích mới;
- không vào live ranking mặc định;
- lịch sử giữ nguyên;
- có Khôi phục và Xóa vĩnh viễn cấu hình.

Permanent delete không xóa order history, P&L, trace, audit evidence hoặc lineage tối thiểu.

## Archive lifecycle chung

Áp dụng khi phù hợp cho:
- Accounts;
- Signal Sources;
- Providers;
- Hermes profiles/config;
- Parser profiles;
- Symbol profiles.

Không áp dụng Delete cho immutable history như Order History, Trace, Audit events.

## Privacy Mode

Che toàn Panel:
- balance/equity/P&L/income;
- lot/volume/exposure;
- account login/server;
- ticket/order ID;
- Telegram phone/username/chat ID;
- provider endpoint và identifier nhạy cảm.

Giữ status, percentage, win/loss và component health. Share/Export phải tôn trọng Privacy Mode.

## Dashboard

Giữ:
- Trading P&L;
- Total Income;
- Active Exposure;
- Signal Execution Rate;
- Balance & Equity;
- P&L Over Time;
- Trade Activity Heatmap;
- Risk Today;
- Source Performance Summary;
- Open Positions/Recent Orders;
- Runtime/Inbox summary.

Total Income gồm Trading P&L + backcom/cashback/rebate/partner commission/other valid income. Deposit/withdrawal không phải income.

## Hermes

Hermes là top-level menu. Có thể đọc historical sealed data phục vụ học tập nhưng không phải authority cuối cho final lot, route arm, broker write hoặc order send.

## Providers

Provider nằm trong Runtime. Provider mới mặc định inactive. Provider B không tự active. UI chỉ thiết kế test/preview/cutover/rollback flow.
