'use client';
import { PageType } from 'anitha/requirements/data-models';
import React, { useEffect, useState } from 'react';
import { ButtonOutlined, ButtonOutlinedBottom, ButtonV1 } from '../components';
import {
  PageLayoutTypes,
  PageLayoutTypesData,
} from 'anitha/requirements/helpers/page-layout-constants';
import eventsData from 'anitha/data/calendar-from-to-end-date.json';
import { useCalendar } from 'anitha/requirements/helpers/context/calendar-data';

// interface GridLayoutProps {}

export const GridLayout = () => {
  const outlinedButtonContents = ['<', '>'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [events, setEvents] = useState(eventsData);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tableType, setTableType] = useState<PageType>(PageLayoutTypes.YEAR);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [selectedDayEvents, setSelectedEvents] = useState<any[]>([]);

  const { selectedDate, setSelectedDate, getEventsForDate } = useCalendar();
  //get number of days in a month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  // get the first day of the month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };
  // get the start of the week (Sunday) and end of the week (Saturday)
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
  const month = currentDate.getMonth(); // 0 = January, 11 = December
  const date = currentDate.getDate();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const generateMonthlyCalendar = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysArray: Array<{ date: number | null; events: any[] }> = [];

    // Empty slots before the first day
    for (let i = 0; i < firstDay; i++) {
      daysArray.push({ date: null, events: [] });
    }

    // Add days of the month with events
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`;
      const dayEvents = events.filter((event) =>
        event.start.startsWith(currentDateString)
      );
      daysArray.push({ date: day, events: dayEvents });
    }

    // Group into rows for rendering
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
    const startOfWeek = selectedDate.getDate() - selectedDate.getDay(); // Get the starting day of the week
    const daysInWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(selectedDate);
      date.setDate(startOfWeek + i);
      return date;
    });

    const daysWithEvents = daysInWeek.map((day) => {
      const dayEvents = events.filter((event) => {
        // Make sure the event's year, month, and date match the current day in the week
        const eventDate = new Date(event.start);
        const eventYear = eventDate.getFullYear();
        const eventMonth = eventDate.getMonth();
        const eventDay = eventDate.getDate();

        // Only select events from the same year, month, and date
        return (
          eventYear === day.getFullYear() &&
          eventMonth === day.getMonth() &&
          eventDay === day.getDate()
        );
      });

      return { date: day, events: dayEvents };
    });

    return daysWithEvents;
  };

  const weeklyTable = {
    hours: Array.from({ length: 24 }, (_, i) => `${i}:00`), // Hours from 0:00 to 23:00
    days: generateWeekCalendar(selectedDate), // Calls the generateWeekCalendar to get the days of the week and their events
  };

  // const generateYearlySchedule = () => {
  //   const months = [];
  //   const year = currentDate.getFullYear();

  //   for (let month = 0; month < 12; month++) {
  //     const daysInMonth = getDaysInMonth(year, month);
  //     months.push({
  //       monthName: new Date(year, month).toLocaleString('default', {
  //         month: 'long',
  //       }),
  //       daysInMonth,
  //     });
  //   }

  //   //split months into 3 rows of 4 months
  //   const rows = [];
  //   for (let i = 0; i < 12; i += 4) {
  //     rows.push(months.slice(i, i + 4));
  //   }

  //   return rows;
  // };
  const generateYearlySchedule = () => {
    const months = [];
    const year = currentDate.getFullYear();

    for (let month = 0; month < 12; month++) {
      const daysInMonth = getDaysInMonth(year, month);
      const monthName = new Date(year, month).toLocaleString('default', {
        month: 'long',
      });

      // Get events for the month and for each day in the month
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

  const getEventsForDay = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    return eventsData.filter((event) => event.start.startsWith(dateString));
  };

  const handleDayClick = (dayObj: { day: number; events: any[] }) => {
    const selectedDayEvents = dayObj.events;

    // You can display the event details in a modal or a side panel.
    // For simplicity, we'll log the event details to the console.
    console.log(`Events for day ${dayObj.day}:`, selectedDayEvents);

    // You can also store the event details in a state and use it to show the details in your component.
    setSelectedEvents(selectedDayEvents); // Assuming `setSelectedEvents` sets the state of events to display
  };

  useEffect(() => {
    console.log('tableType: ', tableType);
    console.log('eventsData: ', eventsData);
    console.log('selectedDate: ', selectedDate);
    console.log('eventsForDay: ', getEventsForDate(selectedDate));
  }, [tableType, selectedDate]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between">
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
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                (day, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 p-2 text-center text-blue-600 font-bold"
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
                {week.map((day, dayIndex) => (
                  <td
                    key={dayIndex}
                    className="py-4 px-4 text-center border-b border-r"
                  >
                    {day.date ? (
                      <div>
                        <div className="font-bold">{day.date}</div>
                        {day.events.length > 0 ? (
                          <ul className="mt-2 text-sm text-gray-700">
                            {day.events.map((event) => (
                              <li key={event.id} className="my-1 text-blue-600">
                                {event.summary}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          ''
                        )}
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tableType === PageLayoutTypes.DAY && (
        <div className="overflow-hidden max-h-[900px] border border-collapse">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <tbody className="flex flex-col max-h-[900px] overflow-y-auto">
              {generateDayCalendar(currentDate).map((hourObj, index) => (
                <tr key={index} className="h-12">
                  <td className="border border-gray-300 h-12 text-center align-text-top w-32 text-blue-600">
                    {hourObj.hour}
                  </td>
                  <td className="border border-gray-300 flex-1">
                    {hourObj.events.length > 0 ? (
                      <ul className="space-y-1">
                        {hourObj.events.map((event) => (
                          <li key={event.id} className="text-sm text-blue-600">
                            <a href={event.link} className="underline">
                              {event.summary}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 text-xs">No events</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tableType === PageLayoutTypes.WEEK && (
        <table className="table-auto w-full border-collapse border">
          <thead>
            <tr>
              {[''].concat(daysOfWeek).map((day, index) => (
                <th
                  key={index}
                  className="border p-2  text-center font-bold text-blue-600 border-gray-300"
                >
                  {day}
                </th>
              ))}
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
                    const dayEvents = dayWithEvents.events.filter(
                      (event) => new Date(event.start).getHours() === index
                    );

                    return (
                      <td
                        key={dayIndex}
                        className="border border-gray-300 flex-grow relative"
                      >
                        {dayEvents.length > 0 && (
                          <div className="absolute inset-0 p-1">
                            {dayEvents.map((event) => (
                              <div
                                key={event.id}
                                className="text-sm bg-blue-100 text-blue-600 p-2 m-1 rounded"
                                onClick={() =>
                                  handleDayClick(dayWithEvents as any)
                                } // Event click handler
                              >
                                <div className="font-semibold">
                                  {event.summary}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {new Date(event.start).toLocaleTimeString(
                                    [],
                                    {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </div>
                              </div>
                            ))}
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
      )}
      {tableType === PageLayoutTypes.YEAR && (
        <div className="gap-4">
          {generateYearlySchedule().map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((month, monthIndex) => (
                <div
                  key={monthIndex}
                  className="justify-center items-center border border-gray-300 p-4 w-1/4 h-80"
                >
                  <div className="text-center font-bold text-blue-600">
                    {month.monthName}
                  </div>
                  <div className="grid grid-cols-7 gap-1 mt-2">
                    {month.daysWithEventsCount.map((dayObj) => (
                      <div
                        key={dayObj.day}
                        className="text-center p-1 cursor-pointer"
                        onClick={() => handleDayClick(dayObj)}
                      >
                        <div>
                          {dayObj.day}
                          {dayObj.eventCount > 0 && (
                            <sup className="text-xs text-red-600">
                              {dayObj.eventCount}
                            </sup>
                          )}
                        </div>
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
