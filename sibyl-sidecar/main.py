"""
PACT's Sibyl sidecar.

sibyl-memory-client is a local, file-based Python SDK (SQLite under
~/.sibyl-memory/) with no hosted HTTP API of its own — see
docs.sibyllabs.org/memory/concepts. This is a thin FastAPI wrapper around
MemoryClient so PACT's Next.js app (lib/sibyl/client.ts) can reach it over
localhost HTTP, the same way it would reach any other backing store.

Mapping onto Sibyl's tiers, verified against the sibyl_memory_client 0.8.0
source on PyPI:

  - Each CommitmentEvent is stored with set_entity(category=agentId,
    name=event.id, body=event). Sibyl enforces UNIQUE (tenant_id, category,
    name), so category=agentId gives PACT exactly the query it actually
    needs: list_entities(category=agentId) is a direct, schema-level filter
    by provider — no journal filtering, no FTS guesswork.
  - The journal tier (write_event/read_events) was NOT used here: read_events
    only supports since/until, not a category or agent filter, so it doesn't
    fit PACT's "give me this agent's comparable history" access pattern.

Run:
    pip install -r requirements.txt
    uvicorn main:app --port 8787

Note: sibyl-memory-client's product page describes it as closed beta as of
this writing. If `pip install sibyl-memory-client` fails for you, that's
almost certainly access/availability on Sibyl Labs' side, not this code —
confirm your install works standalone (see the __main__ smoke test at the
bottom of this file) before wiring it into PACT.
"""

import os
from typing import Any, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sibyl_memory_client import MemoryClient
from sibyl_memory_client.exceptions import CapExceededError, NotFoundError, ValidationError

DB_PATH = os.environ.get("SIBYL_DB_PATH", os.path.expanduser("~/.sibyl-memory/pact-memory.db"))
memory = MemoryClient.local(DB_PATH)

app = FastAPI(title="PACT Sibyl sidecar")


class CommitmentEvent(BaseModel):
    id: str
    type: str
    commitmentId: str
    agentId: str
    category: str
    createdAt: str
    payload: dict[str, Any]


@app.get("/health")
def health():
    return {"ok": True, "db": DB_PATH}


@app.post("/remember")
def remember(event: CommitmentEvent):
    """category=agentId is the whole trick — it's what makes recall() a
    direct, indexed lookup instead of a full-store scan."""
    try:
        memory.set_entity(event.agentId, event.id, event.model_dump())
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except CapExceededError as e:
        raise HTTPException(status_code=507, detail=str(e))
    return {"ok": True}


@app.get("/recall")
def recall(agentId: Optional[str] = None, category: Optional[str] = None, task: Optional[str] = None):
    # list_entities(category=None) returns everything for the tenant, so an
    # agentId-less recall still works — just scans more rows.
    rows = memory.list_entities(agentId, limit=500)
    events = [row["body"] for row in rows]

    if category:
        events = [e for e in events if e.get("category") == category]
    if task:
        needle = task.lower()
        events = [e for e in events if needle in str(e.get("payload", {}).get("title", "")).lower()]

    events.sort(key=lambda e: e.get("createdAt", ""))
    return {"events": events}


if __name__ == "__main__":
    # Smoke test: run `python main.py` directly to confirm the SDK itself
    # works before putting FastAPI in front of it.
    result = memory.set_entity("smoke-test", "ping", {"ok": True})
    print("set_entity ok:", result)
    print("list_entities:", memory.list_entities("smoke-test"))
