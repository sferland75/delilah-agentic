from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_agents():
    return {"message": "Agent management endpoint"}
