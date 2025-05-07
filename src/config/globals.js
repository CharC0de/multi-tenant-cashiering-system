import axios from "axios";
import { API_URL } from ".";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // fresh read
  if (token) config.headers.Authorization = `Bearer ${token}`; // attach Bearer header :contentReference[oaicite:9]{index=9}
  return config;
});
