from flask import Flask, jsonify, redirect, request, render_template
from flask_cors import CORS
from .data import (
    load_characters, load_weapons, load_echoes,
    load_echo_sets, link_echo_sets_with_member_ids
)
from datetime import datetime
from werkzeug.middleware.proxy_fix import ProxyFix

def create_app():
    app = Flask(__name__,template_folder="templates",
                static_folder="static")
    app.url_map.strict_slashes = False
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1, x_prefix=1)
    app.config["PREFERRED_URL_SCHEME"] = "https"
    CORS(app)

    # Load all data at startup
    char_by_id, char_by_element,char_by_rarity = load_characters()
    weapons, weapon_by_id, weapon_by_type, weapon_by_rarity = load_weapons()
    echoes, echo_by_cost, echo_by_echosets = load_echoes()
    echo_sets, echo_set_by_id = load_echo_sets()
    link_echo_sets_with_member_ids(echo_sets, echo_by_echosets)

    # Load data into app, globalize data for all routes.
    app.config["DATA"] = {
        "char_by_id": char_by_id,
        "char_by_element": char_by_element,
        "char_by_rarity": char_by_rarity,

        "weapons": weapons,
        "weapon_by_id": weapon_by_id,
        "weapon_by_type": weapon_by_type,
        "weapon_by_rarity": weapon_by_rarity,

        "echoes": echoes,
        "echo_by_cost": echo_by_cost,
        "echo_by_echosets": echo_by_echosets,

        "echo_sets": echo_sets,
        "echo_set_by_id": echo_set_by_id,
    }

    # Normalize API 
    @app.before_request
    def normalize_path():
        path = request.path
        lower = path.lower()
        if path != lower:
            qs = request.query_string.decode()
            target = lower + (f"?{qs}" if qs else "")
            return redirect(target, code=301)

    @app.get("/")
    def docs():
        api_index = {
            "characters": "/v1/characters",
            "weapons": "/v1/weapons",
            "echoes": "/v1/echoes",
            "echo sets": "/v1/echoes/sets",
        }
        return render_template(
            "index.html",
            api_index=api_index,
            project_name="WUWA API",
            version="v1",
            owner="Alex",
            repo_url="https://github.com/juanweih0424/wuwa_db/",
            base_url=request.host_url.rstrip("/"),
            current_year=datetime.utcnow().year,
        )
            
    @app.get("/v1")
    def v1_index():
        return {
            "ok": True,
            "endpoints": [
                "/v1/characters", "/v1/characters/<id>",
                "/v1/weapons",    "/v1/weapons/<id>",
                "/v1/echoes",     "/v1/echoes/<id>",
                "/v1/echoes/sets","/v1/echoes/sets/<id>",
            ]
        }

    # Custom error handler for front-end apps
    from werkzeug.exceptions import HTTPException
    @app.errorhandler(HTTPException)
    def handle_http(e):
        return jsonify({"error": e.name, "status": e.code, "detail": e.description}), e.code

    # Register routes
    from .routes.characters import bp as characters_bp
    from .routes.weapons import bp as weapons_bp
    from .routes.echos import bp as echoes_bp
    app.register_blueprint(characters_bp, url_prefix="/v1/characters")
    app.register_blueprint(weapons_bp,    url_prefix="/v1/weapons")
    app.register_blueprint(echoes_bp,     url_prefix="/v1/echoes")

    return app