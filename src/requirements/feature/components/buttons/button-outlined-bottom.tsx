'use client';
import { RawDefaultProps } from 'anitha/requirements/data-models';
import clsx from 'clsx';
import React, { useState } from 'react';

interface ButtonV1Props extends RawDefaultProps {}
export const ButtonOutlinedBottom = ({
  children,
  className,
}: ButtonV1Props) => {
  const [isClicked, setIsClicked] = useState<Boolean>(false);
  return (
    <button
      className={clsx(
        `border-b-2 hover:border-blue-500 rounded-sm px-2 py-0 ${className}`,
        isClicked ? 'border-blue-500' : 'border-white'
      )}
      onClick={() => {
        setIsClicked(!isClicked);
      }}
    >
      {children}
    </button>
  );
};
