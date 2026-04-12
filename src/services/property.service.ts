import api from "@/services/api";

export type PropertyListMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type PublicPropertyListItem = {
  id: string;
  name: string;
  province: string;
  city: string;
  type: string;
  totalRoom: number;
  bedroom: number;
  bathroom: number;
  priceMonthly: number;
  priceYearly: number;
  thumbnailUrl?: string | null;
  popularScore?: number;
  location?: string;
};

export const createProperty = async (
  data: any,
  files: FileList | null
) => {
  const formData = new FormData();

  // append data
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  // append thumbnail
  if (files && files.length > 0) {
    formData.append("thumbnail", files[0]); 
  }

  const res = await api.post("/properties", formData);

  return res.data.data;
};

export const getOwnerProperties = async () => {
  const res = await api.get("/properties/owner");
  return res.data.data;
};

export const uploadPropertyPhotos = async (
  propertyId: string,
  files: FileList | File[]
) => {
  const formData = new FormData();

  const list = Array.isArray(files) ? files : Array.from(files);
  for (const file of list) formData.append("photos", file);

  const res = await api.post(
    `/properties/${propertyId}/photos`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const getPropertyDetail = async (id: string) => {
  const res = await api.get(`/properties/${id}`);
  return res.data.data;
}

export const getPublicProperties = async (params?: {
  page?: number;
  limit?: number;
  sort?: "popular" | "price_asc" | "price_desc" | "newest";
  location?: string;
  type?: string;
  totalRoom?: number;
}) => {
  const res = await api.get("/properties", { params });
  return res.data as { data: PublicPropertyListItem[]; meta: PropertyListMeta };
};

export const searchPublicProperties = async (params?: {
  location?: string;
  city?: string;
  province?: string;
  type?: string;
  totalRoom?: number;
  billingType?: "MONTHLY" | "YEARLY";
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: "name" | "priceMonthly" | "priceYearly";
  order?: "asc" | "desc";
}) => {
  const res = await api.get("/properties/search", { params });
  return res.data as {
    status: string;
    meta: { total: number; page: number; limit: number; totalPages: number };
    data: PublicPropertyListItem[];
  };
};

export const deleteProperty = async (id: string) => {
  const res = await api.delete(`/properties/${id}`);
  return res.data;
}

export const getDashboardStats = async () => {
  const res = await api.get("/properties/owner/dashboard");
  return res.data;
};

export const updateProperty = async (id: string, data: any) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/properties/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Gagal update property");
  }

  return res.json();
};
