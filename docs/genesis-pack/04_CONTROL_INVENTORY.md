# CONTROL INVENTORY

Dùng `control_id` ổn định để Codex map backend sau này.

## Global shell

| control_id | VI | EN | Type | Backend |
|---|---|---|---|---|
| `shell.sidebar.toggle` | Thu gọn/Mở rộng | Collapse/Expand | preference | No |
| `shell.account_scope.open` | Phạm vi tài khoản | Account scope | popover | Query |
| `shell.account_scope.select_all` | Tất cả tài khoản | All accounts | filter | Query |
| `shell.account_scope.select_exact` | Chọn tài khoản | Select account | filter | Query |
| `shell.account_scope.pin` | Ghim mặc định | Pin default | preference | No |
| `shell.language.toggle` | Ngôn ngữ | Language | preference | No |
| `shell.privacy.toggle` | Chế độ riêng tư | Privacy mode | preference | No |
| `shell.inbox.open` | Hộp xử lý | Processing inbox | navigation | Query |
| `shell.health.open` | Trạng thái hệ thống | System status | navigation | Query |
| `shell.refresh` | Làm mới | Refresh | query | Yes |
| `shell.export.open` | Xuất dữ liệu | Export | menu | Yes |
| `shell.share.open` | Chia sẻ báo cáo | Share report | menu | Yes |
| `shell.share.hide_sensitive` | Ẩn dữ liệu nhạy cảm | Hide sensitive data | option | Mixed |

## Dashboard

| control_id | VI | EN | Type |
|---|---|---|---|
| `dashboard.time.today` | Hôm nay | Today | filter |
| `dashboard.time.yesterday` | Hôm qua | Yesterday | filter |
| `dashboard.time.7d` | 7 ngày | 7 days | filter |
| `dashboard.time.30d` | 30 ngày | 30 days | filter |
| `dashboard.time.90d` | 90 ngày | 90 days | filter |
| `dashboard.time.mtd` | Từ đầu tháng | Month to date | filter |
| `dashboard.time.ytd` | Từ đầu năm | Year to date | filter |
| `dashboard.time.custom` | Tùy chỉnh | Custom range | dialog |
| `dashboard.kpi.pnl.open` | Lợi nhuận giao dịch | Trading P&L | drilldown |
| `dashboard.kpi.income.open` | Tổng thu nhập | Total Income | breakdown |
| `dashboard.kpi.exposure.open` | Vị thế đang hoạt động | Active Exposure | navigation |
| `dashboard.kpi.execution.open` | Tỷ lệ thực thi tín hiệu | Signal Execution Rate | drilldown |
| `dashboard.carousel.prev` | Trước | Previous | carousel |
| `dashboard.carousel.next` | Tiếp | Next | carousel |
| `dashboard.carousel.play_pause` | Phát/Tạm dừng | Play/Pause | preference |
| `dashboard.carousel.scrub` | Kéo trang | Scrub | interaction |
| `dashboard.heatmap.bucket_open` | Xem lệnh theo khung giờ | View bucket orders | deep-link |
| `dashboard.risk.open` | Xem rủi ro | View risk | navigation |
| `dashboard.sources.sort` | Sắp xếp nguồn | Sort sources | filter |
| `dashboard.sources.view_all` | Xem tất cả | View all | navigation |
| `dashboard.orders.view_all` | Xem lịch sử | View history | navigation |

## Accounts

| control_id | VI | EN |
|---|---|---|
| `accounts.tab.active` | Đang sử dụng | Active |
| `accounts.tab.archive` | Lưu trữ | Archive |
| `accounts.search` | Tìm tài khoản | Search accounts |
| `accounts.add` | Thêm tài khoản | Add account |
| `accounts.verify` | Xác minh identity | Verify identity |
| `accounts.refresh` | Làm mới trạng thái | Refresh status |
| `accounts.edit` | Chỉnh sửa | Edit |
| `accounts.pin` | Ghim mặc định | Pin default |
| `accounts.archive` | Lưu trữ | Archive |
| `accounts.restore` | Khôi phục | Restore |
| `accounts.delete_permanent` | Xóa vĩnh viễn | Permanently delete |
| `accounts.open_details` | Xem chi tiết | View details |
| `accounts.activation.open` | Kích hoạt tự động hóa | Open activation |

## Sources

