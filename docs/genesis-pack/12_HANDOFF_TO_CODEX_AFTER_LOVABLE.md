# HANDOFF TO CODEX AFTER LOVABLE

## Freeze point

1. Commit donor frontend.
2. Không cho Lovable tiếp tục ghi.
3. Ghi exact commit SHA.
4. Export screenshots 1440 và 390.
5. Export completion report.
6. Giữ donor repo riêng.

## Codex audit

Codex phải:
- verify donor commit;
- inventory routes/control_id;
- phát hiện dead/duplicate/missing;
- phát hiện fixture/fake success;
- đối chiếu SignalOps SDD V2;
- discover backend capabilities;
- map query/command;
- bổ sung adapters;
- import vào SignalOps canonical repo;
- serve frontend từ runtime;
- test lifecycle;
- package official runtime.

## Mapping matrix

| control_id | UI route | use case | backend capability | state authority | safety | verification |
|---|---|---|---|---|---|---|

## Hard rules

- Codex là writer duy nhất của SignalOps repo.
- Donor repo chỉ đọc/import.
- Không tự arm route.
- Không order_check/order_send.
- Không Telegram live action.
- Không Provider B activation.
- Không convert native sizing amount.
- Không sửa test để pass.
- Không giữ fake success.
- Không để fixture vào production runtime.

## Final READY

Chỉ READY khi:
- donor UI imported;
- backend mappings machine-verified;
- route/control checks pass;
- USD/USC sizing invariant verified;
- archive/disable lifecycle verified;
- protected runtime unarmed;
- package built;
- update/restart path verified mà không live broker action.
