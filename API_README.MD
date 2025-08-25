# WUWA Database API

**Live base URL(DOCS):** `https://api.wuwa-db-api.com`  
**API index (JSON):** `https://api.wuwa-db-api.com/v1`

## Quickstart

### In your browser
- Docs: `https://api.wuwa-db-api.com/`
- Characters: `https://api.wuwa-db-api.com/v1/characters`

### curl (macOS/Linux/cmd)
```bash
# list characters
curl -s https://api.wuwa-db-api.com/v1/characters

# filter
curl -s "https://api.wuwa-db-api.com/v1/characters?element=aero"

# single by id
curl -s https://api.wuwa-db-api.com/v1/characters/1

# list characters (pretty JSON)
irm https://api.wuwa-db-api.com/v1/characters | ConvertTo-Json -Depth 8

# filter
irm "https://api.wuwa-db-api.com/v1/characters?element=aero" | ConvertTo-Json -Depth 8

# first result
(irm https://api.wuwa-db-api.com/v1/characters)[0] | ConvertTo-Json -Depth 8
```

## Endpoints

| Resource   | List                  | Single                             |
| ---------- | --------------------- | ---------------------------------- |
| Characters | `GET /v1/characters`  | `GET /v1/characters/{id or slug}`  |
| Weapons    | `GET /v1/weapons`     | `GET /v1/weapons/{id or slug}`     |
| Echoes     | `GET /v1/echoes`      | `GET /v1/echoes/{id or slug}`      |
| Echo sets  | `GET /v1/echoes/sets` | `GET /v1/echoes/sets/{id or slug}` |

GET /v1 returns a minimal JSON index with these routes.

---

## Filtering & Query Params

### List endpoints support simple, case-insensitive filters:

- element – e.g. ?element=aero will match "Aero"

- rarity – integer, e.g. ?rarity=5


## Examples
```bash
/v1/characters?element=aero
/v1/characters?rarity=5
/v1/characters?element=aero&rarity=5
```

Unknown params or invalid values return HTTP 400 with a JSON error.

### Response Examples

## Character
```bash
{
  "id": 1,
  "name": "Encore",
  "element": "Fusion",
  "rarity": 5
}
```

## CORS

Read-only access from browsers is enabled via CORS for GET routes.


# Deployment (Railway)

## Gunicorn entry (via Procfile or Start Command):

```bash
web: gunicorn api.app:app -w 2 -k gthread -b 0.0.0.0:$PORT
```

Custom domain: point api.your-domain.com to Railway (CNAME to *.up.railway.app or Railway’s Metal Edge A/AAAA records), then verify in Railway.
ProxyFix is enabled so request.host_url and HTTPS detection are correct behind the proxy.