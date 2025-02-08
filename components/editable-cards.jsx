import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import TitleCard from "./dashboard/TitleCard";
import DescriptionCard from "./dashboard/DescriptionCard";
import PriceCard from "./dashboard/PriceCard";
import DateRangeCard from "./dashboard/DateRangeCard";
import ProgramCard from "./dashboard/ProgramCard";
import BadgeCard from "./dashboard/BadgeCard";
import TourImageDescriptions from "./dashboard/TourImageDescriptions";
import ImageUploadComponent from "./dashboard/ImageUploadComponent";
import DescriptionCardLong from "./dashboard/DescriptionCardLong";
import { GitHubBatchOperation } from "@/utils/GitHubBatchOperation";

console.log("GITHUB_REPO:", process.env.NEXT_PUBLIC_GITHUB_REPO);
console.log(
  "NEXT_PUBLIC_GITHUB_TOKEN:",
  process.env.NEXT_PUBLIC_GITHUB_TOKEN ? "Token exists" : "Token is missing"
);

const EditableCards = ({ selectedItem, setSelectedItem, setIsEditing }) => {
  const [editingCard, setEditingCard] = useState(null);

  useEffect(() => {
    setIsEditing(editingCard !== null);
  }, [editingCard, setIsEditing]);

  const handleUpdate = async (field, newValue) => {
    if (!selectedItem) return;

    const docRef = doc(db, "adatok", "utazasaink");

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentData = docSnap.data();
        let updatedItem;

        if (field === "dateRange") {
          updatedItem = {
            ...selectedItem,
            datum: {
              kezdo: newValue.startDate,
              veg: newValue.endDate,
            },
          };
        } else {
          updatedItem = { ...selectedItem, [field]: newValue };
        }

        const updatedUtak = currentData.utak.map((item) =>
          item.id === selectedItem.id ? updatedItem : item
        );

        await updateDoc(docRef, { utak: updatedUtak });

        setSelectedItem(updatedItem);

        toast.success(`${field} sikeresen módosítva`);
        setEditingCard(null);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Sikertelen módosítás: ${field}`);
    }
  };

  const handleUpdateGitHub = async (field, newValue) => {
    if (!selectedItem) return;

    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const GITHUB_FILE_PATH = `public/${selectedItem.id}/image-descriptions.json`;

    try {
      const batchOperation = new GitHubBatchOperation(GITHUB_REPO, GITHUB_TOKEN);

      // Create the updated content object
      const currentContent = {
        descriptions: newValue, // This will be the array of encoded descriptions
      };

      // Add the file update to the batch operation
      batchOperation.addFileChange(
        GITHUB_FILE_PATH,
        JSON.stringify(currentContent, null, 2),
        `Update image descriptions for tour ${selectedItem.id}`
      );

      // Execute the batch operation
      await batchOperation.executeChanges(`Update tour ${selectedItem.id} descriptions`);

      toast.success("Leírások sikeresen módosítva");
      setEditingCard(null); // Exit editing mode
    } catch (error) {
      console.error("Error updating descriptions on GitHub:", error);
      toast.error(`Hiba történt a leírások mentése közben: ${error.message}`);
    }
  };

  const generateFileName = (originalFileName) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const extension = originalFileName.split(".").pop();
    return `photo_${year}_${month}_${day}_${hours}_${minutes}_${seconds}.${extension}`;
  };

  const handleImageUpload = async (file, description) => {
    if (!selectedItem) return;

    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const newFileName = generateFileName(file.name);
    const GITHUB_IMAGE_PATH = `public/${selectedItem.id}/${newFileName}`;
    const GITHUB_JSON_PATH = `public/${selectedItem.id}/image-descriptions.json`;
    const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/`;
    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

    try {
      // 1. Upload the image file with the new name
      const imageContent = await readFileAsArrayBuffer(file);
      const base64Image = arrayBufferToBase64(imageContent);

      await uploadToGitHub(
        `${GITHUB_API_URL}${GITHUB_IMAGE_PATH}`,
        base64Image,
        `Upload new image ${newFileName} for tour ${selectedItem.id}`,
        GITHUB_TOKEN
      );

      // 2. Update the JSON file
      const jsonData = await fetchFromGitHub(`${GITHUB_API_URL}${GITHUB_JSON_PATH}`, GITHUB_TOKEN);
      const currentContent = JSON.parse(atob(jsonData.content));

      // Encode the new description
      const encodedDescription = btoa(unescape(encodeURIComponent(description)));
      currentContent.descriptions.push(encodedDescription);

      const updatedContentBase64 = btoa(JSON.stringify(currentContent, null, 2));

      await uploadToGitHub(
        `${GITHUB_API_URL}${GITHUB_JSON_PATH}`,
        updatedContentBase64,
        `Update image descriptions for tour ${selectedItem.id}`,
        GITHUB_TOKEN,
        jsonData.sha
      );

      toast.success(`Kép ${newFileName} sikeresen módosítva`);
      return true; // Indicate successful upload
    } catch (error) {
      console.error("Error uploading image and updating JSON:", error);
      toast.error(`Failed to upload image and update JSON: ${error.message}`);
      throw error; // Re-throw the error to be caught in the ImageUploadComponent
    }
  };

  const deleteImagesAndDescriptions = async (imageIndexes) => {
    if (!selectedItem) return;

    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

    try {
      const batchOperation = new GitHubBatchOperation(GITHUB_REPO, GITHUB_TOKEN);

      // Get the list of images first
      const imagesResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/public/${selectedItem.id}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        }
      );
      const imagesData = await imagesResponse.json();
      const imageFiles = imagesData.filter(
        (file) => file.type === "file" && /\.(jpg|jpeg|png|gif)$/i.test(file.name)
      );

      // Add all image deletions to the batch
      for (const index of imageIndexes) {
        if (index >= imageFiles.length) continue;
        const imageToDelete = imageFiles[index];
        batchOperation.addFileDeletion(
          `public/${selectedItem.id}/${imageToDelete.name}`,
          imageToDelete.sha,
          `Delete image ${imageToDelete.name}`
        );
      }

      // Update the JSON file
      const jsonResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/public/${selectedItem.id}/image-descriptions.json`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        }
      );
      const jsonData = await jsonResponse.json();
      const currentContent = JSON.parse(atob(jsonData.content));

      // Remove the descriptions at the specified indexes
      currentContent.descriptions = currentContent.descriptions.filter(
        (_, index) => !imageIndexes.includes(index)
      );

      batchOperation.addFileChange(
        `public/${selectedItem.id}/image-descriptions.json`,
        JSON.stringify(currentContent, null, 2),
        `Update image descriptions for tour ${selectedItem.id}`
      );

      // Execute all changes in a single commit
      await batchOperation.executeChanges(
        `Delete ${imageIndexes.length} images and update descriptions for tour ${selectedItem.id}`
      );

      toast.success(`${imageIndexes.length} image(s) and description(s) successfully deleted`);
      return true;
    } catch (error) {
      console.error("Error deleting images and updating JSON:", error);
      toast.error(`Failed to delete images and descriptions: ${error.message}`);
      throw error;
    }
  };

  const isAnyCardEditing = editingCard !== null;

  return (
    <div className="space-y-4">
      <TitleCard
        selectedItem={selectedItem}
        onUpdate={(newTitle) => handleUpdate("cim", newTitle)}
        isEditing={editingCard === "title"}
        setIsEditing={() => setEditingCard("title")}
        cancelEditing={() => setEditingCard(null)}
        isAnyCardEditing={isAnyCardEditing}
      />
      <DescriptionCard
        selectedItem={selectedItem}
        onUpdate={(newDescription) => handleUpdate("leiras", newDescription)}
        isEditing={editingCard === "description"}
        setIsEditing={() => setEditingCard("description")}
        cancelEditing={() => setEditingCard(null)}
        isAnyCardEditing={isAnyCardEditing}
      />
      <DescriptionCardLong
        selectedItem={selectedItem}
        onUpdate={(newDescriptionlong) => handleUpdate("utleiras", newDescriptionlong)}
        isEditing={editingCard === "descriptionlong"}
        setIsEditing={() => setEditingCard("descriptionlong")}
        cancelEditing={() => setEditingCard(null)}
        isAnyCardEditing={isAnyCardEditing}
      />
      <PriceCard
        selectedItem={selectedItem}
        onUpdate={(newPrice) => handleUpdate("ar", newPrice)}
        isEditing={editingCard === "ar"}
        setIsEditing={() => setEditingCard("ar")}
        cancelEditing={() => setEditingCard(null)}
        isAnyCardEditing={isAnyCardEditing}
      />
      <DateRangeCard
        selectedItem={selectedItem}
        onUpdate={(dateRange) => handleUpdate("dateRange", dateRange)}
        isEditing={editingCard === "dateRange"}
        setIsEditing={() => setEditingCard("dateRange")}
        cancelEditing={() => setEditingCard(null)}
        isAnyCardEditing={isAnyCardEditing}
      />
      <BadgeCard
        selectedItem={selectedItem}
        onUpdate={(newBadge) => handleUpdate("cimke", newBadge)}
        isEditing={editingCard === "cimke"}
        setIsEditing={() => setEditingCard("cimke")}
        cancelEditing={() => setEditingCard(null)}
        isAnyCardEditing={isAnyCardEditing}
      />
      <ProgramCard
        selectedItem={selectedItem}
        onUpdate={(newProgram) => handleUpdate("program", newProgram)}
        isEditing={editingCard === "program"}
        setIsEditing={() => setEditingCard("program")}
        cancelEditing={() => setEditingCard(null)}
        isAnyCardEditing={isAnyCardEditing}
      />
      <ImageUploadComponent onUpload={handleImageUpload} />
      <TourImageDescriptions
        selectedItem={selectedItem}
        onUpdate={(newDescriptions) => handleUpdateGitHub("descriptions", newDescriptions)}
        onDelete={deleteImagesAndDescriptions}
        isEditing={editingCard === "tourImages"}
        setIsEditing={() => setEditingCard("tourImages")}
        cancelEditing={() => setEditingCard(null)}
        isAnyCardEditing={isAnyCardEditing}
      />
    </div>
  );
};

const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const uploadToGitHub = async (url, content, message, token, sha = null) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content,
      sha,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to upload to GitHub: ${response.statusText}`);
  }

  return response.json();
};

const fetchFromGitHub = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from GitHub: ${response.statusText}`);
  }

  return response.json();
};

export default EditableCards;
