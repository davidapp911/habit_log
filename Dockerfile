FROM python:3.12-slim

WORKDIR /app
COPY pyproject.toml .
RUN pip install .

COPY backend/ backend/
COPY alembic/ alembic/
COPY alembic.ini .

CMD alembic upgrade head && uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}