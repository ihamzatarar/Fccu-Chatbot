import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// const apiUrl = "/choreo-apis/awbo/backend/rest-api-be2/v1.0";
// ? import.meta.env.VITE_API_URL : apiUrl,

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/"
});
console.log(import.meta.env.VITE_API_URL)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
