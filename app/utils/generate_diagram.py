import ast


from app.utils.ast_utils import modify_diagram
from app.utils.sandbox import run_sandboxed_code


def generate_diagram(definition: str = None):
    modified_code = definition.replace("):", ") as diagram:\n")
    tree = ast.parse(modified_code)
    modified_diagram = modify_diagram(tree)
    diagram_svg = run_sandboxed_code(modified_diagram)
    return diagram_svg
