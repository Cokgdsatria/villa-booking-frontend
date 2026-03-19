"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PropertyForm from "@/components/property/PropertyForm";
import { getPropertyDetail, updateProperty } from "@/services/property.service";

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPropertyDetail(id as string);
      setData(res);
    };

    if (id) fetchData();
  }, [id]);

  const handleUpdate = async (formData: any) => {
    await updateProperty(id as string, formData);
    router.push("/dashboard/owner/properties");
  };

  if (!data) return <p>Loading...</p>;

  return (
    <PropertyForm
      initialData={data}
      onSubmit={handleUpdate}
      isEdit
    />
  );
}