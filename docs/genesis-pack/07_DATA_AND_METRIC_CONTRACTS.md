# DATA AND METRIC CONTRACTS

## Native account configuration

- `native_currency`: USD | USC
- `configured_native_risk_amount`
- `native_balance`
- `native_equity`

Hiển thị setting đúng native unit. Không convert `configured_native_risk_amount`.

## Reporting

- `reporting_currency`: USD
- `reporting_amount_usd`

USD giữ nguyên; USC chia 100. Chỉ cho Panel/analytics/report/Hermes.

## Dashboard metrics

### Trading P&L
Deal profit/loss + swap + commission + broker fee.

### Other Income
Backcom + cashback + rebate + partner commission + other valid income.

### Total Income
Trading P&L + Other Income. Không gồm deposit/withdrawal.

### Active Exposure
Open positions + pending orders + floating P&L USD + margin used.

### Signal Execution Rate
Eligible + executed + policy blocked + technical failed + execution rate. Không gọi Conversion Rate.

## Source Performance

Dashboard:
- source;
- signal win rate;
- net P&L USD;
- today USD;
- net pips;
- total orders;
- state.

Detail:
- signal/order win rate;
- net trading P&L;
- attributable income;
- average daily P&L;
- daily return;
- profit factor;
- average win/loss;
- RR;
- max drawdown;
- execution rate;
- technical failure;
- latency;
- best symbol/hour;
- total orders.

`Total Orders` là số lệnh đã hoàn tất dùng trong thống kê.

## Pip

XAUUSD: `pips = abs(close - open) / 0.1`.

UI không hard-code cho mọi symbol; model cần `pip_size`.

## Heatmap bucket

- start/end time;
- order_count;
- win/loss/unresolved count;
- net_pnl_usd;
- net_pips;
- best/worst order;
- top_source;
- account_scope.

Color: positive green, negative red, else gray. Dot size = order count.

## Fixture safety

Fixture phải có:
- `visual_fixture_only: true`
- `not_live_data: true`
- `backend_required: true`

Không hiển thị như production live.
