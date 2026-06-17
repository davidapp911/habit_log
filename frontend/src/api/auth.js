import { instance } from "./client";

export async function getMe() {
    const response = await instance.get("/auth/me");
    return response.data;
}

export async function register(body) {
    const response = await instance.post("/auth/register", body);
    return response.data;
}

export async function login(body) {
    const response = await instance.post("/auth/login", body);
    return response.data;
}