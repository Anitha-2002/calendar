'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { isSameDay } from 'date-fns';

// interface Event {
//   id: number;
//   summary: string;
//   desc: string;
//   start: string;
//   end: string;
// }

interface CalendarContextState {
  events: any[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedEvent: any;
  setSelectedEvent: (event: any) => void;
  showEventPopup: boolean;
  setShowEventPopup: (show: boolean) => void;
  openEventList: boolean;
  setOpenEventList: (open: boolean) => void;
  getEventsForDate: (date: Date) => any[];
}

const CalendarContext = createContext<CalendarContextState | undefined>(
  undefined
);

interface CalendarProviderProps {
  children: ReactNode;
  initialEvents: any[];
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
  initialEvents,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState({});
  const [showEventPopup, setShowEventPopup] = useState<boolean>(false);
  const [openEventList, setOpenEventList] = useState<boolean>(false);

  const getEventsForDate = (date: Date) => {
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
        selectedEvent,
        setSelectedEvent,
        openEventList,
        setOpenEventList,
        getEventsForDate,
        showEventPopup,
        setShowEventPopup,
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
