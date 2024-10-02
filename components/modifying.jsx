// components/Modifying.jsx
"use client";
import { useState } from "react";
import SelectTour from "@/components/select-tour";
import EditableCards from "@/components/editable-cards";

const Modifying = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="my-10 space-y-10">
      <SelectTour data={data} setSelectedItem={setSelectedItem} disabled={isEditing} />
      {selectedItem && (
        <EditableCards
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default Modifying;
