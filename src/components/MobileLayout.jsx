import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

const MobileLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-100 sm:items-center sm:py-10">
      {/* 아이폰 프레임 (최대 너비 430px) */}
      <div className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-white shadow-2xl sm:h-[880px] sm:rounded-[45px] border-gray-900 sm:border-[8px]">
        
        {/* 상단 상태바 (데스크탑용) */}
        <div className="hidden h-12 w-full flex-shrink-0 items-center justify-between bg-white px-6 sm:flex z-50">
          <span className="text-[15px] font-bold text-gray-900">9:41</span>
          <div className="flex items-center gap-1.5 text-gray-900">
            <Signal size={16} strokeWidth={2.5} />
            <Wifi size={16} strokeWidth={2.5} />
            <Battery size={20} strokeWidth={2.5} />
          </div>
        </div>

        {/* 실제 화면 영역 */}
        <main className="flex-1 overflow-y-auto scrollbar-hide relative w-full bg-white">
          {children}
        </main>

        {/* 하단 바 */}
        <div className="absolute bottom-2 left-1/2 z-50 h-1.5 w-[130px] -translate-x-1/2 rounded-full bg-black/20 pointer-events-none" />
      </div>
    </div>
  );
};

export default MobileLayout;