import api from "@/services/api";

export const createProperty = async (data: any) => {
    const res = await api.post("/properties", {
      ...data,
      totalRoom: Number(data.totalRoom),
      bedroom: Number(data.bedroom),
      bathroom: Number(data.bathroom),
      priceMonthly: Number(data.priceMonthly),
      priceYearly: Number(data.priceYearly),
    });

    return res.data.data;
};

export const getOwnerProperties = async () => {
  const res = await api.get("/properties/owner");
  return res.data.data;
};

export const uploadPropertyPhotos = async (
  propertyId: string,
  files: FileList
) => {
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("photos", files[i]);
  }

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