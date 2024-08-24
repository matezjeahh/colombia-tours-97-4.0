"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./contact-form";

export function DrawerDialogForm({ title }) {
  const [open, setOpen] = useState(false);

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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Érdekli ez a túra?</AlertDialogTitle>
          <AlertDialogDescription>
            Kérjük, töltse ki az alábbi űrlapot, hogy több információt kaphassunk az érdeklődéséről.
            Ezt követően felvesszük Önnel a kapcsolatot a túra részleteivel kapcsolatban.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ContactForm
          className="space-y-4"
          showSubject={true}
          subject={title}
          onClose={handleClose}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Mégse</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
