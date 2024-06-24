import jedi

exclusions = {
    "annotated-types",
    "anyio",
    "astor",
    "attrs",
    "cattrs",
    "certifi",
    "click",
    "dnspython",
    "docstring-to-markdown",
    "email_validator",
    "exceptiongroup",
    "fastapi",
    "fastapi-cli",
    "graphviz",
    "h11",
    "httpcore",
    "httptools",
    "httpx",
    "idna",
    "jedi",
    "jedi-language-server",
    "Jinja2",
    "lsprotocol",
    "markdown-it-py",
    "MarkupSafe",
    "mdurl",
    "orjson",
    "parso",
    "pip",
    "pluggy",
    "pydantic",
    "pydantic_core",
    "pygls",
    "Pygments",
    "python-dotenv",
    "python-jsonrpc-server",
    "python-language-server",
    "python-multipart",
    "PyYAML",
    "RestrictedPython",
    "rich",
    "setuptools",
    "shellingham",
    "sniffio",
    "starlette",
    "typed-ast",
    "typer",
    "typing_extensions",
    "ujson",
    "uvicorn",
    "uvloop",
    "watchfiles",
    "websockets",
    "wheel",
}


def get_completions(src: str, line: int, character: int):
    script = jedi.Script(src)
    completions = script.complete(line, character)
    return {
        "jsonrpc": "2.0",
        "id": 1,
        "result": {
            "completions": [
                {
                    "label": completion.name,
                    "insertText": completion.name,
                    "kind": completion.type,
                }
                for completion in completions
                if completion.name not in exclusions
            ]
        },
    }
