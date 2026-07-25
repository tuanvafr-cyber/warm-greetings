# I18N COPY GUIDE

## Rule

Một locale tại một thời điểm. Technical IDs giữ nguyên nhưng label/help/error theo locale. Không hard-code user-facing strings ngoài dictionary.

| Key | VI | EN |
|---|---|---|
| `nav.dashboard` | Bảng điều khiển | Dashboard |
| `nav.accounts` | Tài khoản | Accounts |
| `nav.signals` | Tín hiệu | Signals |
| `nav.positions` | Lệnh đang mở | Open Positions |
| `nav.orders` | Lịch sử lệnh | Order History |
| `nav.sources` | Nguồn tín hiệu | Signal Sources |
| `nav.risk` | Quản trị rủi ro | Risk Management |
| `nav.telegram` | Telegram | Telegram |
| `nav.hermes` | Hermes | Hermes |
| `nav.runtime` | Runtime | Runtime |
| `nav.inbox` | Hộp xử lý | Processing Inbox |
| `nav.trace` | Truy vết | Trace |
| `status.healthy` | Bình thường | Healthy |
| `status.degraded` | Suy giảm | Degraded |
| `status.input_required` | Cần đầu vào | Input required |
| `status.blocked` | Bị chặn | Blocked |
| `status.stale` | Dữ liệu cũ | Stale data |
| `status.unavailable` | Không khả dụng | Unavailable |
| `source.active` | Đang bật | Active |
| `source.disabled` | Đã tắt | Disabled |
| `source.draining` | Đang hoàn tất | Draining |
| `source.archived` | Đã lưu trữ | Archived |
| `source.frozen` | Đã đóng băng | Frozen |
| `common.add` | Thêm | Add |
| `common.edit` | Chỉnh sửa | Edit |
| `common.verify` | Kiểm tra | Verify |
| `common.archive` | Lưu trữ | Archive |
| `common.restore` | Khôi phục | Restore |
| `common.delete_permanent` | Xóa vĩnh viễn | Permanently delete |
| `common.export` | Xuất dữ liệu | Export |
| `common.share` | Chia sẻ báo cáo | Share report |
| `common.refresh` | Làm mới | Refresh |
| `privacy.on` | Chế độ riêng tư | Privacy mode |
| `privacy.off` | Hiện dữ liệu | Show data |
| `dashboard.trading_pnl` | Lợi nhuận giao dịch | Trading P&L |
| `dashboard.total_income` | Tổng thu nhập | Total Income |
| `dashboard.active_exposure` | Vị thế đang hoạt động | Active Exposure |
| `dashboard.signal_execution_rate` | Tỷ lệ thực thi tín hiệu | Signal Execution Rate |
| `dashboard.risk_today` | Rủi ro hôm nay | Risk Today |
| `dashboard.source_performance` | Hiệu suất nguồn | Source Performance |
| `table.total_orders` | Tổng lệnh | Total Orders |

Machine reason code có thể giữ nguyên nhưng phải có explanation theo locale.
