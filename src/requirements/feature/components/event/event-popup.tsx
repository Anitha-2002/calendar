import React, { useEffect } from 'react';
import { Modal } from '../../frameworks/modal';
import { RawDefaultProps } from 'anitha/requirements/data-models';
import GoogleMeetIcon from 'anitha/app/style/icons8-google-meet.svg';
import { format } from 'date-fns';
interface EventPopupInterface extends RawDefaultProps {
  showModal: boolean;
  handleClose: () => void;
  selectedEvent: any;
}
export const EventPopup = ({
  showModal,
  className,
  handleClose,
  selectedEvent,
}: EventPopupInterface) => {
  return (
    <Modal
      className={`justify-center ${className}`}
      isOpen={showModal}
      headerContent="Interview Details"
      onClose={handleClose}
    >
      <div className="flex justify-between bg-white min-w-40 min-h-40 divide-x-2 gap-2 border-2">
        <div className="flex flex-col p-2 items-start gap-2 text-2xl">
          <div className="text-xs text-gray-600">{`Interviewer: ${selectedEvent?.user_det?.handled_by?.firstName || 'N/A'}`}</div>
          <div className="text-xs text-gray-600">{`Position: ${selectedEvent?.job_id?.jobRequest_Title}`}</div>
          <div className="text-xs text-gray-600">{`Created By:-`}</div>
          <div className="flex flex-col items-start">
            <div className="text-xs text-gray-600">
              {`Interview Date: ${format(new Date(selectedEvent.start), 'dd MMM yyyy')}`}
            </div>

            <div className="text-xs text-gray-600">{`Interview Time: ${format(
              new Date(selectedEvent.start),
              new Date(selectedEvent.start).getMinutes() === 0
                ? 'h a'
                : 'h:mm a'
            )} - ${format(
              new Date(selectedEvent.end),
              new Date(selectedEvent.end).getMinutes() === 0 ? 'h a' : 'h:mm a'
            )}`}</div>
          </div>
          <div className="text-xs text-gray-600">{`Interview Via: Google Meet`}</div>
        </div>
        <div className="flex flex-col p-2">
          <img
            src="/google-meet.svg"
            alt="Google Meet"
            width="100"
            height="100"
            className="svg-class"
          />{' '}
          <button className="bg-blue-500 text-white rounded-sm cursor-pointer">
            <a
              href={selectedEvent.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join
            </a>
          </button>
        </div>
      </div>
    </Modal>
  );
};
