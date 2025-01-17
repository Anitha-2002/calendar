// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import eventsData from 'anitha/data/calendar-from-to-end-date.json';
import { ISOStringFormat } from 'date-fns';

export interface UIEventsDataType {
  id: number;
  summary: ISOStringFormat;
  start: string;
  end: string;
  link: string;
  jobTitle: string;
  interviewerName: string;
}
export const BackendEventToUIEvent = (eventsData: any) => {
  return eventsData.map((event: any) => ({
    id: event.id,
    summary: event.summary,
    start: event.start.dateTime,
    end: event.end.dateTime,
    link: event.htmlLink,
    jobTitle: event.job_id.jobRequest_Title,
    interviewerName: event.user_det.handled_by.firstName,
  }));
};

export const UIEventsData: UIEventsDataType[] =
  BackendEventToUIEvent(eventsData);
