from fastapi import FastAPI
from api.routes import agent

app = FastAPI(
    title="Delilah Agentic",
    description="API for managing intelligent agents",
    version="0.1.0"
)

app.include_router(agent.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Delilah Agentic API"}
