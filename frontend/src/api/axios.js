import axios from "axios";

// Use environment variable if available, otherwise fallback
const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:5006/api",
});

// Attach JWT token automatically if present
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
