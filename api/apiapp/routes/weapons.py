from flask import Blueprint, jsonify, request, abort, current_app

bp = Blueprint("weapons", __name__)

@bp.get("/")
def list_weapons():
    """
    GET /v1/weapons
      Optional filters:
        - ?type=gauntlet|sword|pistol|rectifier|broadblade|sniper
        - ?rarity=5/4/3  (integer)
        - ?q=justice (substring match on name, case-insensitive)
    Returns: raw list of weapon dicts
    """
    data = current_app.config["DATA"]

    # start from full list
    items = data["weapons"]

    # filters
    wtype  = (request.args.get("type") or "").strip()
    rarity = request.args.get("rarity", type=int)
    q      = (request.args.get("q") or "").strip().lower()

    # use indexes when available for speed
    if wtype:
        items = data["weapon_by_type"].get(wtype, [])
    if rarity is not None:
        items = [w for w in items if w.get("rarity") == rarity]
    if q:
        items = [w for w in items if q in str(w.get("name", "")).lower()]

    return jsonify(items)

@bp.get("/<int:wid>")
def get_weapon(wid: int):
    """
    GET /v1/weapons/<id>
    Returns: full weapon object or 404.
    """
    w = current_app.config["DATA"]["weapon_by_id"].get(wid)
    if not w:
        abort(404, "weapon not found")
    return jsonify(w)