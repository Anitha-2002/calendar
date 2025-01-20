'use client';
import React from 'react';
import { ButtonV1 } from '../components';
import { RawDefaultProps } from 'anitha/requirements/data-models';

import { GridLayout } from './grid-layout';

interface PageLayoutProps extends RawDefaultProps {
  dateRange?: string;
  title: string;
}
export const PageLayout = ({ className = '', title }: PageLayoutProps) => {
  return (
    title && (
      <main
        className={`flex flex-col border-2 border-gray-200 gap-2 p-2 min-h-screen ${className}`}
      >
        <header className="flex border-gray-300 p-2 justify-between items-center">
          <h1>{title}</h1>
          <ButtonV1>
            <div className="flex gap-1 items-center">
              <div className="font-extrabold text-2xl">+</div>
              <div>Create Schedule</div>
            </div>
          </ButtonV1>
        </header>

        <GridLayout />
      </main>
    )
  );
};
