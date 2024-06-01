FROM python:3.10-slim

RUN pip install diagrams jedi-language-server  pygls[ws]

EXPOSE 9000

ENTRYPOINT ["jedi-language-server", "--ws", "--host", "0.0.0.0", "--port", "9000"]
