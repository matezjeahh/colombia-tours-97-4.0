import React from "react";
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/custom-alert-dialog";

const SaveButton = ({ isAlertOpen, setIsAlertOpen, onConfirm }) => (
  <CustomAlertDialog
    isOpen={isAlertOpen}
    onOpenChange={setIsAlertOpen}
    onConfirm={onConfirm}
    triggerButton={
      <Button onClick={() => setIsAlertOpen(true)} className="w-full">
        Save and Upload
      </Button>
    }
  />
);

export default SaveButton;
