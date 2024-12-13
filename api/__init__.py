from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
from api.routes.agents import router as agents_router
from api.routes.assessment import router as assessment_router

app.include_router(agents_router, prefix=settings.API_V1_STR)
app.include_router(assessment_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Delilah Agentic API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
