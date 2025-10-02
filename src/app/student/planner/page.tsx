"use client"; // must be at the top

import React, { useState } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  View as CalendarView,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

// --- Setup date-fns localizer ---
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// --- Calendar Event type ---
interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  type: string;
}

const CalendarPage: React.FC = () => {
  const [view, setView] = useState<CalendarView>("month");
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "Math Tutoring",
      start: new Date(2025, 9, 5, 10, 0),
      end: new Date(2025, 9, 5, 12, 0),
      allDay: false,
      color: "#1E90FF",
      type: "Tutoring",
    },
    {
      id: 2,
      title: "Physics Study Group",
      start: new Date(2025, 9, 7, 14, 0),
      end: new Date(2025, 9, 7, 16, 0),
      allDay: false,
      color: "#32CD32",
      type: "Study",
    },
  ]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = prompt("Enter event title");
    if (title) {
      const newEvent: CalendarEvent = {
        id: events.length + 1,
        title,
        start,
        end,
        allDay: false,
        type: "Custom",
        color: "#FF6347",
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    alert(`Event: ${event.title}\nType: ${event.type}`);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const backgroundColor = event.color || "#3174ad";
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        color: "white",
        border: "0px",
        padding: "2px 5px",
      },
    };
  };

  return (
    <div style={{ height: "90vh", margin: "20px" }}>
      <h1>My Calendar</h1>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        defaultView={view}
        views={["month", "week", "day", "work_week"] as CalendarView[]}
        onView={(v: CalendarView) => setView(v)}
        eventPropGetter={eventStyleGetter}
        style={{ height: "100%" }}
      />
      <p>
        Don&apos;t forget to add your custom events and track your learning
        progress!
      </p>
    </div>
  );
};

export default CalendarPage;
