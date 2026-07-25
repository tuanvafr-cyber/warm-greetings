// Centralised VI/EN dictionary. NEVER hard-code user-facing strings outside this file.
// Rule (see docs/genesis-pack/08_I18N_COPY_GUIDE.md): one locale at a time — no mixing.

export type Locale = "vi" | "en";

export const LOCALES: Locale[] = ["vi", "en"];

type Dict = Record<string, { vi: string; en: string }>;

export const dictionary = {
  "app.name": { vi: "SignalOps", en: "SignalOps" },
  "app.tagline": { vi: "Bảng điều hành tín hiệu", en: "Signal operations panel" },

  // Navigation
  "nav.primary": { vi: "Chính", en: "Primary" },
  "nav.operations": { vi: "Vận hành", en: "Operations" },
  "nav.intelligence": { vi: "Trí tuệ", en: "Intelligence" },
  "nav.system": { vi: "Hệ thống", en: "System" },
  "nav.dashboard": { vi: "Bảng điều khiển", en: "Dashboard" },
  "nav.accounts": { vi: "Tài khoản", en: "Accounts" },
  "nav.signals": { vi: "Tín hiệu", en: "Signals" },
  "nav.positions": { vi: "Lệnh đang mở", en: "Open Positions" },
  "nav.orders": { vi: "Lịch sử lệnh", en: "Order History" },
  "nav.sources": { vi: "Nguồn tín hiệu", en: "Signal Sources" },
  "nav.risk": { vi: "Quản trị rủi ro", en: "Risk Management" },
  "nav.telegram": { vi: "Telegram", en: "Telegram" },
  "nav.hermes": { vi: "Hermes", en: "Hermes" },
  "nav.runtime": { vi: "Runtime", en: "Runtime" },
  "nav.inbox": { vi: "Hộp xử lý", en: "Processing Inbox" },
  "nav.trace": { vi: "Truy vết", en: "Trace" },

  // Shell
  "shell.collapse": { vi: "Thu gọn thanh điều hướng", en: "Collapse sidebar" },
  "shell.expand": { vi: "Mở rộng thanh điều hướng", en: "Expand sidebar" },
  "shell.account_scope": { vi: "Phạm vi tài khoản", en: "Account scope" },
  "shell.account_scope.all": { vi: "Tất cả tài khoản", en: "All accounts" },
  "shell.account_scope.pin": { vi: "Ghim mặc định", en: "Pin as default" },
  "shell.language": { vi: "Ngôn ngữ", en: "Language" },
  "shell.privacy": { vi: "Chế độ riêng tư", en: "Privacy mode" },
  "shell.privacy.on": { vi: "Đang ẩn dữ liệu nhạy cảm", en: "Sensitive data hidden" },
  "shell.privacy.off": { vi: "Đang hiện dữ liệu", en: "Showing full data" },
  "shell.inbox": { vi: "Hộp xử lý", en: "Processing inbox" },
  "shell.health": { vi: "Trạng thái hệ thống", en: "System status" },
  "shell.refresh": { vi: "Làm mới", en: "Refresh" },
  "shell.export": { vi: "Xuất dữ liệu", en: "Export" },
  "shell.share": { vi: "Chia sẻ báo cáo", en: "Share report" },
  "shell.share.hide_sensitive": {
    vi: "Ẩn dữ liệu nhạy cảm",
    en: "Hide sensitive data",
  },

  // Status
  "status.healthy": { vi: "Bình thường", en: "Healthy" },
  "status.degraded": { vi: "Suy giảm", en: "Degraded" },
  "status.input_required": { vi: "Cần đầu vào", en: "Input required" },
  "status.blocked": { vi: "Bị chặn", en: "Blocked" },
  "status.stale": { vi: "Dữ liệu cũ", en: "Stale data" },
  "status.unavailable": { vi: "Không khả dụng", en: "Unavailable" },
  "status.not_connected": { vi: "Chưa kết nối", en: "Not connected" },

  // Source lifecycle
  "source.active": { vi: "Đang bật", en: "Active" },
  "source.disabled": { vi: "Đã tắt", en: "Disabled" },
  "source.draining": { vi: "Đang hoàn tất", en: "Draining" },
  "source.archived": { vi: "Đã lưu trữ", en: "Archived" },
  "source.frozen": { vi: "Đã đóng băng", en: "Frozen" },

  // Common actions
  "common.add": { vi: "Thêm", en: "Add" },
  "common.edit": { vi: "Chỉnh sửa", en: "Edit" },
  "common.verify": { vi: "Kiểm tra", en: "Verify" },
  "common.archive": { vi: "Lưu trữ", en: "Archive" },
  "common.restore": { vi: "Khôi phục", en: "Restore" },
  "common.delete_permanent": { vi: "Xóa vĩnh viễn", en: "Permanently delete" },
  "common.export": { vi: "Xuất dữ liệu", en: "Export" },
  "common.share": { vi: "Chia sẻ báo cáo", en: "Share report" },
  "common.refresh": { vi: "Làm mới", en: "Refresh" },
  "common.cancel": { vi: "Hủy", en: "Cancel" },
  "common.save": { vi: "Lưu", en: "Save" },
  "common.search": { vi: "Tìm kiếm", en: "Search" },
  "common.filter": { vi: "Bộ lọc", en: "Filters" },
  "common.close": { vi: "Đóng", en: "Close" },
  "common.retry": { vi: "Thử lại", en: "Retry" },
  "common.view_details": { vi: "Xem chi tiết", en: "View details" },

  // Time ranges (shared)
  "time.today": { vi: "Hôm nay", en: "Today" },
  "time.yesterday": { vi: "Hôm qua", en: "Yesterday" },
  "time.7d": { vi: "7 ngày", en: "7 days" },
  "time.30d": { vi: "30 ngày", en: "30 days" },
  "time.90d": { vi: "90 ngày", en: "90 days" },
  "time.mtd": { vi: "Từ đầu tháng", en: "Month to date" },
  "time.ytd": { vi: "Từ đầu năm", en: "Year to date" },
  "time.custom": { vi: "Tùy chỉnh", en: "Custom range" },

  // Shared state views
  "state.loading": { vi: "Đang tải…", en: "Loading…" },
  "state.empty.title": { vi: "Chưa có dữ liệu", en: "No data yet" },
  "state.empty.desc": {
    vi: "Khi có dữ liệu, nó sẽ hiển thị ở đây.",
    en: "Once data is available it will appear here.",
  },
  "state.not_connected.title": {
    vi: "Chưa kết nối backend",
    en: "Backend not connected",
  },
  "state.not_connected.desc": {
    vi: "Giao diện đã sẵn sàng. Codex sẽ kết nối adapter SignalOps thực tế để bật chức năng này.",
    en: "The UI is ready. Codex will wire the real SignalOps adapter to enable this feature.",
  },
  "state.blocked.title": { vi: "Thao tác bị chặn", en: "Action blocked" },
  "state.blocked.desc": {
    vi: "Thao tác này bị chặn vì thiếu điều kiện tiên quyết.",
    en: "This action is blocked because a prerequisite is not met.",
  },
  "state.stale": {
    vi: "Dữ liệu có thể đã cũ.",
    en: "Data may be stale.",
  },
  "state.error.title": { vi: "Có lỗi xảy ra", en: "Something went wrong" },
  "state.error.desc": {
    vi: "Vui lòng thử làm mới lại trang.",
    en: "Please try refreshing the page.",
  },
  "state.unavailable.title": { vi: "Không khả dụng", en: "Unavailable" },
  "state.unavailable.desc": {
    vi: "Tính năng này chưa khả dụng cho phạm vi hiện tại.",
    en: "This feature is unavailable for the current scope.",
  },
  "state.fixture_notice": {
    vi: "Đây là dữ liệu minh họa, không phải dữ liệu vận hành thật.",
    en: "This is illustrative fixture data, not live operational data.",
  },

  // Dashboard
  "dashboard.title": { vi: "Bảng điều khiển", en: "Dashboard" },
  "dashboard.subtitle": {
    vi: "Tổng quan vận hành theo phạm vi tài khoản đã chọn.",
    en: "Operational overview for the selected account scope.",
  },
  "dashboard.trading_pnl": { vi: "Lợi nhuận giao dịch", en: "Trading P&L" },
  "dashboard.total_income": { vi: "Tổng thu nhập", en: "Total Income" },
  "dashboard.active_exposure": {
    vi: "Vị thế đang hoạt động",
    en: "Active Exposure",
  },
  "dashboard.signal_execution_rate": {
    vi: "Tỷ lệ thực thi tín hiệu",
    en: "Signal Execution Rate",
  },
  "dashboard.balance_equity": { vi: "Số dư & Vốn", en: "Balance & Equity" },
  "dashboard.pnl_over_time": { vi: "P&L theo thời gian", en: "P&L Over Time" },
  "dashboard.heatmap": {
    vi: "Bản đồ hoạt động giao dịch",
    en: "Trade Activity Heatmap",
  },
  "dashboard.risk_today": { vi: "Rủi ro hôm nay", en: "Risk Today" },
  "dashboard.source_performance": {
    vi: "Hiệu suất nguồn",
    en: "Source Performance",
  },
  "dashboard.open_positions_recent": {
    vi: "Vị thế mở & Lệnh gần đây",
    en: "Open positions & Recent orders",
  },
  "dashboard.runtime_inbox": {
    vi: "Runtime & Hộp xử lý",
    en: "Runtime & Inbox",
  },

  // Route stub description
  "route.stub.title": { vi: "Sẵn sàng để kết nối", en: "Ready to be wired" },
  "route.stub.desc": {
    vi: "Kiến trúc trang, control và trạng thái đã sẵn sàng. Nội dung sẽ hiển thị khi Codex kết nối adapter SignalOps.",
    en: "The page architecture, controls and state contracts are in place. Content will appear once Codex wires the SignalOps adapter.",
  },
  "route.header.accounts": {
    vi: "Quản lý các tài khoản đang sử dụng và lưu trữ.",
    en: "Manage active and archived accounts.",
  },
  "route.header.signals": {
    vi: "Vòng đời tín hiệu từ nguồn đến thực thi.",
    en: "Signal lifecycle from source to execution.",
  },
  "route.header.positions": {
    vi: "Vị thế đang mở và lệnh chờ.",
    en: "Open positions and pending orders.",
  },
  "route.header.orders": {
    vi: "Lịch sử lệnh có giới hạn theo phạm vi.",
    en: "Bounded order history for the current scope.",
  },
  "route.header.sources": {
    vi: "Quản lý nguồn tín hiệu — Đang dùng, Hiệu suất và Lưu trữ.",
    en: "Manage signal sources — Active, Performance, Archive.",
  },
  "route.header.risk": {
    vi: "Chính sách rủi ro và tác động thực tế.",
    en: "Risk policy and effective risk.",
  },
  "route.header.telegram": {
    vi: "Phiên và xác thực Telegram.",
    en: "Telegram session and authentication.",
  },
  "route.header.hermes": {
    vi: "Trí tuệ, học tập và khuyến nghị.",
    en: "Intelligence, learning and recommendations.",
  },
  "route.header.runtime": {
    vi: "Thành phần, providers, cập nhật và nhật ký.",
    en: "Components, providers, updates and logs.",
  },
  "route.header.inbox": {
    vi: "Đầu vào cần xử lý, blocker và đối soát.",
    en: "Inputs, blockers and reconciliations to process.",
  },
  "route.header.trace": {
    vi: "Truy vết vòng đời không thể chỉnh sửa.",
    en: "Immutable lifecycle trace.",
  },

  // Accounts / Sources tabs
  "accounts.tab.active": { vi: "Đang sử dụng", en: "Active" },
  "accounts.tab.archive": { vi: "Lưu trữ", en: "Archive" },
  "sources.tab.active": { vi: "Đang sử dụng", en: "Active" },
  "sources.tab.performance": { vi: "Hiệu suất", en: "Performance" },
  "sources.tab.archive": { vi: "Lưu trữ", en: "Archive" },

  // Runtime / Hermes tabs
  "runtime.tab.overview": { vi: "Tổng quan", en: "Overview" },
  "runtime.tab.components": { vi: "Thành phần", en: "Components" },
  "runtime.tab.providers": { vi: "Providers", en: "Providers" },
  "runtime.tab.versions": { vi: "Phiên bản & cập nhật", en: "Versions & Updates" },
  "runtime.tab.logs": { vi: "Nhật ký", en: "Logs" },
  "hermes.tab.overview": { vi: "Tổng quan", en: "Overview" },
  "hermes.tab.accounts": { vi: "Tài khoản & kích hoạt", en: "Accounts & Activation" },
  "hermes.tab.sources": { vi: "Hiệu suất nguồn", en: "Source Performance" },
  "hermes.tab.decisions": {
    vi: "Quyết định & khuyến nghị",
    en: "Decisions & Recommendations",
  },
  "hermes.tab.learning": { vi: "Dữ liệu học tập", en: "Learning Data" },
  "hermes.tab.policies": { vi: "Policy & phiên bản", en: "Policies & Versions" },
  "hermes.tab.trace": { vi: "Truy vết", en: "Trace" },
} satisfies Dict;

export type TKey = keyof typeof dictionary;
