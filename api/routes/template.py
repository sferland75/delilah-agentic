from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_templates():
    return {"message": "Template management endpoint"}
