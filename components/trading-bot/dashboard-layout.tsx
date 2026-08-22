"use client";

import React, {
  useState,
} from "react";

import TradingBotSidebar from "./sidebar/trading-bot-sidebar";

import {
  Menu,
  X,
} from "lucide-react";


interface DashboardLayoutProps {
  children: React.ReactNode;
}


const DashboardLayout: React.FC<
  DashboardLayoutProps
> = ({
  children,
}) => {

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);


  return (
    <div
      className="
        min-h-screen
        bg-[#050816]
        text-white
        flex
      "
    >

      {/* Desktop Sidebar */}

      <div className="hidden lg:block w-64 shrink-0">
  <TradingBotSidebar />
</div>



      {/* Mobile Sidebar */}

      {mobileOpen && (
        <>
          <div
            className="
              fixed
              inset-0
              bg-black/60
              z-40
              lg:hidden
            "
            onClick={() =>
              setMobileOpen(false)
            }
          />


          <div
            className="
              fixed
              inset-y-0
              left-0
              z-50
              lg:hidden
            "
          >

            <TradingBotSidebar
              mobile
              onClose={() =>
                setMobileOpen(false)
              }
            />

          </div>
        </>
      )}



      {/* Main Area */}

      <main
  className="
    flex-1
    min-h-screen
        "
      >


        {/* Mobile Header */}

        <div
          className="
            lg:hidden
            flex
            items-center
            justify-between
            px-4
            py-4
            border-b
            border-white/10
            bg-[#080b1a]
          "
        >

          <button
            onClick={() =>
              setMobileOpen(true)
            }
            className="
              p-2
              rounded-lg
              bg-white/5
              hover:bg-white/10
            "
          >

            <Menu
              size={22}
            />

          </button>


          <h1
            className="
              font-semibold
            "
          >
            Trading Bot
          </h1>


          <div
            className="
              w-10
            "
          />

        </div>



        {/* Page Content */}

        <div
  className="
    p-4
    md:p-6
    lg:p-6
    w-full
  "
>
  {children}
</div>


      </main>


    </div>
  );
};


export default DashboardLayout;