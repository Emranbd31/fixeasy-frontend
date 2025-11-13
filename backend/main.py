from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import admin


app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fixeasy.irish",
        "https://www.fixeasy.irish",
        "https://admin.fixeasy.irish",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router, prefix="/admin")


@app.get("/status")
def status() -> dict[str, str]:
    """Simple status endpoint for health checks."""
    return {"message": "Backend active ✅"}
