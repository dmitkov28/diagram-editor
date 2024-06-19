FROM python:3.10-slim

RUN apt-get update && apt-get install -y graphviz

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app
EXPOSE 8000

COPY app ./app

WORKDIR /app/app

RUN pip install pipenv && pipenv install

ENTRYPOINT ["pipenv", "run", "fastapi", "run"]

