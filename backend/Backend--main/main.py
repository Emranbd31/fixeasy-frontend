from fastapi import FastAPI
from routes import admin

app = FastAPI(title="FixEasy Ireland API")

app.include_router(admin.router)


@app.get("/")
def root():
    return {"message": "Welcome to FixEasy Ireland API! Backend is live ✅"}
