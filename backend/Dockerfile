ARG PYTHON_VERSION=3.11

FROM python:${PYTHON_VERSION}-alpine

WORKDIR fitness/

COPY ./pyproject.toml ./pyproject.toml

ARG POETRY_VERSION=1.8.3

RUN apk add --no-cache \
        build-base \
        gcc \
        musl-dev \
        libffi \
        libffi-dev \
        python3-dev \
        iputils-ping \
        pipx && \
    pipx install poetry==${POETRY_VERSION} --pip-args="--no-cache-dir" && \
    export PATH="/root/.local/bin:$PATH" && \
    pipx run poetry install && \
    apk del build-base gcc musl-dev libffi-dev python3-dev

COPY . .

CMD ["pipx", "run", "poetry", "run", "uvicorn", "fitness.main:app", "--host" , "0.0.0.0", "--port", "8000"]
