"use client";

import { useRouter } from "next/navigation";
import PropertyForm from "@/components/property/PropertyForm";
import { createProperty } from "@/services/property.service";

export default function CreatePropertyPage() {
  const router = useRouter();

  const handleCreate = async (data: any, files: FileList | null) => {
    try {
      const property = await createProperty(data, files);

      console.log("CREATED:", property);

      router.push("/dashboard/owner/properties");
    } catch (error) {
      console.error(error);
      const message =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "Gagal menyimpan property";
      alert(message);
    }
  };

  return <PropertyForm onSubmit={handleCreate} />;
}
