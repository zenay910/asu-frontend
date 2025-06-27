import React from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import About from "@/app/homePage/about";
import Inventory from "@/app/homePage/inventory";
import Services from "@/app/homePage/services";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="w-screen h-screen bg-cover bg-center relative"
        style={{ backgroundImage: 'url("/images/modernDark.png")' }}
      >
        {/* Optional dark overlay */}
        <div className="absolute inset-0 bg-pale-white bg-opacity-50" />

        {/* Content on top */}
        <Navbar />
        <div className="relative z-10 flex items-center justify-center sm:justify-start h-full px-4 sm:px-12 lg:px-24">
          <div className="bg-charcoal/50 rounded-xs p-6 sm:p-9 w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg shadow-md">
            <div className="text-center sm:text-left text-latte flex flex-col">  
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-3 font-bold">Reliable appliances.</h2>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-3 font-bold">Honest service.</h2>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-6 font-bold">Local experts you can trust.</h2>
              <Link 
                href="/products" 
                className="bg-transparent border-latte border-2 rounded-xs mt-4 hover:bg-latte hover:text-charcoal text-latte font-semibold px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base transition-colors duration-300 text-center inline-block self-center sm:self-start"
              >
                Browse Appliances
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* About Section - now flows below hero */}
      <About />
      <Inventory />
      <Services />
    </div>
  );
}
