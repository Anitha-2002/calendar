'use client';
import { RawButtonProps } from 'anitha/requirements/data-models';
import React from 'react';

// interface ButtonV1Props extends RawButtonProps {}
export const ButtonOutlined = ({
  children,
  className,
  handleClick,
}: RawButtonProps) => {
  return (
    <button
      className={`border rounded-sm border-blue-500 hover:bg-blue-500 hover:text-white hover:border-white ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
