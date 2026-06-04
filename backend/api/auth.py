from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.api.deps import current_user, database_session
from backend.models.user import User
from backend.schemas.user import LoginRequest, TokenResponse, UserCreate, UserRead
from backend.services.auth import authenticate_user, register_user

router = APIRouter()


@router.post("/register", response_model=UserRead, status_code=201)
def register(body: UserCreate, db: Session = Depends(database_session)):
    try:
        user = register_user(db, body)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

    return user


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(database_session)):
    try:
        token = authenticate_user(db, body)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

    return token


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(current_user)):
    return user
