from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_assessment_flows():
    return {"message": "Assessment flow management endpoint"}
