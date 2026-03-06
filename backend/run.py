import uvicorn
import sys
import os

# Add the backend directory and project root to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(backend_dir)
sys.path.insert(0, backend_dir)
sys.path.insert(0, project_root)

from app.core.main import app

if __name__ == "__main__":
    uvicorn.run(
        "app.core.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
