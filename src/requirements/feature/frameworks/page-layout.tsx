'use client';
import React from 'react';
import { ButtonV1 } from '../components';
import { RawDefaultProps } from 'anitha/requirements/data-models';

import { GridLayout } from './grid-layout';

// type PageLayoutType = (typeof PageLayoutTypes)[keyof typeof PageLayoutTypes];
interface PageLayoutProps extends RawDefaultProps {
  dateRange?: string;
  title: string;
}
export const PageLayout = ({ className = '', title }: PageLayoutProps) => {
  // const [times, setTimes] = useState([
  //   '12 AM',
  //   ...Array.from({ length: 11 }, (_, i) => `${i + 1} AM`),
  //   '12 PM',
  //   ...Array.from({ length: 11 }, (_, i) => `${i + 1} PM`),
  // ]);
  // let gridDetails = {
  //   noOfColumns: 8,
  //   noOfRows: 24,
  //   rowHeaderContent: pageType !== PageLayoutTypes.MONTH ? times : [],
  //   colHeaderContent: ['24', '25', '26', '27', '28', '29', '30'],
  // };

  return (
    title && (
      <main
        className={`flex flex-col border-2 border-gray-200 gap-2 p-2 min-h-screen ${className}`}
      >
        <header className="flex border-gray-300 p-2 justify-between items-center">
          <h1>{title}</h1>
          <ButtonV1>+ Create Schedule</ButtonV1>
        </header>

        <GridLayout />
      </main>
    )
  );
};
