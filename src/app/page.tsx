// src/app/page.tsx
import React from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import About from "@/app/homePage/about";
import Inventory from "@/app/homePage/inventory";
import Services from "@/app/homePage/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "ASU Appliances and Parts | Washer, Dryer & Stove Repair South Salt Lake",
  description:
    "Expert appliance repair, diagnostics, and parts at 2944 S West Temple. Serving South Salt Lake, Taylorsville, and Murray with quality refurbished appliances.",
  keywords: [
    // Location + Service (The Bread and Butter)
    "appliance repair South Salt Lake",
    "washer and dryer repair 84115",
    "Salt Lake City appliance diagnostics",

    // Product + Sale (For your inventory)
    "used washers and dryers SLC",
    "refurbished stoves South Salt Lake",
    "affordable used appliances Utah",

    // Specific Parts (For the DIYers)
    "appliance parts store SLC",
    "dryer heating element replacement",
    "washing machine pump parts",

    // Brand name (The business identity)
    "ASU Appliances and Parts",
    "ASU Appliances SSL",
  ],
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ASU Appliances and Parts",
    image: "https://yourwebsite.com/images/modernDark.png", // Update to your actual logo/hero URL
    "@id": "https://asuappliances.com",
    url: "https://asuappliances.com",
    telephone: "+1-801-833-7629",
    address: {
      "@type": "PostalAddress",
      streetAddress: "2944 S West Temple",
      addressLocality: "South Salt Lake",
      addressRegion: "UT",
      postalCode: "84115",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.7067,
      longitude: -111.8943,
    },
    areaServed: [
      { "@type": "City", name: "South Salt Lake" },
      { "@type": "City", name: "Salt Lake City" },
      { "@type": "City", name: "Taylorsville" },
      { "@type": "City", name: "Murray" },
      { "@type": "City", name: "West Jordan" },
      { "@type": "City", name: "Draper" },
      { "@type": "City", name: "Bountiful" },
      { "@type": "City", name: "Woods Cross" },
      { "@type": "City", name: "Rose Park" },
      { "@type": "City", name: "West Valley City" },
      { "@type": "City", name: "Magna" },
      { "@type": "City", name: "Kearns" },
      { "@type": "City", name: "Millcreek" },
      { "@type": "City", name: "Holladay" },
      { "@type": "City", name: "Midvale" },
      { "@type": "City", name: "Cottonwood Heights" },
      { "@type": "City", name: "Oquirrh" },
      { "@type": "City", name: "South Jordan" },
      { "@type": "City", name: "Riverton" },
      { "@type": "City", name: "Sandy" },
      { "@type": "City", name: "Herriman" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Appliance Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Washer & Dryer Repair" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Stove & Oven Repair" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Appliance Parts Sales" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Delivery & Installation" },
        },
      ],
    },
  };

  return (
    <div>
      {/* Structured Data for Google Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <div
        className="w-screen h-screen bg-cover bg-center relative"
        style={{ backgroundImage: 'url("/images/modernDark.png")' }}
      >
        <div className="absolute inset-0 bg-pale-white bg-opacity-50" />

        <Navbar />
        <div className="relative z-10 flex items-center justify-center sm:justify-start h-full px-4 sm:px-12 lg:px-24">
          <div className="bg-charcoal/50 rounded-xs p-6 sm:p-9 w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg shadow-md">
            <div className="text-center sm:text-left text-latte flex flex-col">
              {/* Strong H1 for SEO Authority */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-3 font-bold">
                Appliance Repair & Parts <br />
                <span className="text-lg opacity-80 font-normal">
                  in South Salt Lake
                </span>
              </h1>

              <h2 className="text-lg sm:text-xl lg:text-2xl mb-2 font-semibold italic">
                Reliable appliances.
              </h2>
              <h2 className="text-lg sm:text-xl lg:text-2xl mb-2 font-semibold italic">
                Honest service.
              </h2>
              <h2 className="text-lg sm:text-xl lg:text-2xl mb-6 font-semibold italic text-latte/90">
                Local experts you can trust.
              </h2>

              <Link
                href="/products"
                className="bg-transparent border-latte border-2 rounded-xs mt-4 hover:bg-latte hover:text-charcoal text-latte font-semibold px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base transition-colors duration-300 text-center inline-block self-center sm:self-start"
              >
                Browse Inventory
              </Link>
            </div>
          </div>
        </div>
      </div>

      <About />
      <Inventory />
      <Services />
    </div>
  );
}
