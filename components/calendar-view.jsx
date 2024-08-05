// components/CalendarView.jsx
import React from "react";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"; // Hypothetical imports from shadcn

const CalendarView = ({ trips }) => {
  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <div key={trip.id} className="flex items-center space-x-4">
          <div className="bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center">
            <span>Sep</span>
          </div>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>{trip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {trip.startDate} - {trip.endDate}
              </p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

const getColorForMonth = (date) => {
  const month = date.getMonth();
  switch (month) {
    case 0:
    case 1:
    case 2:
      return "bg-blue-500";
    case 3:
    case 4:
    case 5:
      return "bg-green-500";
    case 6:
    case 7:
    case 8:
      return "bg-yellow-500";
    case 9:
    case 10:
    case 11:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export default CalendarView;
