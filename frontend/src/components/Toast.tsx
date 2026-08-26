import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'danger';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const normalizedType = type === 'error' ? 'danger' : type;

  const bgStyles = {
    success: 'bg-[#1e293b] border-emerald-500/50 text-[#f8fafc]',
    danger: 'bg-[#1e293b] border-red-500/50 text-[#f8fafc]',
    warning: 'bg-[#1e293b] border-amber-500/50 text-[#f8fafc]',
    info: 'bg-[#1e293b] border-sky-500/50 text-[#f8fafc]'
  }[normalizedType];

  const Icon = {
    success: <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 text-[#ef4444] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#f59e0b] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#38bdf8] shrink-0" />
  }[normalizedType];

  return (
    <div
      id="toast-notification-banner"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl border shadow-2xl transition-all duration-300 animate-slide-up max-w-md ${bgStyles}`}
    >
      {Icon}
      <div className="flex-1 text-xs font-semibold text-[#f8fafc]">{message}</div>
      <button
        id="btn-close-toast"
        onClick={onClose}
        className="text-[#94a3b8] hover:text-[#f8fafc] p-1 rounded transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
