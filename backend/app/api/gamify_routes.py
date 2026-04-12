from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.core.config import get_settings, load_features

router = APIRouter()

settings = get_settings()
features = load_features(settings.features_file)

# Simple in-memory gamification (in production, use DB)
gamify_data = {
    "users": {
        "user1": {"points": 1240, "badges": ["first_detection", "explorer"]},
        "user2": {"points": 980, "badges": ["contributor"]},
    },
    "leaderboard": [
        {"city": "Bangalore", "score": 1500},
        {"city": "Delhi", "score": 1200},
    ],
    "mission": {
        "description": "Detect 10 severe potholes this week",
        "target": 10,
        "found": 7,
        "severity": "severe",
    },
}

if not features.get("gamification", False):
    # Disable all gamify routes if feature is off
    @router.get("/gamify/{path:path}")
    def gamification_disabled():
        raise HTTPException(status_code=404, detail="Gamification disabled")

else:

    @router.get("/gamify/points")
    def get_points(user_id: str = Query(...)):
        user = gamify_data["users"].get(user_id, {"points": 0})
        return {"points": user["points"]}

    @router.post("/gamify/add_point")
    def add_point(user_id: str, delta: int = Query(...)):
        if user_id not in gamify_data["users"]:
            gamify_data["users"][user_id] = {"points": 0, "badges": []}
        gamify_data["users"][user_id]["points"] += delta
        return {"points": gamify_data["users"][user_id]["points"]}

    @router.get("/gamify/badges")
    def get_badges(user_id: str = Query(...)):
        user = gamify_data["users"].get(user_id, {"badges": []})
        return user["badges"]

    @router.get("/gamify/leaderboard")
    def get_leaderboard():
        return gamify_data["leaderboard"]

    @router.post("/gamify/mission/start")
    def start_mission():
        gamify_data["mission"]["found"] = 0  # Reset
        return gamify_data["mission"]

    @router.get("/gamify/mission/current")
    def get_current_mission():
        return gamify_data["mission"]
