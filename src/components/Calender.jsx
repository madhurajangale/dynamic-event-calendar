import React, { useState, useEffect } from "react";
import "./styles/Calender.css";
import EventDialog from "../components/EventDialog";
import EventListDialog from "../components/Events"; // Import EventListDialog
import { Card } from "./components/ui/card";
import { CalendarSearch } from "lucide-react";
import { Dialog, DialogTrigger } from "./components/ui/dialog";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventListDialogOpen, setEventListDialogOpen] = useState(false); // New state for event list modal
  const [currentEventDate, setCurrentEventDate] = useState(null);
  const [currentEventDetails, setCurrentEventDetails] = useState(null);

  const getEventsFromLocalStorage = () => {
    const storedEvents = localStorage.getItem("calendarEvents");
    return storedEvents ? JSON.parse(storedEvents) : {};
  };

  const [events, setEvents] = useState(getEventsFromLocalStorage);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const handleDayClick = (day) => {
    const dateString = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${day}`;
    setCurrentEventDate(dateString);
    setCurrentEventDetails(null);
    setDialogOpen(true);
  };

  const handleEventClick = (event, date) => {
    setCurrentEventDate(date);
    setCurrentEventDetails(event);
    setDialogOpen(true);
  };

  const handleDeleteEvent = (eventKey) => {
    setEvents((prev) => {
      const updatedEvents = { ...prev };
      updatedEvents[currentEventDate] = updatedEvents[currentEventDate].filter(
        (event) => event.key !== eventKey
      );

      if (updatedEvents[currentEventDate].length === 0) {
        delete updatedEvents[currentEventDate];
      }

      return updatedEvents;
    });
    setDialogOpen(false);
  };

  const handleSaveEvent = (eventDetails) => {
    setEvents((prev) => ({
      ...prev,
      [currentEventDate]: [
        ...(prev[currentEventDate] || []).filter((e) => e.key !== eventDetails.key),
        { ...eventDetails, key: eventDetails.key || `${Date.now()}` },
      ],
    }));
    setDialogOpen(false);
  };

  const handleEventListClick = (dateString) => {
    setCurrentEventDate(dateString); 
    setEventListDialogOpen(true); // Open event list modal
  };

  const renderDays = () => {
    const days = [];
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDayIndex = new Date(year, month, 1).getDay();
    const today = new Date();
    const todayDateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  
    // Add blank spaces for days before the 1st of the month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`blank-${i}`} className="day blank"></div>);
    }
  
    // Loop through all days of the month and create day elements
    for (let day = 1; day <= totalDays; day++) {
      const dateString = `${year}-${month + 1}-${day}`;
      const isToday = dateString === todayDateString;
      const dayEvents = events[dateString] || [];
  
      days.push(
        <div
          key={day}
          className={`day ${dayEvents.length ? "has-event" : ""} ${isToday ? "today" : ""}`}
          onClick={() => handleDayClick(day)} // Ensure clicking triggers correct action
          style={{ cursor: "pointer" }} // Add cursor pointer to make days clickable
        >
          <div className="dayhead">
            <span>{day}</span>
            <button onClick={(e) => {
                e.stopPropagation(); 
                handleEventListClick(dateString); 
              }}  
              style={{
                
                bottom: "5px",
                right: "5px",
                padding: "5px",
                fontSize: "10px",
                backgroundColor: "transparent",
                color: "white",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
              }}>
        <CalendarSearch size={17} color="#107517" />
      </button>
          </div>
          {dayEvents.map((event) => (
            <button
              key={event.key}
              className="event-button"
              style={{ backgroundColor: event.color }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the day click
                handleEventClick(event, dateString);
              }}
            >
              {event.name}
            </button>
          ))}
        </div>
      );
    }
  
    return days;
  };
  
  const renderWeekDays = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="weekdays">
        {weekDays.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction, 1);
    setSelectedDate(newDate);
  };

  return (
    <Card className="calendar-container">
      <div className="header">
        <button onClick={() => handleMonthChange(-1)}>◀</button>
        <h2>
          {selectedDate.toLocaleString("default", { month: "long" })} {selectedDate.getFullYear()}
        </h2>
        <button onClick={() => handleMonthChange(1)}>▶</button>
      </div>
      {renderWeekDays()}
      <div className="days">{renderDays()}</div>

      

      {dialogOpen && (
        <EventDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveEvent}
          eventDetails={currentEventDetails}
          onDelete={handleDeleteEvent}
        />
      )}

      {/* Event List Modal */}
      {eventListDialogOpen && (
        <EventListDialog
          open={eventListDialogOpen}
          onClose={() => setEventListDialogOpen(false)}
          events={events[currentEventDate] || []}
        />
      )}
    </Card>
  );
};

export default Calendar;
