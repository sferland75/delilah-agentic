from fastapi import FastAPI
from api.routes import agent

app = FastAPI()
app.include_router(agent.router)