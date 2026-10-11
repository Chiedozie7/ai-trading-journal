# Panta Integration Foundation

The integration is read-only and is disabled unless the backend environment has:

```env
PANTA_ENABLED=true
PANTA_API_BASE_URL=https://live-api.panta.market/api/v1
PANTA_API_KEY=server-side-api-key
```

Optional settings:

```env
PANTA_API_TIMEOUT_MS=5000
PANTA_MAX_MARKETS=100
```

The backend calls `GET {PANTA_API_BASE_URL}/markets/` with the required trailing slash and sends `PANTA_API_KEY` only as the `X-Api-Key` request header. The key is never returned to the frontend.

When the flag is disabled, the frontend panel is hidden, analysis requests return `404`, and trade CRUD behavior is unchanged. When Panta is unavailable or no relevant market is found, analysis returns a neutral score of `50` with a status and explanation; trade creation remains available.

## Timeline and analytics

- The initial analysis is stored with the journal record and copied into the first timeline snapshot.
- Open trades refresh when their detail page is opened or when the user selects `Refresh Panta`.
- A snapshot is added only when score changes by at least one point, a market/classification changes, or a YES probability moves by at least one percentage point.
- Trades with a final `result` do not receive additional snapshots.
- The trade detail page shows entry/current alignment, timeline history, classifications, reasons, and probability movement.
- Analytics compare entry alignment buckets with wins, losses, breakevens, win rate, and average realized R.

Panta's public OpenAPI schema confirms `/api/v1/markets/`, but does not document its response body. Panta's production web client was observed consuming `id`, `registryEventId`, `eventPda`, `question`, `category`, `yesPrice`, `noPrice`, `yesOdd`, `noOdd`, `startTime`, `isActive`, `isResolved`, and `isCancelled`, with snake-case fallbacks. TradeLedger normalization is limited to those observed fields. A live API key is still required to verify the exact catalog envelope and sample values returned by `/markets/`.
