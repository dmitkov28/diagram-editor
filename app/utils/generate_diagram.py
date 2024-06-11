import ast
import os
import site

from app.utils.ast_utils import modify_diagram_args


def generate_diagram(definition: str = None):
    tree = ast.parse(definition)
    modified_diagram = modify_diagram_args(tree)
    exec(modified_diagram)

    with open("static/file.svg", "r") as f:
        svg = f.read().replace(site.getsitepackages()[0], "/logos")
        os.remove("static/file.svg")
    return svg
