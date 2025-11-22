import { useState } from 'react';

export default function HotlineButton() {
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = '1900123456'; // Thay số điện thoại của bạn

  return (
    <a
      href={`tel:${phoneNumber}`}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg">
          Gọi ngay: {phoneNumber}
          <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
        </div>
      )}

      {/* Button */}
      <div className="relative">
        {/* Ripple effect */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>

        {/* Main button */}
        <div className="relative bg-green-500 hover:bg-green-600 text-white rounded-full p-3 md:p-4 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95">
          <svg
            className="w-6 h-6 md:w-8 md:h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
          </svg>
        </div>

        {/* Badge */}
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          !
        </div>
      </div>
    </a>
  );
}
