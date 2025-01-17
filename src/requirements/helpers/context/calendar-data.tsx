'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { isSameDay } from 'date-fns';

interface Event {
  id: number;
  summary: string;
  desc: string;
  start: string;
  end: string;
}

interface CalendarContextState {
  events: Event[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  getEventsForDate: (date: Date) => Event[];
}

const CalendarContext = createContext<CalendarContextState | undefined>(
  undefined
);

interface CalendarProviderProps {
  children: ReactNode;
  initialEvents: Event[];
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
  initialEvents,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getEventsForDate = (date: Date): Event[] => {
    return initialEvents.filter((event) =>
      isSameDay(new Date(event.start), date)
    );
  };

  return (
    <CalendarContext.Provider
      value={{
        events: initialEvents,
        selectedDate,
        setSelectedDate,
        getEventsForDate,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

// Hook for consuming the context
export const useCalendar = (): CalendarContextState => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
