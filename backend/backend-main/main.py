
from dotenv import load_dotenv
from sqlalchemy import text

load_dotenv()
from utils.config import get_settings

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import admin as admin_router
from routers import admin_login as admin_login_router
from routers import admin_professionals as admin_professionals_router
from routers import admin_summary as admin_summary_router


app = FastAPI(title="FixEasy Ireland API")

origins = [
    "https://fixeasy.irish",
    "https://www.fixeasy.irish",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

settings = get_settings()
if settings.demo_mode:
    print("ℹ️  DEMO mode enabled — skipping DB connectivity checks and Supabase calls")
else:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            print("✅ Connected to Supabase PostgreSQL successfully.")
    except Exception as e:
        print("❌ Database connection failed:", e)

Base.metadata.create_all(bind=engine)

app.include_router(admin_login_router.router)
app.include_router(admin_router.router)
app.include_router(admin_professionals_router.router)
app.include_router(admin_summary_router.router)


@app.get("/")
async def root():
    return {"message": "Welcome to FixEasy Ireland API! Backend is live 🚀"}
