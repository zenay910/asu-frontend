import React from "react";
import Link from "next/link";

export default function Inventory() {
  return (
    <div className="w-screen bg-charcoal py-16">
      <div className="relative z-10 flex items-center justify-center px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center max-w-6xl gap-8">
          {/* Image on the left */}
          <div className="w-full lg:w-1/2">
            <div 
              className="w-full h-64 sm:h-80 lg:h-96 bg-cover bg-center rounded-xs shadow-md"
              style={{ backgroundImage: 'url("/images/washer_dryer.jpg")' }}
            />
          </div>
          
          {/* Text content on the right */}
          <div className="w-full lg:w-1/2 text-left text-latte flex flex-col items-start">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-3 font-medium">
              Our Inventory
            </h2>
            <p className="mb-4 text-base sm:text-lg lg:text-xl xl:text-2xl font-light">
              Explore our wide selection of <span className="font-bold">quality</span>  refurbished appliances, including washers, dryers, and stoves.
            </p>
            <p className="mb-4 text-base sm:text-lg lg:text-xl xl:text-2xl font-light">
              Each appliance is thoroughly inspected and tested to ensure <span className="font-bold">reliability</span>  and <span className="font-bold">performance</span>.
            </p>
            <Link 
              href="/products"
              className="bg-none border-latte border-2 sm:border-3 rounded-xs mt-4 hover:bg-latte hover:text-charcoal text-latte font-semibold px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm lg:text-base inline-block text-center transition-colors"
            >
              View Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}