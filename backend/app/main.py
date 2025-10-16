from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import auth, legal, pro

app = FastAPI(title="FixEasy API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"]
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(legal.router, prefix="/legal", tags=["legal"])
app.include_router(pro.router, prefix="/pro", tags=["professionals"])


@app.get("/healthz", tags=["health"])
async def healthcheck():
    return {"ok": True}
