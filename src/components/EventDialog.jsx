import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

const EventDialog = ({ open, onClose, onSave, onDelete, eventDetails }) => {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#FF0000"); // Default color

  useEffect(() => {
    if (eventDetails) {
      setName(eventDetails.name || "");
      setStartTime(eventDetails.startTime || "");
      setEndTime(eventDetails.endTime || "");
      setDescription(eventDetails.description || "");
      setColor(eventDetails.color || "#FF0000"); // Set color if editing an event
    } else {
      setName("");
      setStartTime("");
      setEndTime("");
      setDescription("");
      setColor("#FF0000"); // Default color for new events
    }
  }, [eventDetails]);

  const handleSave = () => {
    onSave({
      name,
      startTime,
      endTime,
      description,
      color, // Include the color in the event data
      key: eventDetails?.key,
    });
  };

  const handleDelete = () => {
    if (eventDetails?.key) {
      onDelete(eventDetails.key);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{eventDetails ? "Edit Event" : "Add Event"}</DialogTitle>
          <DialogDescription>
            {eventDetails ? "Update the details of your event." : "Fill out the details for the new event."}
          </DialogDescription>
        </DialogHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Label htmlFor="name">Event Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />

          <Label htmlFor="startTime">Start Time</Label>
          <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

          <Label htmlFor="endTime">End Time</Label>
          <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

          <Label htmlFor="description">Description</Label>
          <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />

          <Label htmlFor="color">Event Color</Label>
          <input 
            type="color" 
            id="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
            style={{ width: "40px", height: "40px" }}
          />
        </div>
        <div style={{ marginTop: "16px", textAlign: "right" }}>
          {eventDetails?.key && (
            <Button onClick={handleDelete} variant="destructive" style={{ marginRight: "8px" }}>
              Delete
            </Button>
          )}
          <Button onClick={onClose} variant="secondary" style={{ marginRight: "8px" }}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
