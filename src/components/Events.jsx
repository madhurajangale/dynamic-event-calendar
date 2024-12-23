import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { Button } from "./components/ui/button";

const EventListDialog = ({ open, onClose, events }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Events</DialogTitle>
          <DialogDescription>List of events for the selected day</DialogDescription>
        </DialogHeader>
        {events.length === 0 ? (
          <p>No events for this day.</p>
        ) : (
          <ul>
            {events.map((event) => (
              <li key={event.key}>
                <strong>{event.name}</strong>: {event.startTime} - {event.endTime}
              </li>
            ))}
          </ul>
        )}
        <div style={{ textAlign: "right", marginTop: "16px" }}>
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventListDialog;
