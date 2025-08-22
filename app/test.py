from flask import Flask, jsonify, render_template_string
import os
import requests

app = Flask(__name__)

RENDER_BASE_URL = os.getenv("RENDER_BASE_URL", "https://wuwa-db-v1.onrender.com")

TEMPLATE = """
<!doctype html>
<title>WuWa API Tester</title>
<h1>WuWa API Tester</h1>
<p>Base: {{ base }}</p>
<ul>
  <li><a href="/test/v1">/test/v1</a> – health & endpoints</li>
  <li><a href="/test/weapons">/test/weapons</a> – list weapons (summary)</li>
  <li><a href="/test/weapons/200">/test/weapons/200</a> – weapon 200 detail</li>
  <li><a href="/test/characters">/test/characters</a> – list characters (summary)</li>
  <li><a href="/test/characters/1">/test/characters/1</a> – character 1 detail</li>
</ul>
"""

@app.get("/")
def home():
    return render_template_string(TEMPLATE, base=RENDER_BASE_URL)

@app.get("/test/v1")
def test_v1():
    r = requests.get(f"{RENDER_BASE_URL}/v1", timeout=20)
    return jsonify(r.json()), r.status_code

@app.get("/test/weapons")
def test_weapons():
    r = requests.get(f"{RENDER_BASE_URL}/v1/weapons", timeout=20)
    return jsonify(r.json()), r.status_code

@app.get("/test/weapons/<int:wid>")
def test_weapon_detail(wid: int):
    r = requests.get(f"{RENDER_BASE_URL}/v1/weapons/{wid}", timeout=20)
    return jsonify(r.json()), r.status_code

@app.get("/test/characters")
def test_characters():
    r = requests.get(f"{RENDER_BASE_URL}/v1/characters", timeout=20)
    return jsonify(r.json()), r.status_code

@app.get("/test/characters/<int:cid>")
def test_character_detail(cid: int):
    r = requests.get(f"{RENDER_BASE_URL}/v1/characters/{cid}", timeout=20)
    return jsonify(r.json()), r.status_code

if __name__ == "__main__":
    # Local dev server for the tester app
    app.run(host="0.0.0.0", port=5050, debug=True)