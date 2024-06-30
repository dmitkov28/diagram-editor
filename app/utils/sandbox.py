import builtins
import site

import diagrams
from diagrams import Diagram
from RestrictedPython import compile_restricted
from RestrictedPython.Guards import safe_builtins


def restricted_import(name, globals=None, locals=None, fromlist=(), level=0):
    allowed_prefixes = ["diagrams"]
    if any(name.startswith(prefix) for prefix in allowed_prefixes):
        return builtins.__import__(name, globals, locals, fromlist, level)
    raise UnsafeCodeException(
        f"Module '{name}' is not allowed in the restricted environment."
    )


safe_builtins["__import__"] = restricted_import
safe_globals = {"__builtins__": safe_builtins, "diagrams": diagrams}


def run_sandboxed_code(code: str):

    class CustomDiagram(Diagram):
        """Overrides the default behavior of the Diagram class context manager"""

        def __exit__(self, exc_type, exc_value, traceback):
            pass

    byte_code = compile_restricted(code, filename="<inline code>", mode="exec")
    namespace = {"CustomDiagram": CustomDiagram}
    exec(byte_code, safe_globals, namespace)
    diagram = namespace.get("diagram")

    if diagram:
        svg = diagram.dot._repr_image_svg_xml().replace(
            site.getsitepackages()[0], "/logos"
        )
        return svg
    return ""


class UnsafeCodeException(Exception):
    pass
