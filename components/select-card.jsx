// components/select-card.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, MoreVertical } from "lucide-react";

export default function SelectCard({ selectedItem }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className=" flex items-center">
            <Pencil size={18} className="mr-2 " />
            Cím módosítása
          </CardTitle>
          <MoreVertical size={18} className=" text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p>{selectedItem ? selectedItem.cim : "No item selected"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Leírás módosítása</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{selectedItem ? selectedItem.leiras : "No item selected"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Dátum módosítása</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Dátum</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Nehézség módosítása</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{selectedItem ? selectedItem.nehezseg : "No item selected"}</p>
        </CardContent>
      </Card>
    </div>
  );
}
