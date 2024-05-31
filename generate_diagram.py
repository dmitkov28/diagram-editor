import ast
import os

from utils import modify_diagram_args


def generate_diagram(definition: str = None):
    tree = ast.parse(definition)
    modify_diagram_args(tree)
    exec(ast.unparse(tree))

    with open("static/file.svg", "r") as f:
        svg = f.read()
        os.remove("static/file.svg")
    return svg
