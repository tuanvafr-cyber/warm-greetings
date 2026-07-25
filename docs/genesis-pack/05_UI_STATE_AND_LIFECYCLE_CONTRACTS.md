# UI STATE AND LIFECYCLE CONTRACTS

## Common view states

| State | Ý nghĩa |
|---|---|
| `loading` | Đang tải |
| `empty` | Không có dữ liệu |
| `not_connected` | Chưa kết nối backend |
| `ready` | Có dữ liệu usable |
| `disabled` | Tạm dừng nhưng chưa archive |
| `draining` | Không nhận mới, đang hoàn tất lifecycle cũ |
| `archived` | Đóng băng trong tab archive |
| `frozen` | Cấu hình không thể sửa |
| `degraded` | Hoạt động một phần |
| `input_required` | Cần operator input |
| `blocked` | Backend từ chối theo contract |
| `stale` | Snapshot quá cũ |
| `unavailable` | Capability/data chưa có |
| `error` | Request/render lỗi |
| `success_confirmed` | Backend đã xác nhận machine state |

## Backend-required button

`idle → confirm → submitting → success_confirmed | blocked | error → refetch`

Không dùng `click → local state mutate → success toast`.

## Destructive dialog

Phải nói rõ:
- entity nào bị tác động;
- điều gì dừng;
- dữ liệu nào giữ;
- có restore hay không;
- dependency nào có thể block.

## Source states

### Active enabled
Toggle on; intake/parser indicators; Verify/Edit/Disable/Archive.

### Active disabled
Toggle off; vẫn ở Active; show `disabled_at`; show open orders/lifecycles; Enable/Edit/Archive.

### Draining
Không nhận mới; show outstanding lifecycle count; config read-only; archive pending.

### Archived/Frozen
Archive tab; no live intake/ranking; history accessible; Restore/Export/Permanent delete.

## Account states

Connected; Offline; Input required; Draining; Archived/Frozen; Deleted reference.

## Provider states

Inactive; Testing; Ready; Active; Degraded; Draining; Archived; Deleted reference.

Provider mới bắt đầu Inactive.

## Runtime health

Healthy; Degraded; Input required; Blocked; Stale; Unavailable.

Không hiển thị Healthy khi không có data thật.

## Data freshness

Mỗi snapshot card có last updated, age và stale state.

## Privacy

Mask không phá layout. Share/Export privacy-safe phải dùng masked output, không chỉ CSS.
