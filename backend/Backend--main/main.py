from fastapi import FastAPI
import os
import logging
from database import Base, engine
from routes import admin, auth, bookings, professionals, payments, health

logger = logging.getLogger("fixeasy")

app = FastAPI(title="FixEasy Ireland API")


def try_create_tables():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        logger.warning("Could not create DB tables at startup: %s", e)


# Only attempt to create tables during non-production runs; failures are non-fatal
if os.getenv("BACKEND_ENV", "prod") != "prod":
    try_create_tables()

app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(bookings.router)
app.include_router(professionals.router)
app.include_router(payments.router)
app.include_router(health.router)


@app.get("/")
def root():
    return {"message": "Welcome to FixEasy Ireland API! Backend is live 🚀"}
