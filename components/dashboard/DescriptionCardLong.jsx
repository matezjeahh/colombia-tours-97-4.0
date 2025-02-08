import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, MoreVertical, Edit, Trash, Check, X } from "lucide-react";
import CustomAlertDialog from "../custom-alert-dialog";

const DescriptionCardLong = ({
  selectedItem,
  onUpdate,
  isEditing,
  setIsEditing,
  cancelEditing,
  isAnyCardEditing,
}) => {
  const [editedContent, setEditedContent] = useState(selectedItem?.utleiras || "");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleEdit = () => {
    setIsEditing();
    setEditedContent(selectedItem?.utleiras || "");
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
    const replacedContent = replaceCharacters(editedContent);
    setEditedContent(replacedContent);
    setIsAlertOpen(true);
  };

  const handleConfirm = async () => {
    await onUpdate(editedContent);
    setIsAlertOpen(false);
  };

  const handleCancel = () => {
    cancelEditing();
    setEditedContent(selectedItem?.utleiras || "");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <FileText size={18} className="mr-2" />
          Hosszú leírás módosítása
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
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end space-x-2">
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
          <p>{selectedItem ? selectedItem.utleiras : "No item selected"}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DescriptionCardLong;
