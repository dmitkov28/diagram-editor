import jedi

exclusions = {"fastapi"}


def get_completions(src: str, line: int, character: int):
    script = jedi.Script(src)
    completions = script.complete(line, character)
    return {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "completions": [
                {"label": completion.name, "insertText": completion.name, "kind": completion.type}
                for completion in completions
                if completion.name not in exclusions
            ]
        },
    }
