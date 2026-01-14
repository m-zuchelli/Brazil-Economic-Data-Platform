FROM python:3.11-slim

WORKDIR /app/backend

RUN pip install poetry

COPY pyproject.toml /app/backend/pyproject.toml

RUN poetry config virtualenvs.create false
RUN poetry install --no-root

COPY . /app/backend

ENV PYTHONPATH=/app/backend

CMD ["sh", "-c", "poetry run python -m app.etl.run && poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000"]
