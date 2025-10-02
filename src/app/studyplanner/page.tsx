"use client";

import React, { useState, useEffect } from "react";
import { View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import BigCalendar from "@/components/BigCalender";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  color: string;
}

const PRESET_COLORS = [
  { name: "Blue", value: "#3b82f6", light: "#dbeafe" },
  { name: "Red", value: "#ef4444", light: "#fee2e2" },
  { name: "Green", value: "#10b981", light: "#d1fae5" },
  { name: "Yellow", value: "#f59e0b", light: "#fef3c7" },
  { name: "Purple", value: "#8b5cf6", light: "#ede9fe" },
  { name: "Pink", value: "#ec4899", light: "#fce7f3" },
  { name: "Indigo", value: "#6366f1", light: "#e0e7ff" },
  { name: "Teal", value: "#14b8a6", light: "#ccfbf1" },
];

const EVENT_TYPES = [
  { name: "Study Session", icon: "📚", color: "#3b82f6" },
  { name: "Assignment", icon: "✏️", color: "#ef4444" },
  { name: "Exam", icon: "📝", color: "#f59e0b" },
  { name: "Project", icon: "💻", color: "#8b5cf6" },
  { name: "Meeting", icon: "👥", color: "#10b981" },
  { name: "Break", icon: "☕", color: "#ec4899" },
  { name: "Other", icon: "📌", color: "#6366f1" },
];

const StudyPlannerPage = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<View>(Views.WEEK);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    allDay: false,
    color: "#3b82f6",
    type: "Study Session",
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/calendar");
        if (response.ok) {
          const data = await response.json();
          const formattedEvents = data.map((event: any) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load calendar events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [session]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setShowModal(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description || "",
      allDay: event.allDay,
      color: event.color,
      type:
        EVENT_TYPES.find((t) => t.color === event.color)?.name ||
        "Study Session",
    });
    setSelectedSlot({ start: event.start, end: event.end });
  };

  const updateEvent = async () => {
    if (!eventForm.title || !editingEvent) {
      toast.error("Please enter an event title");
      return;
    }

    try {
      const response = await fetch(`/api/calendar/${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: eventForm.title,
          description: eventForm.description,
          start: selectedSlot?.start || editingEvent.start,
          end: selectedSlot?.end || editingEvent.end,
          allDay: eventForm.allDay,
          color: eventForm.color,
        }),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === editingEvent.id
              ? {
                  ...updatedEvent,
                  start: new Date(updatedEvent.start),
                  end: new Date(updatedEvent.end),
                }
              : event
          )
        );
        toast.success("Event updated successfully!");
        setEditingEvent(null);
        setSelectedEvent(null);
        setEventForm({
          title: "",
          description: "",
          allDay: false,
          color: "#3b82f6",
          type: "Study Session",
        });
      } else {
        toast.error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };

  const duplicateEvent = async (event: CalendarEvent) => {
    try {
      const newStart = new Date(event.start);
      newStart.setDate(newStart.getDate() + 7); // Duplicate to next week
      const newEnd = new Date(event.end);
      newEnd.setDate(newEnd.getDate() + 7);

      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: event.title + " (Copy)",
          description: event.description,
          start: newStart,
          end: newEnd,
          allDay: event.allDay,
          color: event.color,
        }),
      });

      if (response.ok) {
        const newEvent = await response.json();
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            ...newEvent,
            start: new Date(newEvent.start),
            end: new Date(newEvent.end),
          },
        ]);
        toast.success("Event duplicated to next week!");
      } else {
        toast.error("Failed to duplicate event");
      }
    } catch (error) {
      console.error("Error duplicating event:", error);
      toast.error("Failed to duplicate event");
    }
  };

  const exportCalendar = () => {
    const calendarData = events.map((event) => ({
      title: event.title,
      description: event.description,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      allDay: event.allDay,
      color: event.color,
    }));

    const dataStr = JSON.stringify(calendarData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `study-planner-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    toast.success("Calendar exported successfully!");
  };

  const createEvent = async () => {
    if (!eventForm.title || !selectedSlot) {
      toast.error("Please enter an event title");
      return;
    }

    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: eventForm.title,
          description: eventForm.description,
          start: selectedSlot.start,
          end: selectedSlot.end,
          allDay: eventForm.allDay,
          color: eventForm.color,
        }),
      });

      if (response.ok) {
        const newEvent = await response.json();
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            ...newEvent,
            start: new Date(newEvent.start),
            end: new Date(newEvent.end),
          },
        ]);
        toast.success("Event created successfully!");
        setShowModal(false);
        setEventForm({
          title: "",
          description: "",
          allDay: false,
          color: "#3b82f6",
          type: "Study Session",
        });
      } else {
        toast.error("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };

  const deleteEvent = async (eventId: number) => {
    try {
      const response = await fetch(`/api/calendar/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
        toast.success("Event deleted successfully!");
        setSelectedEvent(null);
      } else {
        toast.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Study Planner & Organizer 📚</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={exportCalendar}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export Calendar
        </button>
      </div>

      {loading ? (
        <p>Loading calendar...</p>
      ) : (
        <BigCalendar
          events={events.filter((event) =>
            filterType === "all" ? true : event.type === filterType
          )}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          view={view}
          onView={(v) => setView(v)}
          views={["month", "week", "day"]}
          style={{ height: "80vh" }}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Event</h2>
            <input
              type="text"
              placeholder="Event title"
              value={eventForm.title}
              onChange={(e) =>
                setEventForm({ ...eventForm, title: e.target.value })
              }
              className="border p-2 w-full mb-2 rounded"
            />
            <textarea
              placeholder="Description"
              value={eventForm.description}
              onChange={(e) =>
                setEventForm({ ...eventForm, description: e.target.value })
              }
              className="border p-2 w-full mb-2 rounded"
            />
            <div className="flex justify-between mb-2">
              <label>
                <input
                  type="checkbox"
                  checked={eventForm.allDay}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, allDay: e.target.checked })
                  }
                />
                All day
              </label>
              <select
                value={eventForm.type}
                onChange={(e) =>
                  setEventForm({ ...eventForm, type: e.target.value })
                }
                className="border p-1 rounded"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type.name} value={type.name}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={createEvent}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>
            <p className="mb-2">
              {selectedEvent.description || "No description provided."}
            </p>
            <p className="mb-2">
              From: {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm a")}
            </p>
            <p className="mb-4">
              To: {moment(selectedEvent.end).format("MMMM Do YYYY, h:mm a")}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => duplicateEvent(selectedEvent)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Duplicate
              </button>
              <button
                onClick={() => deleteEvent(selectedEvent.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => handleEditEvent(selectedEvent)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlannerPage;
