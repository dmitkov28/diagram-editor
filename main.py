import site

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from generate_diagram import generate_diagram

origins = ["*"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
)
site_packages = site.getsitepackages()[0]
app.mount(site_packages, StaticFiles(directory=site_packages), name="static")


class Code(BaseModel):
    code: str


@app.get("/")
async def main():
    return FileResponse("index.html")


@app.post("/endpoint")
async def main(code: Code):
    try:
        f = generate_diagram(code.code)
        return HTMLResponse(f)
    except Exception:
        return HTMLResponse(
            "<p style='text-align: center; padding: 10px'>Oops. Something went wrong. Check your code and try again.</p>"
        )
