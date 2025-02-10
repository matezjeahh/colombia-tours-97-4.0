"use client";

import { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/hu";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("hu");

const localizer = momentLocalizer(moment);
localizer.segmentOffset = 0;

const MyCalendar = ({ trips = [] }) => {
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const events = Array.isArray(trips)
    ? trips.map((trip) => {
        const start = moment(trip.startDate, "YYYY.MM.DD", true).toDate();
        const end = moment(trip.endDate, "YYYY.MM.DD", true).toDate();
        console.log(`Trip: ${trip.name}, Start: ${start}, End: ${end}`);
        return {
          title: trip.name,
          start,
          end,
        };
      })
    : [];

  console.log("Events:", events);

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        defaultView={view}
        view={view}
        date={date}
        onView={(view) => setView(view)}
        onNavigate={(date) => setDate(new Date(date))}
        startAccessor="start"
        endAccessor="end"
        culture="hu"
        formats={{
          weekdayFormat: (date, culture, localizer) => localizer.format(date, "dddd", culture),
        }}
        firstDayOfWeek={1}
        style={{ height: "100%" }}
      />
    </div>
  );
};

export default MyCalendar;
