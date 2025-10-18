"use client";

import axios from "axios";

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor que adiciona o token apenas no browser
api.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const token = getCookie("auth_token");

		if (token) {
			config.headers.Authorization = "Bearer " + token;
		}

		config.headers["ngrok-skip-browser-warning"] =  "69420";
	}
	return config;
});

export default api;

function getCookie(name: string): string | null {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
	return null;
}
