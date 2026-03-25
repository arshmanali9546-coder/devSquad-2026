import axios from "axios";

const api = axios.create({
  baseURL: "https://week03-day03-backend.vercel.app",
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
