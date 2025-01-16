import React from 'react';
import Calendar from './calendar';
import { CalendarProvider } from 'anitha/requirements/helpers/context/calendar-data';
import events from '../data/calendar-from-to-end-date.json';
import { EventProvider } from 'anitha/requirements/helpers/context/context-data';

const App = () => {
  return (
    <CalendarProvider initialEvents={events}>
      <Calendar />
    </CalendarProvider>
  );
};

export default App;
