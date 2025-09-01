"use client";

import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor que adiciona o token apenas no browser
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
  }
  return config;
});

export default api;
