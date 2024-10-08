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
import { Calendar, MoreVertical, Edit, Trash, Check, X } from "lucide-react";
import CustomAlertDialog from "../custom-alert-dialog";

const DateRangeCard = ({
  selectedItem,
  onUpdate,
  isEditing,
  setIsEditing,
  cancelEditing,
  isAnyCardEditing,
}) => {
  const [editedStartDate, setEditedStartDate] = useState("");
  const [editedEndDate, setEditedEndDate] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split(".");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  useEffect(() => {
    if (selectedItem && selectedItem.datum) {
      setEditedStartDate(selectedItem.datum.kezdo || "");
      setEditedEndDate(selectedItem.datum.veg || "");
    }
  }, [selectedItem]);

  const handleEdit = () => {
    setIsEditing();
  };

  const handleSave = () => {
    setIsAlertOpen(true);
  };

  const handleConfirm = async () => {
    await onUpdate({
      startDate: editedStartDate,
      endDate: editedEndDate,
    });
    setIsAlertOpen(false);
  };

  const handleCancel = () => {
    cancelEditing();
    if (selectedItem && selectedItem.datum) {
      setEditedStartDate(selectedItem.datum.kezdo || "");
      setEditedEndDate(selectedItem.datum.veg || "");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Calendar size={18} className="mr-2" />
          Dátum módosítása
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
            <div className="flex flex-col space-y-2">
              <label htmlFor="startDate">Kezdő dátum:</label>
              <Input
                id="startDate"
                type="date"
                value={formatDate(editedStartDate)}
                onChange={(e) => setEditedStartDate(e.target.value.replace(/-/g, "."))}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="endDate">Záró dátum:</label>
              <Input
                id="endDate"
                type="date"
                value={formatDate(editedEndDate)}
                onChange={(e) => setEditedEndDate(e.target.value.replace(/-/g, "."))}
              />
            </div>
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
          <p>
            {selectedItem && selectedItem.datum ? (
              <>
                {selectedItem.datum.kezdo} - {selectedItem.datum.veg}
              </>
            ) : (
              "No dates set"
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DateRangeCard;
