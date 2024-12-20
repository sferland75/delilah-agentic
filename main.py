from fastapi import FastAPI
from api.routes import agent

<<<<<<< HEAD
app = FastAPI()
app.include_router(agent.router)
=======
app = FastAPI(
    title="Delilah Agentic",
    description="API for managing intelligent agents",
    version="0.1.0"
)

app.include_router(agent.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Delilah Agentic API"}
>>>>>>> 6bb53329c68f8c4735e833d296a7da5546e63a5d
