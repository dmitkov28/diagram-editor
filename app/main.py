import json
import os
import site

from fastapi import FastAPI, Request, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.utils import generate_completions
from app.utils.generate_diagram import generate_diagram
from app.utils.sandbox import UnsafeCodeException

origins = ["*"]


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
)
site_packages = site.getsitepackages()[0]
templates = Jinja2Templates(directory="templates")
app.mount("/logos", StaticFiles(directory=site_packages), name="staticz")
app.mount("/static", StaticFiles(directory="./static"), name="static")

@app.get("/")
async def main(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        try:
            f = generate_diagram(json.loads(data))
            await websocket.send_text(f)
        except UnsafeCodeException as e:
            await websocket.send_text(str(e))
        except Exception as e:
            print(e)
            pass


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