| control_id | VI | EN |
|---|---|---|
| `sources.tab.active` | Đang sử dụng | Active |
| `sources.tab.performance` | Hiệu suất | Performance |
| `sources.tab.archive` | Lưu trữ | Archive |
| `sources.search` | Tìm nguồn | Search sources |
| `sources.filter.group` | Nhóm | Group |
| `sources.filter.state` | Trạng thái | State |
| `sources.filter.symbol` | Symbol | Symbol |
| `sources.add` | Thêm nguồn | Add source |
| `sources.import` | Nhập nguồn | Import |
| `sources.export` | Xuất nguồn | Export |
| `sources.verify` | Kiểm tra nguồn | Verify source |
| `sources.edit` | Chỉnh sửa | Edit |
| `sources.toggle` | Bật/Tắt | Enable/Disable |
| `sources.archive` | Lưu trữ | Archive |
| `sources.restore` | Khôi phục | Restore |
| `sources.delete_permanent` | Xóa vĩnh viễn | Permanently delete |
| `sources.performance.open` | Xem hiệu suất | View performance |
| `sources.history.open` | Xem lịch sử | View history |

## Signals

| control_id | VI | EN |
|---|---|---|
| `signals.filter.date` | Khoảng thời gian | Date range |
| `signals.filter.account` | Tài khoản | Account |
| `signals.filter.source` | Nguồn | Source |
| `signals.filter.symbol` | Symbol | Symbol |
| `signals.filter.status` | Trạng thái | Status |
| `signals.filter.parser` | Parser | Parser |
| `signals.search` | Tìm message/correlation ID | Search message/correlation ID |
| `signals.open_detail` | Xem chi tiết | View details |
| `signals.open_original` | Xem bản gốc | View original |
| `signals.open_trace` | Mở truy vết | Open trace |
| `signals.copy_correlation` | Sao chép correlation ID | Copy correlation ID |
| `signals.open_orders` | Xem lệnh liên quan | View related orders |
| `signals.inspect_parser` | Kiểm tra parser | Inspect parser |

## Positions

| control_id | VI | EN |
|---|---|---|
| `positions.refresh` | Làm mới | Refresh |
| `positions.filter.account` | Tài khoản | Account |
| `positions.filter.source` | Nguồn | Source |
| `positions.filter.symbol` | Symbol | Symbol |
| `positions.filter.side` | Hướng lệnh | Side |
| `positions.open_detail` | Xem chi tiết | View details |
| `positions.open_signal` | Mở tín hiệu | Open signal |
| `positions.open_trace` | Mở truy vết | Open trace |
| `positions.export` | Xuất snapshot | Export snapshot |

Không dựng fake Close/Close all.

## Order History

| control_id | VI | EN |
|---|---|---|
| `orders.time.today` | Hôm nay | Today |
| `orders.time.yesterday` | Hôm qua | Yesterday |
| `orders.time.7d` | 7 ngày | 7 days |
| `orders.time.30d` | 30 ngày | 30 days |
| `orders.time.90d` | 90 ngày | 90 days |
| `orders.time.mtd` | Từ đầu tháng | Month to date |
| `orders.time.ytd` | Từ đầu năm | Year to date |
| `orders.time.custom` | Tùy chỉnh | Custom range |
| `orders.filter.hour` | Khung giờ | Time of day |
| `orders.filter.account` | Tài khoản | Account |
| `orders.filter.source` | Nguồn | Source |
| `orders.filter.symbol` | Symbol | Symbol |
| `orders.filter.side` | Hướng lệnh | Side |
| `orders.filter.result` | Kết quả | Result |
| `orders.filter.status` | Trạng thái | Status |
| `orders.search` | Ticket/Correlation ID | Ticket/Correlation ID |
| `orders.page_size` | Số dòng | Page size |
| `orders.open_detail` | Xem chi tiết | View details |
| `orders.open_signal` | Mở tín hiệu | Open signal |
| `orders.open_trace` | Mở truy vết | Open trace |
| `orders.copy_ticket` | Sao chép ticket | Copy ticket |
| `orders.copy_correlation` | Sao chép correlation ID | Copy correlation ID |
| `orders.export_csv` | Xuất CSV | Export CSV |
| `orders.export_json` | Xuất JSON | Export JSON |

## Risk

| control_id | VI | EN |
|---|---|---|
| `risk.account_scope` | Phạm vi tài khoản | Account scope |
| `risk.edit_draft` | Chỉnh sửa policy | Edit policy |
| `risk.preview_impact` | Kiểm tra tác động | Preview impact |
| `risk.compare_versions` | So sánh phiên bản | Compare versions |
| `risk.apply` | Lưu và áp dụng | Save and apply |
| `risk.restore_version` | Khôi phục phiên bản | Restore version |
| `risk.export` | Xuất policy/evidence | Export policy/evidence |

## Telegram

