import { RawDefaultProps } from 'anitha/requirements/data-models';
import React from 'react';
interface ButtonV1Props extends RawDefaultProps {}
export const ButtonOutlined = ({ children, className }: ButtonV1Props) => {
  return (
    <button
      className={`border rounded-sm border-blue-500 px-2 py-0 hover:bg-blue-400 hover:text-white hover:border-white ${className}`}
    >
      {children}
    </button>
  );
};
