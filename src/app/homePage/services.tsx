import React from "react";
import Link from "next/link";

export default function Services() {
  return (
    <div className="w-screen bg-charcoal py-16">
      <div className="relative z-10 flex items-center justify-center px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center max-w-6xl gap-8">
          
          {/* Text content on the left */}
          <div className="w-full lg:w-1/2 text-left text-latte flex flex-col items-start">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-3 font-medium">
              Our Services
            </h2>
            <p className="mb-4 text-base sm:text-lg lg:text-xl xl:text-2xl font-light">
              We provide comprehensive <span className="font-bold">repair</span> and <span className="font-bold">maintenance</span> services for all major appliance brands.
            </p>
            <p className="mb-4 text-base sm:text-lg lg:text-xl xl:text-2xl font-light">
              From quick fixes to complete overhauls, our experienced technicians ensure your appliances run <span className="font-bold">efficiently</span> and <span className="font-bold">safely</span>.
            </p>
            <Link 
              href="/services"
              className="bg-none border-latte border-2 sm:border-3 rounded-xs mt-4 hover:bg-latte hover:text-charcoal text-latte font-semibold px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm lg:text-base inline-block text-center transition-colors"
            >
              View Services
            </Link>
          </div>

          {/* Image on the right */}
          <div className="w-full lg:w-1/2">
            <div 
              className="w-full h-64 sm:h-80 lg:h-96 bg-cover bg-center rounded-xs shadow-md"
              style={{ backgroundImage: 'url("/images/maytag_set.jpg")' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}