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
import { format } from "date-fns";

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

  useEffect(() => {
    if (selectedItem) {
      setEditedStartDate(formatDate(selectedItem.startDate));
      setEditedEndDate(formatDate(selectedItem.endDate));
    }
  }, [selectedItem]);

  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date.seconds * 1000), "yyyy-MM-dd");
  };

  const handleEdit = () => {
    setIsEditing();
  };

  const handleSave = () => {
    setIsAlertOpen(true);
  };

  const handleConfirm = async () => {
    await onUpdate({
      startDate: new Date(editedStartDate),
      endDate: new Date(editedEndDate),
    });
    setIsAlertOpen(false);
  };

  const handleCancel = () => {
    cancelEditing();
    setEditedStartDate(formatDate(selectedItem?.startDate));
    setEditedEndDate(formatDate(selectedItem?.endDate));
  };

  const displayFormattedDate = (date) => {
    if (!date) return "";
    return format(new Date(date.seconds * 1000), "yyyy-MM-dd");
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
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex flex-col space-y-2">
              <label htmlFor="startDate">Kezdő dátum:</label>
              <Input
                id="startDate"
                type="date"
                value={editedStartDate}
                onChange={(e) => setEditedStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="endDate">Záró dátum:</label>
              <Input
                id="endDate"
                type="date"
                value={editedEndDate}
                onChange={(e) => setEditedEndDate(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
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
          </div>
        ) : (
          <p>
            {selectedItem ? (
              <>
                {displayFormattedDate(selectedItem.startDate)} -{" "}
                {displayFormattedDate(selectedItem.endDate)}
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
