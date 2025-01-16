'use client';
import { RawDefaultProps } from 'anitha/requirements/data-models';
import React, { createContext, useContext, useState } from 'react';

interface Event {
  id: number;
  summary: string;
  start: string;
  end: string;
  link: string;
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: number) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context)
    throw new Error('useEvents must be used within an EventProvider');
  return context;
};

export const EventProvider: React.FC<RawDefaultProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  const addEvent = (event: Event) => setEvents((prev) => [...prev, event]);

  const updateEvent = (updatedEvent: Event) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  };

  const deleteEvent = (id: number) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent }}
    >
      {children}
    </EventContext.Provider>
  );
};
