from pathlib import Path
import json
from collections import defaultdict
from pprint import pprint # for debug and evaluate output


BASE = Path(__file__).resolve().parent.parent  # api/ folder

# Subfolders for json files
CHAR_DIR = BASE / "characters"
WEAPON_DIR = BASE / "weapons"
ECHO_DIR = BASE / "echos"


# Helper function to load json files
def read_json(p:Path):
    return json.loads(p.read_text(encoding='utf-8'))

# Load character file, one character per file
def load_characters():
    """
    Load all JSON files in /characters
    Returns:
      - by_id: {id: character}
      - by_element: {lower_element: [characters]}
      - by_rarity: {rarity_int: [characters]}
    """
    by_id = {}
    by_element = defaultdict(list)
    by_rarity = defaultdict(list)

    for p in CHAR_DIR.glob("*.json"):
        c = read_json(p)
        c["id"] = c.get("id") or c.get("character_id")
        by_id[c["id"]] = c

        el = str(c.get("element", "")).strip().lower()
        if el:
            by_element[el].append(c)

        r = c.get("rarity")
        if isinstance(r, int):
            by_rarity[r].append(c)

    return by_id, dict(by_element), dict(by_rarity)

# Load weapons_*.json, one type per file e.g: weapons_broadblade.json
def load_weapons():
    """
    Load all JSON files in /weapons.
    A file may contain a list of weapon objects.
    Returns: (weapons_list, by_id, by_type, by_rarity)
    Usage: weapons, weapon_by_id, weapon_by_type, weapon_by_rarity = load_weapons()
    """
    items = []
    for p in WEAPON_DIR.glob("*.json"):
        data = read_json(p)    
        items.extend(data)

    by_id = {w["id"]: w for w in items}
    by_type = defaultdict(list)
    by_rarity = defaultdict(list)

    for w in items:
        by_type[w["type"]].append(w)
        by_rarity[w["rarity"]].append(w)

    return items, by_id, dict(by_type), dict(by_rarity) 
    
def load_echoes():
    """
    Load echoes.json.
    Returns: (echoes, echo_by_cost, echo_by_echosets)
    Usage: echoes, echo_by_cost, echo_by_echosets = load_echoes()
    """
    path = ECHO_DIR / "echo.json"
    echoes = read_json(path)  

    by_cost = defaultdict(list)
    for e in echoes:
        by_cost[e["cost"]].append(e)

    by_echosets = defaultdict(list)
    for e in echoes:
        for set_id in e.get("echo_sets", []):
            by_echosets[set_id].append(e)

    return echoes, dict(by_cost), dict(by_echosets)

def load_echo_sets():
    """
    Load echoset.json (list of echo-set dicts).
    Returns: (echo_sets, by_id)
    Usage: echo_sets, echo_sets_by_id = load_echo_sets()
    """
    path = ECHO_DIR / "echoset.json"
    echo_sets = read_json(path)  
    by_id = {s["id"]: s for s in echo_sets}
    return echo_sets, by_id

def link_echo_sets_with_member_ids(echo_sets, echo_by_echosets):
    """
    Mutates each echo set to include: members = [echo_id, ...]
    Returns the same list for convenience.
    """
    for s in echo_sets:
        sid = s["id"]
        s["members"] = [e["id"] for e in echo_by_echosets.get(sid, [])]
    return echo_sets

