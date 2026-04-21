# Update to include data and gamify routers
from .routes import router as api_router
from .ws_routes_optimized import router as ws_router
from .data_routes import router as data_router
from .gamify_routes import router as gamify_router

__all__ = ["api_router", "ws_router", "data_router", "gamify_router"]