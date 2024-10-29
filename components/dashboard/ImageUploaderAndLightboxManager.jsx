import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import Image from "next/image";

const ImageUploaderAndLightboxManager = ({
  mainImage,
  onMainImageChange,
  lightboxImages,
  onLightboxImagesChange,
}) => {
  const [mainImagePreview, setMainImagePreview] = useState(null);

  useEffect(() => {
    if (mainImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(mainImage);
    } else {
      setMainImagePreview(null);
    }
  }, [mainImage]);

  const handleMainImageChange = (e) => {
    if (e.target.files[0]) {
      onMainImageChange(e.target.files[0]);
    }
  };

  const handleLightboxImageChange = (id, e) => {
    const newImages = lightboxImages.map((img) =>
      img.id === id ? { ...img, file: e.target.files[0] } : img
    );
    onLightboxImagesChange(newImages);
  };

  const handleLightboxDescriptionChange = (id, e) => {
    const newImages = lightboxImages.map((img) =>
      img.id === id ? { ...img, description: e.target.value } : img
    );
    onLightboxImagesChange(newImages);
  };

  const addLightboxImageInput = () => {
    onLightboxImagesChange([...lightboxImages, { id: Date.now(), file: null, description: "" }]);
  };

  const removeLightboxImageInput = (id) => {
    const newImages = lightboxImages.filter((img) => img.id !== id);
    onLightboxImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Főkép kiválasztása</h3>
        <Input type="file" onChange={handleMainImageChange} accept="image/*" />

        {mainImagePreview && (
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Főkép előnézete</h4>
            <Image
              unoptimized
              src={mainImagePreview}
              alt="Main image preview"
              width={200}
              height={200}
              className="object-cover rounded-md"
            />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">További képek feltöltése</h3>
        {lightboxImages.map((image) => (
          <div key={image.id} className="flex items-center mb-2">
            <Input
              type="file"
              onChange={(e) => handleLightboxImageChange(image.id, e)}
              accept="image/*"
              className="mr-2"
            />
            <Input
              type="text"
              value={image.description}
              onChange={(e) => handleLightboxDescriptionChange(image.id, e)}
              placeholder="Kép leírása"
              className="mr-2"
            />
            <Button
              onClick={() => removeLightboxImageInput(image.id)}
              variant="outline"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addLightboxImageInput} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Új kép hozzáadása
        </Button>
      </div>
    </div>
  );
};

export default ImageUploaderAndLightboxManager;
