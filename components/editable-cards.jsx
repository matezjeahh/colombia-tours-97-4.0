import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import TitleCard from "./dashboard/TitleCard";
import DescriptionCard from "./dashboard/DescriptionCard";
import PriceCard from "./dashboard/PriceCard";
import DateRangeCard from "./dashboard/DateRangeCard";

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
            startDate: newValue.startDate,
            endDate: newValue.endDate,
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
    </div>
  );
};

export default EditableCards;
