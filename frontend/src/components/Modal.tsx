import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  id = 'app-modal',
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  }[maxWidth];

  return (
    <div
      id={`${id}-backdrop`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id={id}
        className={`w-full ${maxWidthClass} bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-transform duration-200 transform scale-100`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#1e293b]">
          <div>
            <h3 className="text-lg font-semibold text-[#f8fafc]">{title}</h3>
            {subtitle && <p className="text-xs text-[#94a3b8] mt-0.5">{subtitle}</p>}
          </div>
          <button
            id={`${id}-btn-close`}
            onClick={onClose}
            className="p-1 rounded-lg text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#334155] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
