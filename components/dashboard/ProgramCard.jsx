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
import { List, MoreVertical, Edit, Trash, Check, X } from "lucide-react";
import CustomAlertDialog from "../custom-alert-dialog";

const ProgramCard = ({
  selectedItem,
  onUpdate,
  isEditing,
  setIsEditing,
  cancelEditing,
  isAnyCardEditing,
}) => {
  const [editedProgram, setEditedProgram] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (selectedItem && selectedItem.program) {
      setEditedProgram(selectedItem.program);
    }
  }, [selectedItem]);

  const handleEdit = () => {
    setIsEditing();
  };

  const handleSave = () => {
    setIsAlertOpen(true);
  };

  const handleConfirm = async () => {
    await onUpdate(editedProgram);
    setIsAlertOpen(false);
  };

  const handleCancel = () => {
    cancelEditing();
    setEditedProgram(selectedItem?.program || []);
  };

  const handleItemChange = (index, value) => {
    const newProgram = [...editedProgram];
    newProgram[index] = value;
    setEditedProgram(newProgram);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <List size={18} className="mr-2" />
          Program módosítása
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
            {editedProgram.map((item, index) => (
              <div key={index} className="space-y-2">
                <label htmlFor={`day-${index + 1}`} className="font-medium">
                  {index + 1}. Nap:
                </label>
                <Textarea
                  id={`day-${index + 1}`}
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder={`Program for Day ${index + 1}`}
                  rows={4}
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
            {selectedItem && selectedItem.program
              ? selectedItem.program.map((item, index) => (
                  <div key={index}>
                    <h3 className="font-medium">{index + 1}. Nap:</h3>
                    <p className="whitespace-pre-wrap">{item}</p>
                  </div>
                ))
              : "No program set"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
