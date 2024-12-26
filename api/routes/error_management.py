from fastapi import APIRouter

# Error reporter mock
class ErrorReporter:
    def setup_default_alerts(self):
        print("Setting up default error alerts")

error_reporter = ErrorReporter()

router = APIRouter()

@router.get("/")
async def list_errors():
    return {"message": "Error management endpoint"}
