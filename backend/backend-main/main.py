
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from datetime import datetime, timedelta
try:
    import jwt  # PyJWT
except ImportError:
    jwt = None

app = FastAPI()


class AdminLoginRequest(BaseModel):
    email: str
    password: str


def _issue_jwt(email: str) -> str:
    secret = os.getenv("JWT_SECRET") or os.getenv("JWT_SECRET_KEY")
    if not secret:
        # Developer-friendly error with 500 so we know to set JWT_SECRET
        raise HTTPException(status_code=500, detail="JWT secret not configured")
    payload = {
        "sub": email,
        "role": "admin",
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow(),
    }
    if not jwt:
        raise HTTPException(status_code=500, detail="PyJWT not installed")
    return jwt.encode(payload, secret, algorithm="HS256")


@app.post("/admin/login")
def admin_login(body: AdminLoginRequest):
    ADMIN_USER = os.getenv("ADMIN_USER")
    ADMIN_PASS = os.getenv("ADMIN_PASS")
    if not ADMIN_USER or not ADMIN_PASS:
        raise HTTPException(status_code=500, detail="ADMIN_USER/ADMIN_PASS not configured")

    if body.email == ADMIN_USER and body.password == ADMIN_PASS:
        token = _issue_jwt(body.email)
        return {"token": token, "user": {"email": body.email}}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/")
def root():
    return {"message": "Welcome to FixEasy Ireland API! Backend is live 🚀"}
