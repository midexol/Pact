# PACT's Sibyl sidecar

`sibyl-memory-client` is a local, file-based Python SDK over SQLite — there's
no hosted HTTP API for a Next.js/TypeScript app to call directly (see
docs.sibyllabs.org/memory/concepts), and its own CLI/MCP surface only
exposes read-only `search`/`recall`/`list`. This sidecar is a ~90-line
FastAPI wrapper around the real `MemoryClient` so `lib/sibyl/client.ts` can
reach it over plain `localhost` HTTP.

Verified, not guessed: the method calls in `main.py` were checked directly
against the `sibyl_memory_client==0.8.0` source pulled from PyPI, and
`/health`, `/remember`, and `/recall` were smoke-tested end to end against a
real local SQLite store before being wired into PACT.

## Run it

```bash
pip install -r requirements.txt
uvicorn main:app --port 8787
```

Then set `SIBYL_SIDECAR_URL=http://127.0.0.1:8787` and `DEMO_MODE=false` in
PACT's `.env.local`.

The product page for `sibyl-memory-client` describes it as closed beta as of
this writing — `pip install` failing is almost certainly access on Sibyl
Labs' side, not this code. Run the smoke test at the bottom of `main.py`
(`python main.py`) to confirm the SDK itself works before layering FastAPI
on top:

```bash
python main.py
# set_entity ok: {...}
# list_entities: [...]
```

## Why entities, not the journal

Sibyl has five tiers. The obvious first instinct for an event log is the
**journal** tier (`write_event` / `read_events`), but `read_events` only
filters by `since`/`until` — no agent or category filter. PACT's actual
query is "give me Analyst A's comparable history," so events are stored on
the **entities** tier instead: `category=agentId`, `name=event.id`,
`body=event`. `list_entities(category=agentId)` is then a direct,
schema-level filter — `WHERE category = ?` — not a full-store scan or an FTS
guess.

## Known constraints

- **Free tier caps the local DB at 5 MB** (`CapExceededError`). Fine for a
  hackathon demo; worth knowing if you seed a lot of history.
- **No remote reset.** By design — `SibylMemoryStore.reset()` throws on
  purpose. Durable memory that a demo button can wipe isn't durable memory.
- **Single process, single machine.** This sidecar and PACT's Next.js server
  are expected to run side by side locally (or in the same container) for
  the hackathon. It was not designed as a multi-tenant hosted service.
