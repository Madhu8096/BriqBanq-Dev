import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi import routing
from app.main import app

with open("routes_utf8.txt", "w", encoding="utf-8") as f:
    for route in app.routes:
        if isinstance(route, routing.APIRoute):
            methods = ", ".join(route.methods - {"OPTIONS"})
            path = route.path
            name = route.name
            f.write(f"{methods} | {path} | | {name}\n")
