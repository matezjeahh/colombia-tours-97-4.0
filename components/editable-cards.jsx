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

        toast.success(`${field} updated successfully`);
        setEditingCard(null);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Failed to update ${field}`);
    }
  };

  const handleUpdateGitHub = async (field, newValue) => {
    if (!selectedItem) return;

    const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
    const GITHUB_FILE_PATH = `public/${selectedItem.id}/image-descriptions.json`;
    const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
    const NEXT_PUBLIC_GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN; // Note: This is not secure for production!

    console.log("Using GITHUB_API_URL:", GITHUB_API_URL);
    console.log(
      "Token being used:",
      NEXT_PUBLIC_GITHUB_TOKEN ? NEXT_PUBLIC_GITHUB_TOKEN.substr(0, 5) + "..." : "No token"
    );

    try {
      // Fetch the current file content from GitHub
      const fileResponse = await fetch(GITHUB_API_URL, {
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!fileResponse.ok) {
        throw new Error(`GitHub API responded with status: ${fileResponse.status}`);
      }

      const fileData = await fileResponse.json();
      const currentContent = JSON.parse(atob(fileData.content)); // Base64 decode and parse the file content

      // Update the content
      currentContent.descriptions = newValue;

      // Prepare the updated content as base64
      const updatedContentBase64 = btoa(JSON.stringify(currentContent, null, 2));

      // Make a PUT request to update the file
      const updateResponse = await fetch(GITHUB_API_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${NEXT_PUBLIC_GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update ${field} for tour ${selectedItem.id}`,
          content: updatedContentBase64,
          sha: fileData.sha, // Include the SHA to ensure we're updating the latest version
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(`Failed to update file: ${errorData.message}`);
      }

      toast.success(`${field} updated successfully on GitHub`);
    } catch (error) {
      console.error(`Error updating ${field} on GitHub:`, error);
      toast.error(`Failed to update ${field} on GitHub: ${error.message}`);
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
      <TourImageDescriptions
        selectedItem={selectedItem}
        onUpdate={(newDescriptions) => handleUpdateGitHub("descriptions", newDescriptions)}
        isEditing={editingCard === "tourImages"}
        setIsEditing={() => setEditingCard("tourImages")}
        cancelEditing={() => setEditingCard(null)}
        isAnyCardEditing={isAnyCardEditing}
      />
    </div>
  );
};

export default EditableCards;
