'use client';
import {
  PageLayoutTypesData,
  PageLayoutTypes,
} from 'anitha/requirements/data-models';
import React, { useEffect, useState } from 'react';
import { ButtonOutlined, ButtonOutlinedBottom, ButtonV1 } from '../components';

type pageType = (typeof PageLayoutTypes)[keyof typeof PageLayoutTypes];

interface GridLayoutProps {}

export const GridLayout: React.FC<GridLayoutProps> = ({}) => {
  const outlinedButtonContents = ['<', '>'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tableType, setTableType] = useState<pageType>(PageLayoutTypes.YEAR);
  const [isClicked, setIsClicked] = useState<boolean>(false);

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
      return prevDate;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 = January, 11 = December
  const date = currentDate.getDate();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  //generate the monthly calendar
  const generateMonthlyCalendar = () => {
    const daysArray = Array(firstDay).fill(null); //empty slots before the first day
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    const rows = [];
    for (let i = 0; i < daysArray.length; i += 7) {
      rows.push(daysArray.slice(i, i + 7));
    }
    return rows;
  };

  const generateDailyTable = () => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    return hours;
  };

  const generateWeeklyTable = () => {
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    return { days: daysOfWeek, hours };
  };
  const generateYearlySchedule = () => {
    const months = [];
    const year = currentDate.getFullYear();

    for (let month = 0; month < 12; month++) {
      const daysInMonth = getDaysInMonth(year, month);
      months.push({
        monthName: new Date(year, month).toLocaleString('default', {
          month: 'long',
        }),
        daysInMonth,
      });
    }

    //split months into 3 rows of 4 months
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

  const rows = tableType === 'month' ? generateMonthlyCalendar() : [];
  const dailyHours = tableType === 'day' ? generateDailyTable() : [];
  const weeklyTable =
    tableType === 'week' ? generateWeeklyTable() : { days: [], hours: [] };

  useEffect(() => {
    console.log('tableType: ', tableType);
  }, [tableType]);
  const handleCalendarTypeButtonClick = (key: pageType) => {
    setIsClicked(!isClicked);
    setTableType(key);
  };

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
          {tableType === 'week' ? (
            <div>{getWeekRangeString(currentDate)}</div>
          ) : (
            currentDate.toLocaleString('default', {
              month: 'long',
              day: tableType === 'day' ? 'numeric' : undefined,
              year: 'numeric',
            })
          )}
        </div>

        <div className="flex gap-2">
          {PageLayoutTypesData.map(({ key, value }) => (
            <ButtonOutlinedBottom
              key={key}
              className="h-10 w-10"
              handleClick={() => handleCalendarTypeButtonClick(key)}
              outlined={tableType !== key ? false : true}
            >
              {value}
            </ButtonOutlinedBottom>
          ))}
        </div>
      </div>

      {/* Table View */}
      {tableType === PageLayoutTypes.MONTH && (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {daysOfWeek.map((day, index) => (
                <th
                  key={index}
                  className="border border-gray-300 p-2 bg-gray-200 text-center font-bold"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((week, rowIndex) => (
              <tr key={rowIndex}>
                {week.map((day, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`border border-gray-300 h-16 text-center ${day ? 'bg-white' : 'bg-gray-100'}`}
                  >
                    {day || ''}
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
              {dailyHours.map((hour, index) => (
                <tr key={index} className="h-12">
                  <td
                    key={index}
                    className="border border-gray-300 h-12 text-center align-text-top w-32 text-blue-600"
                  >
                    {hour}
                  </td>
                  <td className="flex border border-gray-300 flex-1 gap-0"></td>
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
                <td className="border border-gray-300 h-12 w-32 text-center text-blue-600 align-text-top ">
                  {hour}
                </td>
                {weeklyTable.days.map((_, dayIndex) => (
                  <td
                    key={dayIndex}
                    className="border border-gray-300 flex-grow"
                  ></td>
                ))}
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
                  <div className="text-center font-bold">{month.monthName}</div>
                  <div className="grid grid-cols-7 gap-1 mt-2">
                    {/* Generate all the days for this month */}
                    {Array.from(
                      { length: month.daysInMonth },
                      (_, index) => index + 1
                    ).map((day) => (
                      <div key={day} className="text-center p-1">
                        {day}
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
