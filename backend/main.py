from fastapi import FastAPI

from backend.api import auth

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])


@app.get("/health")
def status():
    return {"status": "ok"}
