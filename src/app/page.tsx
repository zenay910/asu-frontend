import React from "react";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div
      className="w-screen h-screen bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: 'url("/images/modernDark.png")' }}
    >
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-pale-white bg-opacity-50" />

      {/* Content on top */}
      <Navbar />
      <div className="relative z-10 flex items-center justify-left h-full ml-4 sm:ml-12 lg:ml-24">
        <div className="bg-charcoal/50 rounded-xs m-4 p-9 w-80 max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg ml-4 sm:ml-12 lg:ml-24 shadow-md">
          <div className="text-left text-latte flex flex-col items-center">  
            <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-3 self-start">Reliable appliances.</h2>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-3 self-start">Honest service.</h2>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-3 self-start">Local experts you can trust.</h2>
            <button className="bg-none border-latte border-3 rounded-xs mt-4 hover:bg-latte hover:text-charcoal text-latte font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
              Browse Appliances
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
