"use client";

import { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon, InfoIcon } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case "error":
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case "info":
        return <InfoIcon className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "info":
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg ${getBgColor()} animate-in slide-in-from-right-full`}
    >
      <div className="flex items-center gap-3">
        {getIcon()}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

interface ToastContextType {
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: "success" | "error" | "info" }>
  >([]);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    showToast,
    toasts: toasts.map((toast) => (
      <Toast
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={() => removeToast(toast.id)}
      />
    )),
  };
}
