const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const api = {
  getFeatures: () =>
    fetch(`${API_BASE}/features`).then(r => r.json()),

  getHeatMap: (bbox: string, zoom: number) =>
    fetch(`${API_BASE}/heatmap?bbox=${bbox}&zoom=${zoom}`).then(r => r.json()),

  exportPotholes: (start: string, end: string) =>
    fetch(`${API_BASE}/export?start=${start}&end=${end}`),

  getPoints: (userId: string) =>
    fetch(`${API_BASE}/gamify/points?user_id=${userId}`).then(r => r.json()),

  addPoint: (userId: string, delta: number) =>
    fetch(`${API_BASE}/gamify/add_point?user_id=${userId}&delta=${delta}`, { method: 'POST' }).then(r => r.json()),

  getBadges: (userId: string) =>
    fetch(`${API_BASE}/gamify/badges?user_id=${userId}`).then(r => r.json()),

  getLeaderboard: () =>
    fetch(`${API_BASE}/gamify/leaderboard`).then(r => r.json()),

  startMission: () =>
    fetch(`${API_BASE}/gamify/mission/start`, { method: 'POST' }).then(r => r.json()),

  getCurrentMission: () =>
    fetch(`${API_BASE}/gamify/mission/current`).then(r => r.json()),
};
