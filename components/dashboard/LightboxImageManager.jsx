import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

const LightboxImageManager = ({ images, descriptions, onImagesChange }) => {
  const handleDescriptionChange = (index, newDescription) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = newDescription;
    onImagesChange(images, updatedDescriptions);
  };

  const handleImageChange = (index, newFile) => {
    const updatedImages = [...images];
    if (newFile) {
      // For new file uploads, we'll use a temporary URL
      updatedImages[index] = URL.createObjectURL(newFile);
    }
    onImagesChange(updatedImages, descriptions);
  };

  const handleAddImage = () => {
    onImagesChange([...images, ""], [...descriptions, ""]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedDescriptions = descriptions.filter((_, i) => i !== index);
    onImagesChange(updatedImages, updatedDescriptions);
  };

  return (
    <div className="space-y-4">
      {images.map((src, index) => (
        <div key={index} className="flex items-start space-x-4">
          <div className="w-1/3">
            {src ? (
              <Image
                unoptimized
                width={0}
                height={0}
                sizes="100vw"
                src={src}
                alt={`Lightbox image ${index + 1}`}
                className="w-full h-auto object-cover rounded"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded">
                No image
              </div>
            )}
            <Input
              type="file"
              onChange={(e) => handleImageChange(index, e.target.files[0])}
              className="mt-2"
            />
          </div>
          <div className="flex-grow">
            <Input
              value={descriptions[index] || ""}
              onChange={(e) => handleDescriptionChange(index, e.target.value)}
              placeholder="Image description"
            />
          </div>
          <Button variant="destructive" size="icon" onClick={() => handleRemoveImage(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button onClick={handleAddImage} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add New Image
      </Button>
    </div>
  );
};

export default LightboxImageManager;
