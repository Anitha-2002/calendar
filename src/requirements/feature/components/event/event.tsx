import { UIEventsDataType } from 'anitha/requirements/adapter/event-data';
import { format } from 'date-fns';
import React from 'react';

interface EventComponentProps {
  eventObject: UIEventsDataType;
}

export const EventComponent = ({ eventObject }: EventComponentProps) => {
  const startTime = new Date(eventObject.start);
  const endTime = new Date(eventObject.end);

  const formatTime = (date: Date) =>
    format(date, date.getMinutes() === 0 ? 'h a' : 'h:mm a');

  return (
    <div className="text-sm cursor-pointer shadow-lg bg-white hover:bg-blue-100 text-blue-600 p-2 rounded border-l-8 border-blue-600">
      <div className="font-semibold">{eventObject.summary}</div>
      <div className="text-xs text-gray-600">
        {'Time: ' + formatTime(startTime) + '-' + formatTime(endTime)}
      </div>
      <div className="text-xs text-gray-600">
        {`Interviewer: ${eventObject.interviewerName}`}
      </div>
    </div>
  );
};
