import axios from "axios";

const url = "http://localhost:3333";

const api = axios.create({
  baseURL: url,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
