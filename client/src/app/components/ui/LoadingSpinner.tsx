import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  fullscreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "กำลังโหลด...", fullscreen = false }) => {
  return (
    <div
      className={`${
        fullscreen ? "fixed inset-0 z-50" : ""
      } flex items-center justify-center ${
        fullscreen ? "bg-white/60 backdrop-blur-md" : ""
      }`}
    >
      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl shadow-2xl bg-white/80 backdrop-blur-lg border border-gray-200">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-t-green-500 border-b-transparent border-l-transparent border-r-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full bg-white"></div>
        </div>
        <p className="text-green-700 font-semibold text-lg animate-pulse">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
