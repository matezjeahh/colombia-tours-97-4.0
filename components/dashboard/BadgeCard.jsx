import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { List, MoreVertical, Edit, Trash, Check, X } from "lucide-react";
import CustomAlertDialog from "../custom-alert-dialog";

const BadgeCard = ({
  selectedItem,
  onUpdate,
  isEditing,
  setIsEditing,
  cancelEditing,
  isAnyCardEditing,
}) => {
  const [editedBadge, setEditedBadge] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (selectedItem && selectedItem.cimke) {
      setEditedBadge(selectedItem.cimke);
    }
  }, [selectedItem]);

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

  const handleSave = () => {
    const replacedBadge = editedBadge.map((item) => replaceCharacters(item));
    setEditedBadge(replacedBadge);
    setIsAlertOpen(true);
  };

  const handleConfirm = async () => {
    await onUpdate(editedBadge);
    setIsAlertOpen(false);
  };

  const handleCancel = () => {
    cancelEditing();
    setEditedBadge(selectedItem?.cimke || []);
  };

  const handleItemChange = (index, value) => {
    const newBadge = [...editedBadge];
    newBadge[index] = value;
    setEditedBadge(newBadge);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <List size={18} className="mr-2" />
          Cimke módosítása
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
              <DropdownMenuItem>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            {editedBadge.map((item, index) => (
              <div key={index} className="space-y-2">
                <h4 htmlFor={`day-${index + 1}`} className="font-medium">
                  {index + 1}. Cimke:
                </h4>
                <Input
                  type="string"
                  id={`day-${index + 1}`}
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder={`Badge for Day ${index + 1}`}
                />
              </div>
            ))}
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
          </div>
        ) : (
          <div className="space-y-4">
            {selectedItem && selectedItem.cimke
              ? selectedItem.cimke.map((item, index) => (
                  <div key={index}>
                    <h4 className="font-medium">{index + 1}. Cimke:</h4>
                    <p className="whitespace-pre-wrap">{item}</p>
                  </div>
                ))
              : "No badge set"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgeCard;
