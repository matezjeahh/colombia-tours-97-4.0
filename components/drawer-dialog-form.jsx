import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./contact-form";

export function DrawerDialogForm({ title }) {
  const [open, setOpen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    return () => window.removeEventListener("resize", updateViewportHeight);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="default" className="w-full">
          Érdekel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px] md:max-w-md lg:max-w-3xl p-0 overflow-hidden">
        <div
          style={{
            maxHeight: `${viewportHeight * 0.9}px`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AlertDialogHeader className="p-6 pb-0">
            <AlertDialogTitle>Érdekli ez a túra?</AlertDialogTitle>
            <AlertDialogDescription>
              Kérjük, töltse ki az alábbi űrlapot, hogy több információt kaphassunk az
              érdeklődéséről. Ezt követően felvesszük Önnel a kapcsolatot a túra részleteivel
              kapcsolatban.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex-1 overflow-y-auto p-6 pt-2">
            <ContactForm
              className="space-y-4"
              showSubject={true}
              subject={title}
              onClose={handleClose}
            />
          </div>
          <div className="p-6 pt-0">
            <Button variant="outline" className="w-full" onClick={handleClose}>
              Mégse
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
