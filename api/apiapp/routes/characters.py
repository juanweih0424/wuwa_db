from flask import Blueprint, jsonify, request, abort, current_app

bp = Blueprint("characters", __name__)

@bp.get("/")
def list_characters():
    """
    GET /v1/characters
      Optional filters:
        - ?element=Spectro|Glacio|Fusion|Electro|Aero|Havoc
        - ?rarity=5/4  (integer)
    Return: raw list of character dicts
    """
    data = current_app.config["DATA"]
    element = (request.args.get("element") or "").strip().lower()
    rarity  = request.args.get("rarity", type=int)

    if element:
        items = data["char_by_element"].get(element, [])
    else:
        items = list(data["char_by_id"].values())

    if rarity is not None:
        if not element:
            items = data["char_by_rarity"].get(rarity, [])
        else:
            items = [c for c in items if c.get("rarity") == rarity]

    return jsonify(items)

@bp.get("/<int:cid>")
def get_character(cid: int):
    c = current_app.config["DATA"]["char_by_id"].get(cid)
    if not c:
        abort(404, "character not found")
    return jsonify(c)