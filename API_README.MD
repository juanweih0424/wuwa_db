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

# Endpoints

| Resource   | List                  | Single                             |
| ---------- | --------------------- | ---------------------------------- |
| Characters | `GET /v1/characters`  | `GET /v1/characters/{id or slug}`  |
| Weapons    | `GET /v1/weapons`     | `GET /v1/weapons/{id or slug}`     |
| Echoes     | `GET /v1/echoes`      | `GET /v1/echoes/{id or slug}`      |
| Echo sets  | `GET /v1/echoes/sets` | `GET /v1/echoes/sets/{id or slug}` |
