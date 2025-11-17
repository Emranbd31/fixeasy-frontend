from fastapi import FastAPI
import logging

# On startup, run migrations and seed admin to ensure the sqlite DB is present
import run_migrations
import seed_admin

from database import Base, engine
from routes import admin, auth, bookings, professionals, payments, health

logger = logging.getLogger("fixeasy")

app = FastAPI(title="FixEasy Ireland API")


def ensure_tables_and_seed():
    try:
        # Non-destructive: create any missing tables
        run_migrations.main()
    except Exception as e:
        logger.warning("Could not run migrations at startup: %s", e)
    try:
        # seed_admin imports will execute seeding logic (idempotent)
        # seed_admin module runs on import, so nothing further required here
        pass
    except Exception as e:
        logger.warning("Could not seed admin at startup: %s", e)


# Always ensure tables and seed admin on startup (as requested)
ensure_tables_and_seed()

app.include_router(admin.router)
app.include_router(auth.router)
app.include_router(bookings.router)
app.include_router(professionals.router)
app.include_router(payments.router)
app.include_router(health.router)


@app.get("/")
def root():
    return {"message": "Welcome to FixEasy Ireland API! Backend is live 🚀"}
