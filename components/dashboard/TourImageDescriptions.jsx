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
import { Checkbox } from "@/components/ui/checkbox";

const TourImageDescriptions = ({
  selectedItem,
  onUpdate,
  onDelete,
  isEditing,
  setIsEditing,
  cancelEditing,
  isAnyCardEditing,
}) => {
  const [images, setImages] = useState([]);
  const [editedDescriptions, setEditedDescriptions] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const unicodeSafeBase64Decode = (str) => {
    try {
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(str), (c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
    } catch (error) {
      console.error("Error decoding string:", error);
      return str; // Return the original string if decoding fails
    }
  };

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
        const encodedDescriptions = descriptionsModule.default.descriptions;

        // Decode the descriptions
        const decodedDescriptions = encodedDescriptions.map(unicodeSafeBase64Decode);

        const context = require.context("/public", true, /\.(png|jpe?g|svg)$/);
        const allKeys = context.keys();

        const images = allKeys
          .filter((key) => key.startsWith(`./${selectedItem.id}/`))
          .map((key, index) => ({
            src: key.replace("./", "/"),
            description: decodedDescriptions[index] || "Nincs leírás",
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

  const replaceCharacters = (text) => {
    const replacements = {
      û: "ű",
      ô: "ő",
      ò: "ó",
      // Add more replacements as needed
    };
    return text.replace(/[ûôò]/g, (char) => replacements[char] || char);
  };

  // Custom Unicode-safe base64 encoding function
  const unicodeSafeBase64Encode = (str) => {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  };

  const handleSave = () => {
    const replacedDescriptions = editedDescriptions.map(replaceCharacters);
    setEditedDescriptions(replacedDescriptions);
    setIsAlertOpen(true);
  };

  const handleConfirm = async () => {
    try {
      // Encode descriptions using the custom Unicode-safe base64 encoding function
      const encodedDescriptions = editedDescriptions.map(unicodeSafeBase64Encode);
      await onUpdate(encodedDescriptions);
      setIsAlertOpen(false);
    } catch (error) {
      console.error("Hiba a leírás módosítása során:", error);
      // Handle the error (e.g., show an error message to the user)
    }
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

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setIsAlertOpen(true);
  };

  const handleCheckboxChange = (index) => {
    setSelectedImages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedImages.length > 0) {
      setIsAlertOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await onDelete(selectedImages);
      const newImages = images.filter((_, index) => !selectedImages.includes(index));
      setImages(newImages);
      const newDescriptions = editedDescriptions.filter(
        (_, index) => !selectedImages.includes(index)
      );
      setEditedDescriptions(newDescriptions);
      setSelectedImages([]);
      setIsAlertOpen(false);
    } catch (error) {
      console.error("Error deleting images:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Pencil size={18} className="mr-2" />
          Kép leírás szerkesztése
        </CardTitle>
        {!isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger disabled={isAnyCardEditing && !isEditing}>
              <MoreVertical size={18} className="text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleEdit} disabled={isAnyCardEditing && !isEditing}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Szerkesztés</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent>
        {images.length > 0 ? (
          <div className="mt-4 space-y-4">
            {images.map((image, index) => (
              <div key={index} className="p-4 border rounded flex items-start">
                <Checkbox
                  checked={selectedImages.includes(index)}
                  onCheckedChange={() => handleCheckboxChange(index)}
                  className="mr-2 mt-2"
                />
                <div className="flex-grow">
                  <div className="relative w-full h-64 mb-2">
                    <Image
                      unoptimized
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
              </div>
            ))}
          </div>
        ) : (
          <p>Nincs leírás</p>
        )}
        {!isEditing && (
          <Button
            onClick={handleDeleteSelected}
            variant="destructive"
            size="sm"
            className="mt-4"
            disabled={selectedImages.length === 0}
          >
            <Trash className="mr-2 h-4 w-4" />
            Kijelölt képek törlése ({selectedImages.length})
          </Button>
        )}
        {isEditing && (
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="mr-2 h-4 w-4" />
              Mégse
            </Button>
            <CustomAlertDialog
              isOpen={isAlertOpen}
              onOpenChange={setIsAlertOpen}
              onConfirm={handleConfirm}
              triggerButton={
                <Button onClick={handleSave} size="sm">
                  <Check className="mr-2 h-4 w-4" />
                  Mentés
                </Button>
              }
            />
          </div>
        )}
      </CardContent>
      <CustomAlertDialog
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        onConfirm={handleConfirmDelete}
        title="Képek törlése"
        description={`Biztosan törölni szeretné a kijelölt ${selectedImages.length} képet és a hozzájuk tartozó leírásokat?`}
        confirmText="Törlés"
        cancelText="Mégse"
      />
    </Card>
  );
};

export default TourImageDescriptions;
