import api from "./api";

export interface LoginPayload {
    email: string;
    password: string;
}

export const login = async (data: LoginPayload) => {
    const res = await api.post("/auth/login", data); //login service
    return res.data;
};