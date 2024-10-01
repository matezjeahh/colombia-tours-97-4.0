import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, MoreVertical, Edit, Trash, Check, X } from "lucide-react";
import CustomAlertDialog from "../custom-alert-dialog";
import Image from "next/image";

const TourImageDescriptions = ({
  selectedItem,
  onUpdate,
  isEditing,
  setIsEditing,
  cancelEditing,
  isAnyCardEditing,
}) => {
  const [images, setImages] = useState([]);
  const [editedDescriptions, setEditedDescriptions] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    const importImagesAndDescriptions = async () => {
      try {
        if (selectedItem.id === null || selectedItem.id === undefined || isNaN(selectedItem.id)) {
          console.error("Invalid id:", selectedItem.id);
          return;
        }

        const descriptionsModule = await import(
          `/public/${selectedItem.id}/image-descriptions.json`
        );
        const descriptions = descriptionsModule.default.descriptions;

        const context = require.context("/public", true, /\.(png|jpe?g|svg)$/);
        const allKeys = context.keys();

        const images = allKeys
          .filter((key) => key.startsWith(`./${selectedItem.id}/`))
          .map((key, index) => ({
            src: key.replace("./", "/"),
            description: descriptions[index] || "No description available",
          }));

        setImages(images);
        setEditedDescriptions(images.map((img) => img.description));
      } catch (error) {
        console.error("Error importing images or descriptions:", error);
      }
    };

    importImagesAndDescriptions();
  }, [selectedItem.id]);

  const handleEdit = () => {
    setIsEditing();
  };

  const handleSave = () => {
    setIsAlertOpen(true);
  };

  const handleConfirm = async () => {
    await onUpdate(editedDescriptions);
    setIsAlertOpen(false);
  };

  const handleCancel = () => {
    cancelEditing();
    setEditedDescriptions(images.map((img) => img.description));
  };

  const handleDescriptionChange = (index, newDescription) => {
    const newDescriptions = [...editedDescriptions];
    newDescriptions[index] = newDescription;
    setEditedDescriptions(newDescriptions);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Pencil size={18} className="mr-2" />
          Tour Image Descriptions
        </CardTitle>
        {!isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger disabled={isAnyCardEditing && !isEditing}>
              <MoreVertical size={18} className="text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleEdit} disabled={isAnyCardEditing && !isEditing}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent>
        {images.length > 0 ? (
          <div className="mt-4 space-y-4">
            {images.map((image, index) => (
              <div key={index} className="p-4">
                <div className="relative w-full h-64 mb-2">
                  <Image
                    src={image.src}
                    alt={`Tour image ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                {isEditing ? (
                  <Textarea
                    value={editedDescriptions[index]}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    className="min-h-[100px]"
                  />
                ) : (
                  <p>{image.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Nincs leírás</p>
        )}
        {isEditing && (
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <CustomAlertDialog
              isOpen={isAlertOpen}
              onOpenChange={setIsAlertOpen}
              onConfirm={handleConfirm}
              triggerButton={
                <Button onClick={handleSave} size="sm">
                  <Check className="mr-2 h-4 w-4" />
                  Save
                </Button>
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TourImageDescriptions;
