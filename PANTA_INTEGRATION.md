# Panta Integration Foundation

The integration is read-only and is disabled unless the backend environment has:

```env
PANTA_ENABLED=true
PANTA_API_URL=https://official-panta-market-list-endpoint
```

Optional settings:

```env
PANTA_API_KEY=
PANTA_API_KEY_HEADER=Authorization
PANTA_API_KEY_PREFIX=Bearer 
PANTA_API_TIMEOUT_MS=5000
PANTA_MAX_MARKETS=100
```

`PANTA_API_URL` must be the official read-only endpoint that returns a market collection. The adapter accepts a top-level array or arrays under `markets`, `items`, `data`, `data.markets`, or `data.items`. Common market field names are normalized in `TJ backend/services/pantaAnalysisService.js`.

When the flag is disabled, the frontend panel is hidden, analysis requests return `404`, and trade CRUD behavior is unchanged. When Panta is unavailable or no relevant market is found, analysis returns a neutral score of `50` with a status and explanation; trade creation remains available.

## Phase 2

- Schedule immutable probability and alignment snapshots for saved trades.
- Store snapshot timestamps, market lifecycle/status, and market probability changes.
- Add per-trade alignment timelines and movement annotations.
- Add aggregate Panta analytics by asset, direction, classification, and trade outcome.
- Measure alignment-at-entry versus journal results without presenting alignment as win probability.
