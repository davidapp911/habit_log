from collections.abc import Generator

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from backend.core.security import decode_token
from backend.db.base import SessionLocal
from backend.models.user import User

bearer_scheme = HTTPBearer()


def database_session() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db=Depends(database_session),
) -> User:
    token = credentials.credentials

    try:
        payload = decode_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

    user = db.get(User, int(payload["sub"]))

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )

    return user
