import api from "@/services/api";

export type CreateInquiryPayload = {
  propertyId: string;
  name: string;
  email: string;
  telephone: string;
  message?: string;
  billingType: "MONTHLY" | "YEARLY";
  checkIn: string;
  checkOut: string;
  guests: number;
};

export const createInquiry = async (payload: CreateInquiryPayload) => {
  const res = await api.post("/inquiries", payload);
  return res.data.data;
};

export const getOwnerInquiries = async () => {
  const res = await api.get("/inquiries/owner");
  return res.data.data;
};

export const replyInquiry = async (id: string, message: string) => {
  const res = await api.post(`/inquiries/${id}/reply`, {
    message,
  });

  return res.data;
};

export const getInquiryDetail = async (id: string) => {
  const res = await api.get(`/inquiries/${id}`);
    return res.data.data;
};
