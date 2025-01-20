import React from 'react';
import { format } from 'date-fns';
import { RawDefaultProps } from 'anitha/requirements/data-models';
import { EventPopup } from './event-popup';
import { useCalendar } from 'anitha/requirements/helpers/context/calendar-data';
export const EventList = ({
  events,
  handleClose,
  handleEventClick,
  className,
}: {
  events: any[];
  handleClose: () => void;
  handleEventClick: (event: any) => void;
} & RawDefaultProps) => {
  const { showEventPopup, selectedEvent, setShowEventPopup, setOpenEventList } =
    useCalendar();

  return (
    <>
      <div
        className={`flex flex-col rounded-md bg-white p-2 gap-2 z-50 min-w-40 shadow-lg ${className}`}
      >
        <div className="flex justify-between">
          <div>Meetings</div>
          <div
            className="h-6 w-6 rounded-full border font-extrabold border-blue-500 bg-white cursor-pointer text-blue-500 flex items-center justify-center hover:text-white hover:bg-blue-500"
            onClick={() => handleClose()}
          >
            &times;
          </div>
        </div>
        <div className="max-h-[7rem] overflow-y-auto pr-2">
          {events.map((event: any) => (
            <div key={event.id}>
              <div
                className="text-sm cursor-pointer outline-gray-200 bg-white hover:bg-blue-100 text-blue-600 p-2 rounded border-l-8 border-blue-600 w-32"
                onClick={() => handleEventClick(event)}
              >
                <div className="font-semibold">{event.summary}</div>
                <div className="text-xs text-gray-600">
                  {'Time: ' +
                    format(
                      new Date(event.start),
                      new Date(event.start).getMinutes() === 0
                        ? 'h a'
                        : 'h:mm a'
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
          {showEventPopup && (
            <EventPopup
              selectedEvent={selectedEvent}
              showModal={showEventPopup}
              handleClose={() => {
                setShowEventPopup(false);
                setOpenEventList(false);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};
