'use client';
import React, { useState } from 'react';
import { ButtonV1 } from '../components';
import {
  PageLayoutTypes,
  RawDefaultProps,
} from 'anitha/requirements/data-models';

import { GridLayout } from './grid-layout';

type PageLayoutType = (typeof PageLayoutTypes)[keyof typeof PageLayoutTypes];
interface PageLayoutProps extends RawDefaultProps {
  dateRange?: string;
  day: number;
  pageType: PageLayoutType;
  title: string;
}
export const PageLayout = ({
  className = '',
  dateRange = '26 August to 01 September 2024',
  day,
  pageType = PageLayoutTypes.WEEK,
  title,
}: PageLayoutProps) => {
  const [times, setTimes] = useState([
    '12 AM',
    ...Array.from({ length: 11 }, (_, i) => `${i + 1} AM`),
    '12 PM',
    ...Array.from({ length: 11 }, (_, i) => `${i + 1} PM`),
  ]);
  let gridDetails = {
    noOfColumns: 8,
    noOfRows: 24,
    rowHeaderContent: pageType !== PageLayoutTypes.MONTH ? times : [],
    colHeaderContent: ['24', '25', '26', '27', '28', '29', '30'],
  };

  return (
    title && (
      <main
        className={`flex flex-col gap-2 p-5 min-h-screen border-2 border-blue-600 ${className}`}
      >
        <header className="flex border-2 border-gray-300 p-2 justify-between">
          <h1>{title}</h1>
          <ButtonV1>+ Create Schedule</ButtonV1>
        </header>

        <GridLayout />
      </main>
    )
  );
};
