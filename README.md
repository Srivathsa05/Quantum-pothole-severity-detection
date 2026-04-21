# Quantum Pothole Severity Detection

A real-time quantum-enhanced pothole severity detection system with live video streaming, heatmap visualization, analytics dashboard, CSV export, and gamification features.

## Features

- **Image Upload Detection**: Upload photos for instant pothole severity analysis
- **Live Video Streaming**: Real-time analysis from webcam or dashcam via WebSocket
- **Heatmap Visualization**: Interactive Leaflet map showing aggregated pothole data with live detection updates
- **Analytics Dashboard**: Historical trends, predictive maintenance, real-time analytics, and municipal road integration
- **CSV Export**: Download detection logs within date ranges
- **Gamification**: Points, badges, leaderboard, and missions (configurable via features.yaml)
- **Mobile Client**: HTML/JS page for smartphone streaming with GPS
- **Dashcam Support**: RTSP capture worker for dashcam integration

## Architecture

- **Backend**: FastAPI with WebSocket support, SQLAlchemy (PostgreSQL), quantum CNN-QNN ML model
- **Frontend**: React with TypeScript, Vite, Tailwind CSS, React-Leaflet, Recharts
- **Database**: PostgreSQL for production analytics and detection storage
- **ML Model**: Hybrid CNN-QNN using PennyLane and PyTorch

## Prerequisites

- Python 3.11+
- Node.js 18+
- Git

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Quantum-pothole-severity-detection.git
   cd Quantum-pothole-severity-detection
   ```

2. **Backend Setup:**
   ```bash
   cd backend

   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt

   # Create .env file (optional, uses defaults)
   cp .env.example .env
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend

   # Install dependencies
   npm install

   # Create .env file (optional)
   cp .env.example .env
   ```

## Configuration

### Backend Environment (.env)

Create `backend/.env` with:

```env
# Database (PostgreSQL required for analytics)
DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/pothole_detection

# Features toggle
FEATURES_FILE=../features.yaml

# Dashcam settings
ENABLE_DASHCAM=false
BACKEND_WS=ws://localhost:8000/ws/frame
DASHCAM_URL=rtsp://192.168.1.10:554/stream
```

**PostgreSQL Setup:**
1. Install PostgreSQL 14+ and pgAdmin4
2. Create database: `pothole_detection`
3. Run schema: `backend/database/schema.sql`
4. Update `DATABASE_URL` with your credentials

### Frontend Environment (.env)

Create `frontend/.env` with:

```env
VITE_BACKEND_URL=http://localhost:8000
VITE_BACKEND_WS=ws://localhost:8000/ws/frame
```

### Capture Worker Environment (.env)

If you are streaming from a dashcam via `capture_worker`, the following env vars (for that process) control metadata capture:

```env
ENABLE_DASHCAM=true
BACKEND_WS=ws://localhost:8000/ws/frame
DASHCAM_URL=rtsp://192.168.1.10:554/stream

# Optional GPS sources
LOCATION_PROVIDER=file            # or "env"
LOCATION_FILE=/path/to/location.json  # JSON file with {"lat":12.9,"lon":77.5}
LOCATION_LAT=12.9716              # Fallback when file/GPS unavailable
LOCATION_LON=77.5946
FRAME_INTERVAL=0.3                # Seconds between frames (default 0.3s ≈ 3 fps)
```

Update `LOCATION_FILE` periodically from your GPS service, or set `LOCATION_LAT/LON` for static positioning.

### Features Configuration (features.yaml)

```yaml
gamification: true  # Enable/disable gamification features
```

## Running Locally

### Development Mode

1. **Start Backend:**
   ```bash
   cd backend
   python run.py
   ```
   Backend runs on http://localhost:8000

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on http://localhost:8080

### Production Mode (Docker)

1. **Build and Run:**
   ```bash
   # Enable dashcam if needed
   echo "ENABLE_DASHCAM=true" >> .env

   # Run all services
   docker-compose up --build
   ```

2. **Access:**
   - Frontend: http://localhost:8080
   - Mobile Client: http://localhost:8080 (served by nginx)
   - Backend API: http://localhost:8000

## Usage

### Web Interface

1. **Home Page**: Overview and navigation
2. **Detection Page**: Upload images or use camera
3. **Live Page**: Real-time video analysis (requires camera + location permissions)
4. **Heatmap Page**: View aggregated pothole data on map
5. **Export Page**: Download CSV of detections by date range
6. **Dashboard**: Gamification stats (if enabled)

### Mobile Client

1. Open http://localhost:8080 in mobile browser
2. Allow camera and GPS permissions
3. Scan QR code for easy access
4. View live predictions overlaid on video

### API Endpoints

- `POST /predict`: Image upload prediction
- `WS /ws/frame`: Real-time frame analysis
- `GET /heatmap?bbox=...&zoom=...`: GeoJSON heatmap
- `GET /export?start=...&end=...`: CSV export
- `GET /features`: Feature configuration
- `/gamify/*`: Gamification endpoints (if enabled)
- `/api/analytics/*`: Analytics endpoints (historical trends, predictive maintenance, real-time analytics, municipal roads)

## Troubleshooting

### Live Camera Opens But No Predictions

1. **Check Backend Running:** Ensure backend is started and accessible at http://localhost:8000/health
2. **WebSocket Connection:** Open browser DevTools → Network → WS tab. Should see connection to /ws/frame
3. **Camera & Location Permissions:** Allow both camera and geolocation to embed GPS metadata. Without location the heatmap will stay empty.
4. **Console Errors:** Check for CORS or connection errors in DevTools

### Common Issues

- **CORS Errors:** Backend not running or wrong port (ensure frontend uses 8080, backend 8000)
- **Import Errors:** Run `pip install -r requirements.txt` and `npm install`
- **Database Errors:** SQLite file created automatically in backend/ directory
- **ML Model Errors:** Ensure `ml/artifacts/` contains model files

### Logs

- **Backend:** Check terminal output for FastAPI logs
- **Frontend:** Browser DevTools Console for React errors
- **WebSocket:** DevTools Network tab for WS connections

## Development

### Adding Features

- Backend: Add routes in `app/api/`, models in `app/models/`
- Frontend: Add pages in `src/pages/`, components in `src/components/`
- Toggle features via `features.yaml`

### Testing

```bash
# Backend tests
cd backend && python -m pytest tests/

# Frontend tests
cd frontend && npm run test
```

### Building for Production

```bash
# Frontend
cd frontend && npm run build

# Docker
docker-compose build
```

## Project Structure

```
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Config and main app
│   │   ├── db/             # Database models and session
│   │   ├── models/         # SQLAlchemy models
│   │   └── utils/          # Utilities
│   ├── ml/                 # ML models and preprocessing
│   └── requirements.txt
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utilities
│   └── package.json
├── mobile_client/           # Static HTML mobile client
├── capture_worker/          # RTSP capture script
├── docker-compose.yml       # Docker orchestration
├── features.yaml           # Feature toggles
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## License

MIT License - see LICENSE file for details