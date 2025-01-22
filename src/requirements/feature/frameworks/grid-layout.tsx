'use client';
import { PageType } from 'anitha/requirements/data-models';
import React, { useState } from 'react';
import { ButtonOutlined, ButtonOutlinedBottom, ButtonV1 } from '../components';
import {
  PageLayoutTypes,
  PageLayoutTypesData,
} from 'anitha/requirements/helpers/page-layout-constants';
import eventsData from 'anitha/data/calendar-from-to-end-date.json';
import { useCalendar } from 'anitha/requirements/helpers/context/calendar-data';
import { format } from 'date-fns';
import clsx from 'clsx';
import { EventList } from '../components/event/event-list';

export const GridLayout = () => {
  const outlinedButtonContents = ['<', '>'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [events] = useState(eventsData);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tableType, setTableType] = useState<PageType>(PageLayoutTypes.YEAR);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [selectedDayWeekEvents, setSelectedDayWeekEvents] = useState<{
    hour: string;
    events: any[];
  }>();
  const [selectedMonth, setSelectedMonth] = useState<any>();
  const [selectedHour, setSelectedHour] = useState<number>();

  const {
    selectedDate,
    setShowEventPopup,
    setSelectedEvent,
    openEventList,
    setOpenEventList,
  } = useCalendar();
  const [selectedMonthYearEvents, setSelectedMonthYearEvents] = useState<{
    day: number | Date;
    events: any[];
  }>({ day: selectedDate, events: [] });

  //get number of days in a month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  // get the first day of the month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };
  //get the start of the week (Sunday) and end of the week (Saturday)
  const getWeekRange = (date: Date) => {
    const startDate = new Date(date);
    const endDate = new Date(date);

    // adjust the start date to the previous Sunday (start of the week)
    startDate.setDate(date.getDate() - date.getDay());
    // adjust the end date to the next Saturday (end of the week)
    endDate.setDate(date.getDate() - date.getDay() + 6);

    return {
      startDate,
      endDate,
    };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
    });
  };

  //navigate to the previous or next month/week/day
  const changePeriod = (direction: number) => {
    setCurrentDate((prevDate) => {
      if (tableType === 'month') {
        const newMonth = prevDate.getMonth() + direction;
        return new Date(prevDate.getFullYear(), newMonth, 1);
      } else if (tableType === 'week') {
        return new Date(
          prevDate.getTime() + direction * 7 * 24 * 60 * 60 * 1000
        );
      } else if (tableType === 'day') {
        return new Date(prevDate.getTime() + direction * 24 * 60 * 60 * 1000);
      }
      return new Date(
        prevDate.getFullYear() + direction,
        prevDate.getMonth(),
        1
      );
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();

  const generateMonthlyCalendar = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysArray: Array<{ day: number | null; events: any[] }> = [];

    // empty slots before the first day
    for (let i = 0; i < firstDay; i++) {
      daysArray.push({ day: null, events: [] });
    }

    // add days of the month with events
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`;
      const dayEvents = events.filter((event) =>
        event.start.startsWith(currentDateString)
      );
      daysArray.push({ day: day, events: dayEvents });
    }

    // group into rows for rendering
    const rows = [];
    for (let i = 0; i < daysArray.length; i += 7) {
      rows.push(daysArray.slice(i, i + 7));
    }

    return rows;
  };

  const generateDayCalendar = (selectedDate: Date) => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === selectedDate.getFullYear() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getDate() === selectedDate.getDate()
      );
    });

    const hoursWithEvents: Array<{ hour: string; events: any[] }> = hours.map(
      (hour, index) => {
        const eventsForHour = dayEvents.filter((event) => {
          const eventHour = new Date(event.start).getHours();
          return eventHour === index;
        });
        return { hour, events: eventsForHour };
      }
    );

    return hoursWithEvents;
  };

  const generateWeekCalendar = (selectedDate: Date) => {
    const startOfWeek = selectedDate.getDate() - selectedDate.getDay();
    const daysInWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(selectedDate);
      date.setDate(startOfWeek + i);
      return date;
    });

    const daysWithEvents = daysInWeek.map((day) => {
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.start);
        const eventYear = eventDate.getFullYear();
        const eventMonth = eventDate.getMonth();
        const eventDay = eventDate.getDate();

        return (
          eventYear === day.getFullYear() &&
          eventMonth === day.getMonth() &&
          eventDay === day.getDate()
        );
      });

      return { day: day, events: dayEvents };
    });

    return daysWithEvents;
  };

  const weeklyTable = {
    hours: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    days: generateWeekCalendar(selectedDate),
  };
  function getStartOfWeek(date: Date, startDay = 0) {
    const dayOfWeek = date.getDay();
    const difference = (dayOfWeek < startDay ? 7 : 0) + dayOfWeek - startDay;
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - difference - 1);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }
  const generateYearlySchedule = () => {
    const months = [];
    const year = currentDate.getFullYear();

    for (let month = 0; month < 12; month++) {
      const daysInMonth = getDaysInMonth(year, month);
      const monthName = new Date(year, month).toLocaleString('default', {
        month: 'long',
      });

      const eventsForMonth = events.filter((event) => {
        const eventDate = new Date(event.start);
        return (
          eventDate.getFullYear() === year && eventDate.getMonth() === month
        );
      });

      const daysWithEventsCount = Array.from(
        { length: daysInMonth },
        (_, dayIndex) => {
          const day = dayIndex + 1;
          const dayEvents = eventsForMonth.filter((event) => {
            const eventDate = new Date(event.start);
            return eventDate.getDate() === day;
          });
          return { day, eventCount: dayEvents.length, events: dayEvents };
        }
      );

      months.push({ monthName, daysWithEventsCount });
    }

    // Split months into 3 rows of 4 months
    const rows = [];
    for (let i = 0; i < 12; i += 4) {
      rows.push(months.slice(i, i + 4));
    }

    return rows;
  };

  const getWeekRangeString = (date: Date) => {
    const { startDate, endDate } = getWeekRange(date);
    return `${formatDate(startDate)} to ${formatDate(endDate)}, ${year}`;
  };

  const rows =
    tableType === 'month' ? generateMonthlyCalendar(year, month) : [];
  const handleCalendarTypeButtonClick = (key: PageType) => {
    setIsClicked(!isClicked);
    setTableType(key);
  };

  const handleMonthYearClick = (dayObj: {
    day: number | null | Date;
    events: any[];
  }) => {
    console.log('clicked!');
    setOpenEventList(true);

    if (dayObj.day !== null) {
      setSelectedMonthYearEvents({
        day: dayObj.day,
        events: dayObj.events,
      });
    }
  };
  const handleDayWeekClick = (hrObj: {
    hour: string | null;
    events: any[];
  }) => {
    console.log('clicked!');
    setOpenEventList(true);

    if (hrObj.hour !== null) {
      setSelectedDayWeekEvents({
        hour: hrObj.hour,
        events: hrObj.events,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="sticky top-0 z-10 flex justify-between bg-gray-50">
        <div className="flex gap-2 items-center">
          <div className="flex gap-1 p-2">
            {outlinedButtonContents.map((content, index) => (
              <ButtonOutlined
                key={index}
                className="h-10 w-10"
                handleClick={() => {
                  changePeriod(index === 0 ? -1 : 1);
                }}
              >
                {content}
              </ButtonOutlined>
            ))}
          </div>
          <ButtonV1 className="h-10 w-10 justify-center">{date}</ButtonV1>
        </div>
        <div className="flex px-4 items-center">
          {tableType === PageLayoutTypes.WEEK ? (
            <div>{getWeekRangeString(currentDate)}</div>
          ) : tableType === PageLayoutTypes.YEAR ? (
            year
          ) : (
            currentDate.toLocaleString('default', {
              month: 'long',
              day: tableType === 'day' ? 'numeric' : undefined,
              year: 'numeric',
            })
          )}
        </div>

        <div className="flex gap-4">
          {PageLayoutTypesData.map(({ key, value }) => (
            <ButtonOutlinedBottom
              key={key}
              className="h-10 w-12 rounded-none"
              handleClick={() => handleCalendarTypeButtonClick(key)}
              outlined={tableType !== key ? false : true}
            >
              {value}
            </ButtonOutlinedBottom>
          ))}
        </div>
      </div>

      {tableType === PageLayoutTypes.MONTH && (
        <table className="sticky top-0 z-10 table-auto w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                (day, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 w-1/7 p-2 text-center text-blue-600 font-bold sticky top-0 z-10"
                  >
                    {day}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((dayObj, dayIndex) => (
                  <td
                    key={dayIndex}
                    className="py-4 px-4 text-center border border-gray-300 h-full relative"
                  >
                    {dayObj && dayObj.day ? (
                      <div>
                        <div className="font-bold">{dayObj.day}</div>
                        {dayObj.events.length > 0 ? (
                          <div className="p-3 relative">
                            <div
                              className="flex justify-center"
                              onClick={() => handleMonthYearClick(dayObj)}
                            >
                              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {dayObj.events.length}
                              </div>
                              <div
                                key={dayObj.events[0].id}
                                className="text-sm cursor-pointer shadow-lg bg-white hover:bg-blue-100 text-blue-600 p-2 rounded border-l-8 border-blue-600 w-full"
                              >
                                <div className="font-semibold">
                                  {dayObj.events[0].summary}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {'Time: ' +
                                    format(
                                      new Date(dayObj.events[0].start),
                                      new Date(
                                        dayObj.events[0].start
                                      ).getMinutes() === 0
                                        ? 'h a'
                                        : 'h:mm a'
                                    ) +
                                    '-' +
                                    format(
                                      new Date(dayObj.events[0].end),
                                      new Date(
                                        dayObj.events[0].end
                                      ).getMinutes() === 0
                                        ? 'h a'
                                        : 'h:mm a'
                                    )}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {`Interviewer: ${dayObj.events[0].user_det.handled_by.firstName}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    ) : (
                      ''
                    )}
                    {selectedMonthYearEvents &&
                      openEventList &&
                      selectedMonthYearEvents.day === dayObj.day && (
                        <EventList
                          className="absolute top-full left-0 z-50 bg-white shadow-lg border border-gray-300 p-4"
                          events={dayObj.events}
                          handleClose={() => setOpenEventList(false)}
                          handleEventClick={(event) => {
                            setShowEventPopup(true);
                            setSelectedEvent(event);
                          }}
                        />
                      )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tableType === PageLayoutTypes.DAY && (
        <div className="border-collapse flex-1 p-2">
          <table className="table-auto w-full border-collapse ">
            <tbody>
              {generateDayCalendar(currentDate).map((hourObj, index) => (
                <tr key={index} className="h-12 w-full">
                  <td className="border border-gray-300 h-12 text-center align-text-top w-32 pr-6 text-blue-600">
                    <div className="pl-6">{hourObj.hour}</div>
                  </td>
                  <td className="border border-gray-300 w-full">
                    {hourObj.events.length > 0 ? (
                      <div className="p-1">
                        <div className="ml-10 p-3 relative w-48 ">
                          <div
                            key={hourObj.events[0].id}
                            className="text-sm cursor-pointer shadow-lg bg-white hover:bg-blue-100 text-blue-600 p-2 rounded border-l-8 border-blue-600"
                            onClick={() => {
                              console.log(
                                'Event object before setting in state:',
                                JSON.stringify(hourObj.events[0])
                              );
                              handleDayWeekClick(hourObj);
                              setSelectedEvent(event);
                            }}
                          >
                            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                              {hourObj.events.length}
                            </div>
                            <div className="font-semibold">
                              {hourObj.events[0].summary}
                            </div>
                            <div className="text-xs text-gray-600">
                              {'Time: ' +
                                format(
                                  new Date(hourObj.events[0].start),
                                  new Date(
                                    hourObj.events[0].start
                                  ).getMinutes() === 0
                                    ? 'h a'
                                    : 'h:mm a'
                                ) +
                                '-' +
                                format(
                                  new Date(hourObj.events[0].end),
                                  new Date(
                                    hourObj.events[0].end
                                  ).getMinutes() === 0
                                    ? 'h a'
                                    : 'h:mm a'
                                )}
                            </div>
                            <div className="text-xs text-gray-600">
                              {`Interviewer: ${hourObj.events[0].user_det.handled_by.firstName}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                    {selectedDayWeekEvents &&
                      openEventList &&
                      selectedDayWeekEvents.hour === hourObj.hour && (
                        <EventList
                          className="absolute top-auto ml-8 z-50 bg-white shadow-lg border border-gray-300 p-4"
                          events={hourObj.events}
                          handleClose={() => setOpenEventList(false)}
                          handleEventClick={(event) => {
                            setShowEventPopup(true);
                            setSelectedEvent(event);
                          }}
                        />
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tableType === PageLayoutTypes.WEEK && (
        <div className="flex-1 p-2">
          <table className="h-full w-full table-auto border-collapse">
            <thead>
              <tr>
                {[''].concat(daysOfWeek).map((day, index) => {
                  const startOfWeek = getStartOfWeek(currentDate); // Get the week's start date
                  const date = new Date(startOfWeek);
                  date.setDate(startOfWeek.getDate() + index); // Add days to get each day's date

                  return (
                    <th
                      key={index}
                      className="border p-2 w-1/8 text-center font-light border-gray-300"
                    >
                      {index > 0 && (
                        <div>
                          {date.toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </div>
                      )}
                      {day}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {weeklyTable.hours.map((hour, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 h-12 w-32 text-center text-blue-600 align-text-top">
                    {hour}
                  </td>
                  {generateWeekCalendar(currentDate).map(
                    (dayWithEvents, dayIndex) => {
                      const dayEvents = {
                        day: dayWithEvents.day,
                        events: dayWithEvents.events.filter(
                          (event) => new Date(event.start).getHours() === index
                        ),
                      };

                      return (
                        <td key={dayIndex} className="border border-gray-300">
                          {dayEvents.events.length > 0 && (
                            <div className="p-1">
                              <div className="p-3 relative max-w-sm">
                                <div
                                  key={dayEvents.events[0].id}
                                  className="text-sm cursor-pointer shadow-lg bg-white hover:bg-blue-100 text-blue-600 p-2 rounded border-l-8 border-blue-600"
                                  onClick={() => {
                                    handleMonthYearClick(dayEvents);
                                    setSelectedHour(index);
                                  }}
                                >
                                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                    {dayEvents.events.length}
                                  </div>
                                  <div className="font-semibold">
                                    {dayEvents.events[0].summary}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {'Time: ' +
                                      format(
                                        new Date(dayEvents.events[0].start),
                                        new Date(
                                          dayEvents.events[0].start
                                        ).getMinutes() === 0
                                          ? 'h a'
                                          : 'h:mm a'
                                      ) +
                                      '-' +
                                      format(
                                        new Date(dayEvents.events[0].end),
                                        new Date(
                                          dayEvents.events[0].end
                                        ).getMinutes() === 0
                                          ? 'h a'
                                          : 'h:mm a'
                                      )}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {`Interviewer: ${dayEvents.events[0].user_det.handled_by.firstName}`}
                                  </div>
                                </div>
                              </div>
                              {openEventList &&
                                selectedHour === index &&
                                selectedMonthYearEvents.day instanceof Date &&
                                selectedMonthYearEvents.day.getTime() ===
                                  dayEvents.day.getTime() && (
                                  <EventList
                                    className="absolute top-auto ml-8 z-50 bg-white shadow-lg border border-gray-300 p-4"
                                    events={dayEvents.events}
                                    handleClose={() => setOpenEventList(false)}
                                    handleEventClick={(event) => {
                                      setShowEventPopup(true);
                                      setSelectedEvent(event);
                                    }}
                                  />
                                )}
                            </div>
                          )}
                        </td>
                      );
                    }
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tableType === PageLayoutTypes.YEAR && (
        <div className="gap-4 relative">
          {generateYearlySchedule().map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((month, monthIndex) => (
                <div
                  key={monthIndex}
                  className="justify-center items-center  p-4 w-1/4 h-80"
                >
                  <div className="text-center font-bold text-blue-600">
                    {month.monthName}
                  </div>
                  <div className="grid grid-cols-7 gap-1 mt-2">
                    {month.daysWithEventsCount.map((dayObj) => (
                      <div
                        key={dayObj.day}
                        className="text-center p-1 cursor-pointer relative"
                      >
                        <div
                          className={clsx(
                            dayObj.eventCount > 0
                              ? 'bg-blue-500 text-white'
                              : '',
                            'flex items-center justify-center h-10 w-10 rounded-full'
                          )}
                          onClick={() => {
                            handleMonthYearClick(dayObj);
                            setSelectedMonth(month);
                          }}
                        >
                          {dayObj.day}
                          {dayObj.eventCount > 0 && (
                            <sup className="text-xs text-red-600 bg-gray-100 rounded-full px-1">
                              {dayObj.eventCount}
                            </sup>
                          )}
                        </div>

                        {selectedMonth &&
                          selectedMonth.monthName &&
                          selectedMonthYearEvents &&
                          openEventList &&
                          selectedMonthYearEvents.day === dayObj.day &&
                          selectedMonth.monthName === month.monthName && (
                            <EventList
                              className="absolute top-full left-0 z-50 bg-white shadow-lg border border-gray-300 p-4"
                              events={dayObj.events}
                              handleClose={() => setOpenEventList(false)}
                              handleEventClick={(event) => {
                                setShowEventPopup(true);
                                setSelectedEvent(event);
                              }}
                            />
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
