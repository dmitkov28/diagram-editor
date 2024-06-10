import ast
import astor


class WithStatementVisitor(ast.NodeVisitor):
    def __init__(self) -> None:
        super().__init__()
        self.args = []
        self.kwargs = {}

    def visit_With(self, node):
        for item in node.items:
            if (
                isinstance(item.context_expr, ast.Call)
                and item.context_expr.func.id == "Diagram"
            ):
                self.modify_args(item.context_expr)

        self.generic_visit(node)

    def modify_args(self, node):
        # new_arg = ast.Constant(value="file")
        # node.args = [new_arg]
        kwargs = [
            ast.keyword(arg="filename", value=ast.Constant(value="static/file")),
            ast.keyword(arg="outformat", value=ast.Constant(value="svg")),
            ast.keyword(arg="show", value=ast.Constant(value=False)),
        ]
        node.keywords = kwargs


def modify_diagram_args(source_code: str) -> str:
    tree = ast.parse(source_code)
    visitor = WithStatementVisitor()
    visitor.visit(tree)
    return astor.to_source(tree)
