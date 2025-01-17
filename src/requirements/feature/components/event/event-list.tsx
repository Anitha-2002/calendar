import React from 'react';
import { format } from 'date-fns';
import { RawDefaultProps } from 'anitha/requirements/data-models';
import { EventPopup } from './event-popup';
export const EventList = ({
  events,
  handleClose,
  className,
}: {
  events: any[];
  handleClose: () => void;
} & RawDefaultProps) => {
  const [showEventPopup, setShowEventPopup] = React.useState<boolean>(false);
  return (
    <div
      className={`flex flex-col rounded-md bg-white p-2 z-50 min-w-40 shadow-lg ${className}`}
    >
      <div className="flex justify-between">
        <div>Meetings</div>
        <div
          className="h-6 w-6 rounded-full bg-blue-500 cursor-pointer text-white flex items-center justify-center hover:bg-white hover:text-blue-500"
          onClick={() => handleClose()}
        >
          x
        </div>
      </div>
      <div className="max-h-[7rem] overflow-y-auto pr-2">
        {events.map((event: any) => (
          <div key={event.id}>
            <div
              className="text-sm cursor-pointer outline-gray-200 bg-white hover:bg-blue-100 text-blue-600 p-2 rounded border-l-8 border-blue-600 w-32"
              onClick={() => setShowEventPopup(true)}
            >
              <div className="font-semibold">{event.summary}</div>
              <div className="text-xs text-gray-600">
                {'Time: ' +
                  format(
                    new Date(event.start),
                    new Date(event.start).getMinutes() === 0 ? 'h a' : 'h:mm a'
                  ) +
                  '-' +
                  format(
                    new Date(event.end),
                    new Date(event.end).getMinutes() === 0 ? 'h a' : 'h:mm a'
                  )}
              </div>
              <div className="text-xs text-gray-600">
                {`Interviewer: ${event.user_det.handled_by.firstName}`}
              </div>
            </div>
            <hr />
          </div>
        ))}
        {showEventPopup && <EventPopup />}
      </div>
    </div>
  );
};
