from flask import Blueprint, jsonify, request, abort, current_app

bp = Blueprint("echoes", __name__)

@bp.get("/")
def list_echoes():
    """
    GET /v1/characters
      Optional filters:
        - ?cost=1/3/4
        - ?set=1000-1017  (integer)
    Return: raw list of echo dicts
    """
    data = current_app.config["DATA"]
    items = data["echoes"]

    cost   = request.args.get("cost", type=int)
    set_id = request.args.get("set",  type=int)

    if cost is not None:
        items = data["echo_by_cost"].get(cost, [])
    if set_id is not None:
        items = data["echo_by_echosets"].get(set_id, [])

    return jsonify([
        {"id": e["id"], "name": e.get("name"), "cost": e.get("cost"), "class": e.get("class")}
        for e in items
    ])

@bp.get("/<int:eid>")
def get_echo(eid: int):
    for e in current_app.config["DATA"]["echoes"]:
        if e["id"] == eid:
            return jsonify(e)
    abort(404, "echo not found")


@bp.get("/sets")
def list_echo_sets():
    sets_ = current_app.config["DATA"]["echo_sets"]
    return jsonify([
        {"id": s["id"], "name": s.get("name"), "effect": s.get("effect"), "members": s.get("members", [])}
        for s in sets_
    ])

@bp.get("/sets/<int:sid>")
def get_echo_set(sid: int):
    s = current_app.config["DATA"]["echo_set_by_id"].get(sid)
    if not s:
        abort(404, "echo_set not found")
    return jsonify({"id": s["id"], "name": s.get("name"), "effect": s.get("effect"), "members": s.get("members", [])})