| control_id | VI | EN |
|---|---|---|
| `telegram.api_id.edit` | API ID | API ID |
| `telegram.api_hash.edit` | API Hash | API Hash |
| `telegram.config.save` | Lưu cấu hình | Save configuration |
| `telegram.send_code` | Gửi mã | Send code |
| `telegram.otp.submit` | Xác nhận OTP | Submit OTP |
| `telegram.2fa.submit` | Xác nhận 2FA | Submit 2FA |
| `telegram.auth.cancel` | Hủy | Cancel |
| `telegram.test_readonly` | Kiểm tra read-only | Read-only test |
| `telegram.reconnect` | Kết nối lại | Reconnect |
| `telegram.revoke` | Thu hồi/Đăng xuất | Revoke/Logout |
| `telegram.identity.open` | Xem identity | View identity |
| `telegram.sources.open` | Mở nguồn tín hiệu | Open sources |
| `telegram.inbox.open` | Mở hộp xử lý | Open inbox |

## Runtime and Providers

| control_id | VI | EN |
|---|---|---|
| `runtime.tab.overview` | Tổng quan | Overview |
| `runtime.tab.components` | Thành phần | Components |
| `runtime.tab.providers` | Providers | Providers |
| `runtime.tab.versions` | Phiên bản & cập nhật | Versions & Updates |
| `runtime.tab.logs` | Nhật ký | Logs |
| `runtime.refresh` | Làm mới | Refresh |
| `runtime.self_test` | Chạy self-test read-only | Run read-only self-test |
| `runtime.logs.open` | Xem log | View logs |
| `runtime.component.restart` | Khởi động lại thành phần | Restart component |
| `runtime.inbox.open` | Mở lỗi liên quan | Open related inbox |
| `runtime.update.open` | Cập nhật runtime | Update runtime |
| `runtime.rollback.open` | Hoàn tác phiên bản | Roll back version |
| `providers.add` | Thêm provider | Add provider |
| `providers.test` | Kiểm tra read-only | Read-only test |
| `providers.edit` | Chỉnh sửa | Edit |
| `providers.switch_preview` | Xem trước chuyển đổi | Preview switch |
| `providers.activate` | Kích hoạt | Activate |
| `providers.deactivate` | Vô hiệu hóa | Deactivate |
| `providers.archive` | Lưu trữ | Archive |
| `providers.restore` | Khôi phục | Restore |
| `providers.delete_permanent` | Xóa vĩnh viễn | Permanently delete |

## Hermes

| control_id | VI | EN |
|---|---|---|
| `hermes.tab.overview` | Tổng quan | Overview |
| `hermes.tab.accounts` | Tài khoản & kích hoạt | Accounts & Activation |
| `hermes.tab.sources` | Hiệu suất nguồn | Source Performance |
| `hermes.tab.decisions` | Quyết định & khuyến nghị | Decisions & Recommendations |
| `hermes.tab.learning` | Dữ liệu học tập | Learning Data |
| `hermes.tab.policies` | Policy & phiên bản | Policies & Versions |
| `hermes.tab.trace` | Truy vết | Trace |
| `hermes.activation.preview` | Xem trước activation bundle | Preview activation bundle |
| `hermes.activation.open` | Mở kích hoạt | Open activation |
| `hermes.recommendation.open` | Xem khuyến nghị | View recommendation |
| `hermes.evidence.open` | Xem evidence | View evidence |
| `hermes.dataset.open` | Xem dataset | View dataset |

## Inbox

| control_id | VI | EN |
|---|---|---|
| `inbox.filter.severity` | Mức độ | Severity |
| `inbox.filter.component` | Thành phần | Component |
| `inbox.filter.account` | Tài khoản | Account |
| `inbox.filter.source` | Nguồn | Source |
| `inbox.filter.date` | Thời gian | Date |
| `inbox.filter.state` | Trạng thái | State |
| `inbox.open_detail` | Xem chi tiết | View details |
| `inbox.open_entity` | Mở đối tượng liên quan | Open related entity |
| `inbox.provide_input` | Cung cấp đầu vào | Provide input |
| `inbox.recheck` | Kiểm tra lại | Re-run check |
| `inbox.open_trace` | Mở truy vết | Open trace |
| `inbox.copy_correlation` | Sao chép correlation ID | Copy correlation ID |
| `inbox.export_evidence` | Xuất evidence | Export evidence |

## Trace

| control_id | VI | EN |
|---|---|---|
| `trace.search` | Tìm correlation ID | Search correlation ID |
| `trace.filter.account` | Tài khoản | Account |
| `trace.filter.source` | Nguồn | Source |
| `trace.filter.signal` | Tín hiệu | Signal |
| `trace.filter.order` | Lệnh | Order |
| `trace.filter.component` | Thành phần | Component |
| `trace.filter.date` | Thời gian | Date |
| `trace.copy_id` | Sao chép ID | Copy ID |
| `trace.open_account` | Mở tài khoản | Open account |
| `trace.open_source` | Mở nguồn | Open source |
| `trace.open_signal` | Mở tín hiệu | Open signal |
| `trace.open_order` | Mở lệnh | Open order |
| `trace.export_json` | Xuất JSON | Export JSON |
| `trace.export_csv` | Xuất CSV | Export CSV |
