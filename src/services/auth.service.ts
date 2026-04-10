import api from "./api";

export interface LoginPayload {
    email: string;
    password: string;
}

export const login = async (data: LoginPayload) => {
    const res = await api.post("/auth/login", data); //login service
    return res.data;
};

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role: "OWNER" | "ADMIN";
    createOwnerProfile?: boolean;
}

export const register = async (data: RegisterPayload) => {
    const res = await api.post("/auth/register", data);
    return res.data;
};
