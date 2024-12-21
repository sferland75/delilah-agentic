from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID, uuid4
import asyncio
from coordinator import AgentCoordinator
from typing import List

app = FastAPI()

class ClientSearch(BaseModel):
    query: str

class Client(BaseModel):
    id: str
    name: str
    email: str
    status: str

@app.get('/')
def read_root():
    return {'message': 'Delilah Agentic API is running'}

@app.get('/clients', response_model=List[Client])
async def get_clients():
    # For testing, return some sample data
    return [
        {
            "id": str(uuid4()),
            "name": "John Doe",
            "email": "john@example.com",
            "status": "Active"
        },
        {
            "id": str(uuid4()),
            "name": "Jane Smith",
            "email": "jane@example.com",
            "status": "Active"
        }
    ]

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)