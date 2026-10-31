# Tickr V2 – Cloudflare D1

## Setup

1. In Cloudflare dashboard create a D1 database named `tickr`.
2. Bind it to your Pages project as `DB` (Settings → Functions → D1 database bindings).
3. Deploy this branch (or merge).
4. The app will automatically load/save the full state to D1 via `/api/state`.

Local fallback to localStorage remains if the API is unreachable.

## Schema

Single table `app_state` with one row (id=1) holding the entire JSON state.
Created automatically on first request.
