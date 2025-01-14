'use client';
import { RawButtonProps } from 'anitha/requirements/data-models';
import clsx from 'clsx';
import React, { useState } from 'react';

interface ButtonV1Props extends RawButtonProps {
  outlined?: boolean;
}
export const ButtonOutlinedBottom = ({
  children,
  className,
  outlined = true,
  handleClick,
}: ButtonV1Props) => {
  return (
    <button
      className={clsx(
        `border-b-2 hover:border-blue-500 rounded-sm ${className}`,
        outlined ? 'border-blue-500' : 'border-white'
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
