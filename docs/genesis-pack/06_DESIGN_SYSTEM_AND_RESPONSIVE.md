# DESIGN SYSTEM AND RESPONSIVE

## Visual direction

- Giữ blue identity SignalOps.
- Nền sáng, card trắng, border nhẹ, shadow tiết chế.
- Typography rõ, density cao nhưng không chật.
- Không clone Revello hay dùng ecommerce language.

## Tokens

Lovable tự rút token từ ảnh SignalOps:
- primary blue;
- surfaces;
- border;
- text primary/secondary;
- success/danger/warning/info/muted;
- focus ring.

Heatmap chỉ green/red/gray.

## Typography and spacing

- Heading hierarchy rõ.
- KPI number dễ đọc.
- Monospace cho ticket/correlation ID khi phù hợp.
- 4/8 px spacing rhythm.
- Desktop card gap 16–24 px; mobile 12–16 px.
- Radius đồng nhất; không glassmorphism.

## Sidebar

- Expanded 264–280 px.
- Collapsed 68–76 px.
- Motion 180–250 ms.
- Reduced motion.
- Tooltip chỉ khi collapsed.

## Dashboard layout

Desktop:
- KPI 4 cột;
- analytics 2/3 + risk/inbox 1/3;
- source performance full width;
- positions/orders full width.

Tablet:
- KPI 2x2;
- analytics full width;
- risk dưới chart.

Mobile:
- KPI compact hoặc horizontal snap;
- navigation drawer;
- filter bottom sheet;
- table thành card/list;
- detail full-screen sheet;
- không overflow ngang.

## Validate

1440, 1024, 768, 390 px.

## Accessibility

Keyboard, focus visible, aria-label, không chỉ dựa màu, touch target hợp lý, reduced motion, no layout jump, destructive confirm.

## Tables

Desktop: sticky header khi hợp lý, server-pagination-ready, compact density.

Mobile: row thành card; primary facts luôn hiện; secondary trong details; actions có label; không horizontal-scroll critical actions.

## Shared states

Thiết kế system đồng nhất cho skeleton, empty, retry, not connected, stale, blocked, unavailable và error.
