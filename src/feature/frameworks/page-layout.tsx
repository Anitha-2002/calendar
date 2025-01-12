import React from 'react';
import { ButtonOutlined, ButtonOutlinedBottom, ButtonV1 } from '../components';
import { PageLayoutTypesData, RawDefaultProps } from 'anitha/data-models';
interface PageLayoutProps extends RawDefaultProps {
  dateRange?: string;
  day: number;
  title: string;
}
export const PageLayout = ({
  className = '',
  dateRange = '26 August to 01 September 2024',
  day,
  title,
}: PageLayoutProps) => {
  const outlinedButtonContents = ['<', '>'];
  return (
    title && (
      <main
        className={`flex flex-col gap-2 p-5 min-h-screen border-2 border-blue-600 ${className}`}
      >
        <header className="flex border-2 border-gray-300 p-2 justify-between">
          <h1>{title}</h1>
          <ButtonV1>+ Create Schedule</ButtonV1>
        </header>

        {/* mid part of page*/}
        <div className="flex border justify-between">
          <div className="flex border-2 gap-1 p-2">
            {outlinedButtonContents.map((content, index) => (
              <ButtonOutlined key={index}>{content}</ButtonOutlined>
            ))}
            <ButtonV1 className="px-1">{day}</ButtonV1>
          </div>
          <div className="border-2 flex px-4 items-center">{dateRange}</div>

          <div className="flex gap-2">
            {PageLayoutTypesData.map(({ key, value }) => (
              <ButtonOutlinedBottom key={key}>{value}</ButtonOutlinedBottom>
            ))}
          </div>
        </div>
      </main>
    )
  );
};
