
from dotenv import load_dotenv
from sqlalchemy import text

load_dotenv()

from fastapi import FastAPI

from database import Base, engine
from routes import admin


app = FastAPI(title="FixEasy Ireland API")

try:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
        print("✅ Connected to Supabase PostgreSQL successfully.")
except Exception as e:
    print("❌ Database connection failed:", e)

Base.metadata.create_all(bind=engine)

app.include_router(admin.router)


@app.get("/")
async def root():
    return {"message": "Welcome to FixEasy Ireland API! Backend is live 🚀"}
