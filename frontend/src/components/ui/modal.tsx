'use client';

import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | string;
  children: ReactNode;
}

const sizeMap: Record<string, string> = {
  sm: 'max-w-xl',
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
};

export default function Modal({ isOpen, onClose, title, maxWidth = 'md', children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className={`relative w-full ${sizeMap[maxWidth] ?? maxWidth} rounded-[2rem] bg-white p-6 shadow-2xl`}> 
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            {title ? <h3 className="text-xl font-semibold text-slate-950">{title}</h3> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
