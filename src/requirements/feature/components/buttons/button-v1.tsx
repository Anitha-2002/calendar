import { RawDefaultProps } from 'anitha/requirements/data-models';
import React from 'react';
interface ButtonV1Props extends RawDefaultProps {}
export const ButtonV1 = ({ children, className }: ButtonV1Props) => {
  return (
    <button
      className={`flex text-blue-500 bg-gray-50 rounded-sm flex-end shadow-neutral-200
     shadow-md p-1 hover:bg-blue-400 hover:text-white hover:border-white
     ${className}`}
    >
      {children}
    </button>
  );
};
