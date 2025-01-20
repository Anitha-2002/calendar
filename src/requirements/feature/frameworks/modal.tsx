import { RawDefaultProps } from 'anitha/requirements/data-models';
import React from 'react';

interface ModalProps extends RawDefaultProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  headerContent?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  headerContent = 'Modal Header',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-100 bg-opacity-60 z-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className={`absolute inset-0 flex items-center justify-center z-50 ${className}`}
      >
        <div className="bg-white p-6 rounded-lg shadow-2xl w-auto relative">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-blue-600 text-xl font-bold">
                {headerContent}
              </h1>
              <button
                className="flex items-center justify-center h-6 w-6 rounded-full text-2xl text-bold text-blue-500 bg-white hover:text-white hover:bg-blue-500 cursor-pointer"
                onClick={onClose}
              >
                &times;
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
