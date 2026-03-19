"use client"

import { useRouter } from "next/navigation";
import PropertyForm from "@/components/property/PropertyForm";
import { createProperty, uploadPropertyPhotos } from "@/services/property.service";

export default function CreatePropertyPage() {
  const router = useRouter();

  const handleCreate = async (data: any, files: FileList | null) => {
    const property = await createProperty(data);

    if (files && files.length > 0) {
      await uploadPropertyPhotos(property.id, files);
    }

    router.push("/dashboard/owner/properties");
  };

  return <PropertyForm onSubmit={handleCreate} />;
}