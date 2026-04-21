import uvicorn
import sys
import os
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
backend_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(backend_dir, ".env")
load_dotenv(env_path)

# Configure logging to output to terminal
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)

# Add the backend directory and project root to Python path
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
