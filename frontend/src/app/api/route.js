import api from "../../../router";

export async function login(form) {
    const response = await api.post("/login", form);

    document.cookie = `auth_token=${response.data.msg}; path=/; secure; samesite=strict`;

    return response;
}

export async function register(form) {
    const response = await api.post("/register", form);

    return response;
}