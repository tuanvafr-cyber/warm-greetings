# SIGNALOPS PANEL — LOVABLE GENESIS PACK V1

## Mục tiêu

Build mới toàn bộ SignalOps Panel từ số 0 bằng Lovable, dùng bốn ảnh tham chiếu đã có và bộ đặc tả trong pack này.

Lovable chịu trách nhiệm về kiến trúc giao diện, design system, navigation, component dùng chung, responsive desktop/tablet/mobile, i18n Việt/Anh, visual state và interaction prototype.

Lovable không chịu trách nhiệm về MT5 execution, broker write, Telegram live authorization, route arm, risk sizing thật, provider cutover thật, runtime restart/update thật, migration, secret storage hoặc backend state authority.

Sau khi Lovable hoàn tất, code donor sẽ được audit và map vào SignalOps backend bằng Codex.

## Cách dùng

1. Tạo project Lovable mới từ số 0.
2. Kết nối một repo frontend donor riêng, ví dụ `signalops-panel-next`.
3. Không để Lovable ghi trực tiếp vào repo SignalOps production.
4. Đặt bốn ảnh vào `references/`:
   - `01_signalops_current_panel.png`
   - `02_revello_dashboard_reference.webp`
   - `03_chatgpt_sidebar_expanded.png`
   - `04_chatgpt_sidebar_collapsed.png`
5. Upload toàn bộ file `.md`.
6. Dán nguyên `11_LOVABLE_FULL_BUILD_ORDER.md`.
7. Sau khi hoàn tất, freeze commit và làm theo `12_HANDOFF_TO_CODEX_AFTER_LOVABLE.md`.

## Không cần ảnh bổ sung

Không cần ảnh heatmap, trang nguồn hiện tại, mobile hoặc logo.

Lovable phải:
- tự thiết kế heatmap theo ngôn ngữ chart/card của ảnh Revello;
- tự thiết kế trang Nguồn tín hiệu mới theo contract;
- tự xây mobile responsive;
- dùng wordmark “SignalOps” và icon hệ thống có sẵn.

## Thứ tự authority

1. `01_PROJECT_KNOWLEDGE.md`
2. `02_MASTER_PRODUCT_BRIEF.md`
3. `03_INFORMATION_ARCHITECTURE_AND_ROUTES.md`
4. `04_CONTROL_INVENTORY.md`
5. `05_UI_STATE_AND_LIFECYCLE_CONTRACTS.md`
6. `07_DATA_AND_METRIC_CONTRACTS.md`
7. `06_DESIGN_SYSTEM_AND_RESPONSIVE.md`
8. `08_I18N_COPY_GUIDE.md`
9. `09_VISUAL_REFERENCE_GUIDE.md`
10. `10_ACCEPTANCE_CHECKLIST.md`

Khi thiếu backend adapter, hiển thị `backend required`, `unavailable`, `blocked` hoặc `not connected`; không giả thành công.
