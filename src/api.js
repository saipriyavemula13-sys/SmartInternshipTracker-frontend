
import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-internship-tracker-backend-aq8t.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;