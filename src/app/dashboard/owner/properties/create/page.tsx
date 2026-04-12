"use client";

import { useRouter } from "next/navigation";
import PropertyForm from "@/components/property/PropertyForm";
import { createProperty, uploadPropertyPhotos } from "@/services/property.service";

export default function CreatePropertyPage() {
  const router = useRouter();

  const handleCreate = async (data: any, files: FileList | null) => {
    try {
      const property = await createProperty(data, files);

      if (property?.id && files && files.length > 1) {
        const extraPhotos = Array.from(files).slice(1);
        if (extraPhotos.length > 0) {
          await uploadPropertyPhotos(property.id, extraPhotos);
        }
      }

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
