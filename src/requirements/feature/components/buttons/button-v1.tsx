'use client';
import { RawButtonProps } from 'anitha/requirements/data-models';

import React from 'react';
// interface ButtonV1Props extends RawButtonProps {}
export const ButtonV1 = ({
  children,
  className,
  handleClick,
}: RawButtonProps) => {
  return (
    <button
      className={`flex text-blue-500 bg-gray-50 p-2 rounded-sm flex-end shadow-neutral-200
     shadow-lg hover:bg-blue-500 hover:text-white hover:border-white hover:shadow-none items-center
     ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
