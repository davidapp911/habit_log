import datetime

from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    email: str
    username: str
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    username: str
    created_at: datetime.datetime


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
