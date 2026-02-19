import api from "@/services/api";

export const createProperty = async (data: any) => {
  const res = await api.post("/properties", data);
  return res.data.data;
};