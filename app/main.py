import json
import site

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from app.utils import generate_completions
from app.utils.generate_diagram import generate_diagram


origins = ["*"]


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
)
site_packages = site.getsitepackages()[0]
app.mount("/logos", StaticFiles(directory=site_packages), name="staticz")
app.mount("/static", StaticFiles(directory="./static"), name="static")


@app.get("/")
async def main():
    return FileResponse("index.html")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        try:
            f = generate_diagram(json.loads(data))
            await websocket.send_text(f)
        except Exception:
            await websocket.send_text("")


@app.websocket("/completions")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        json_data = json.loads(data)
        params = json_data["params"]
        text = params.get("textDocument").get("text")
        if text:
            line, character = params["position"].values()
        try:
            completions = generate_completions.get_completions(text, line, character)
            await websocket.send_text(json.dumps(completions))
        except Exception as e:
            print(e)
            await websocket.send_text("")
