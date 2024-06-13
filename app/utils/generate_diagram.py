import ast
import os
import site

from app.utils.ast_utils import modify_diagram_args
from app.utils.sandbox import run_sandboxed_code


def generate_diagram(definition: str = None):
    tree = ast.parse(definition)
    modified_diagram = modify_diagram_args(tree)
    run_sandboxed_code(modified_diagram)
    
    if os.path.exists("static/file.svg"):
        with open("static/file.svg", "r") as f:
            svg = f.read().replace(site.getsitepackages()[0], "/logos")
            os.remove("static/file.svg")
        return svg
    return ""