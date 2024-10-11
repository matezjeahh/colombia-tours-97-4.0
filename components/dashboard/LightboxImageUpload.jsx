import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const LightboxImageUpload = ({ lightboxImages, setLightboxImages }) => {
  const handleLightboxImageChange = (id, e) => {
    const newImages = lightboxImages.map((img) =>
      img.id === id ? { ...img, file: e.target.files[0] } : img
    );
    setLightboxImages(newImages);
  };

  const handleLightboxDescriptionChange = (id, e) => {
    const newImages = lightboxImages.map((img) =>
      img.id === id ? { ...img, description: e.target.value } : img
    );
    setLightboxImages(newImages);
  };

  const addLightboxImageInput = () => {
    setLightboxImages([...lightboxImages, { id: Date.now(), file: null, description: "" }]);
  };

  const removeLightboxImageInput = (id) => {
    const newImages = lightboxImages.filter((img) => img.id !== id);
    setLightboxImages(newImages);
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Lightbox Images</h3>
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
            placeholder="Image description"
            className="mr-2"
          />
          <Button onClick={() => removeLightboxImageInput(image.id)} variant="outline" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button onClick={addLightboxImageInput} variant="outline" size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Add Lightbox Image
      </Button>
    </div>
  );
};

export default LightboxImageUpload;
