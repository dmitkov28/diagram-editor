import ast

import astor


class DiagramTransformer(ast.NodeTransformer):
    """Changes the Diagram class to CustomDiagram to prevent unnecessary writes to disk"""

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name) and node.func.id == "Diagram":
            node.func.id = "CustomDiagram"
        return node


def modify_diagram(source_code: ast.Module) -> str:
    tree = ast.parse(source_code)
    transformer = DiagramTransformer()
    transformed_tree = transformer.visit(tree)
    return astor.to_source(transformed_tree)
