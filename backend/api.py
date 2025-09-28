from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import sys
import os

# Import the job application function using importlib
import importlib.util
current_dir = os.path.dirname(os.path.abspath(__file__))
module_path = os.path.join(current_dir, 'job-applicants', 'rochester_regional_health.py')

spec = importlib.util.spec_from_file_location("rochester_regional_health", module_path)
rochester_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rochester_module)

apply_to_rochester_regional_health = rochester_module.apply_to_rochester_regional_health
from browser_use import ChatOpenAI
import json

app = FastAPI(title="Job Application API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "*"],  # Allow frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

class JobApplicationRequest(BaseModel):
    """Request model for job application endpoint"""
    applicant_info: Dict[str, Any]
    resume_path: str
    llm_model: Optional[str] = "gpt-4o-mini"

class JobApplicationResponse(BaseModel):
    """Response model for job application endpoint"""
    success: bool
    message: str
    result: Optional[Any] = None

@app.post("/apply/rochester-regional-health", response_model=JobApplicationResponse)
async def apply_rochester(request: JobApplicationRequest):
    """
    Submit a job application to Rochester Regional Health.

    Args:
        request: JobApplicationRequest containing applicant info and resume path

    Returns:
        JobApplicationResponse with success status and results
    """
    try:
        # Initialize the LLM
        llm = ChatOpenAI(model=request.llm_model)

        # Call the application function
        result = await apply_to_rochester_regional_health(
            info=request.applicant_info,
            llm=llm,
            resume_path=request.resume_path
        )

        return JobApplicationResponse(
            success=True,
            message="Application submitted successfully",
            result=result
        )

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=f"Resume file not found: {str(e)}")
    except Exception as e:
        return JobApplicationResponse(
            success=False,
            message=f"Application failed: {str(e)}",
            result=None
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Job Application API"}

@app.post("/apply/rochester-regional-health/test", response_model=JobApplicationResponse)
async def apply_rochester_test():
    """
    Test endpoint that uses mock data from test_data.json and test_CV.pdf
    """
    try:
        # Load mock data
        mock_data_path = os.path.join(current_dir, 'mock', 'test_data.json')
        resume_path = os.path.join(current_dir, 'mock', 'test_CV.pdf')

        with open(mock_data_path, 'r') as f:
            mock_info = json.load(f)

        # Initialize the LLM
        llm = ChatOpenAI(model="gpt-4.1-mini")

        # Call the application function with mock data
        result = await apply_to_rochester_regional_health(
            info=mock_info,
            llm=llm,
            resume_path=resume_path
        )

        return JobApplicationResponse(
            success=True,
            message="Test application submitted successfully using mock data",
            result=result
        )

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=f"Mock file not found: {str(e)}")
    except Exception as e:
        return JobApplicationResponse(
            success=False,
            message=f"Test application failed: {str(e)}",
            result=None
        )

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "Job Application API",
        "version": "1.0.0",
        "endpoints": {
            "POST /apply/rochester-regional-health": "Submit job application to Rochester Regional Health",
            "POST /apply/rochester-regional-health/test": "Test endpoint using mock data (no parameters needed)",
            "GET /health": "Health check",
            "GET /docs": "Interactive API documentation"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)