from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from pathlib import Path
import json

BASE = Path(__file__).resolve().parent  # api/ directory
CHAR_DIR = BASE / "characters"  # api/characters
WEAPON_DIR = BASE / "weapons"   # api/weapons

# Open .json files and read it as text
def load_json(p:Path) -> str:
    return json.loads(p.read_text(encoding="utf-8"))

# Load all data at startup
CHARACTERS = [load_json(p) for p in CHAR_DIR.glob("*.json")] # Character is always one character / one file, do not need to wrap it up
WEAPONS = []
for w in WEAPON_DIR.glob("*.json"):
    data = load_json(w)
    WEAPONS.extend(data if isinstance(data,list) else [data]) # Wrap up single objects else extend the object since it is a list already

# Change data structure to list in order to avoid O(n), now it is O(1) for look ups
CHAR_BY_ID = {c.get("character_id") or c.get("id"): c for c in CHARACTERS}
WEAPON_BY_ID = {w.get("id"): w for w in WEAPONS}


app = Flask(__name__)
# CORS to enable access from other domains
CORS(app)

# Version 1
@app.get("/v1")
def root():
    return {
        "ok": True,
        "endpoints": [
            "/v1/characters",
            "/v1/characters/<id>",
            "/v1/weapons",
            "/v1/weapons/<id>"
        ]
    }

# Characters route
@app.get("/v1/characters")
def list_characters():
    name = request.args.get("name")
    if name:
        for c in CHARACTERS:
            if c.get("name","").lower() == name.lower():
                return jsonify(c)
        abort(404, "character not found")
    return jsonify([
        {"character_id": c.get("character_id"), "name": c.get("name"), "element": c.get("element")}
        for c in CHARACTERS
    ])

@app.get("/v1/characters/<int:cid>")
def get_character(cid: int):
    c = CHAR_BY_ID.get(cid)
    if not c:
        abort(404, "character not found")
    return jsonify(c)


# Weapons route
@app.get("/v1/weapons")
def list_weapons():
    wtype = request.args.get("type")
    name  = request.args.get("name")
    items = WEAPONS
    if wtype:
        items = [w for w in items if str(w.get("type","")).lower() == wtype.lower()]
    if name:
        items = [w for w in items if str(w.get("name","")).lower() == name.lower()]
    return jsonify([
        {"id": w.get("id"), "name": w.get("name"), "rarity": w.get("rarity"), "type": w.get("type")}
        for w in items
    ])

@app.get("/v1/weapons/<int:wid>")
def get_weapon(wid: int):
    w = WEAPON_BY_ID.get(wid)
    if not w:
        abort(404, "weapon not found")
    return jsonify(w)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)