import builtins

from RestrictedPython import compile_restricted
from RestrictedPython.Guards import safe_builtins

import diagrams


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
    byte_code = compile_restricted(code, filename="<inline code>", mode="exec")
    exec(byte_code, safe_globals)

class UnsafeCodeException(Exception):
    pass
