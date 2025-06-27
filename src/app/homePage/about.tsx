export default function About() {
  return (
    <div className="w-screen bg-latte py-16">
      <div className="relative z-10 flex items-center justify-center">
        <div className="text-left text-charcoal flex flex-col items-start max-w-4xl px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-3 font-medium">
            About Us
          </h2>
          <p className="mb-4 text-2xl font-light">
            ASU Appliances is a family-owned business serving the Salt Lake area. 
            We sell quality refurbished washers, dryers, and stoves, and offer reliable repair, 
            maintenance, and dryer vent cleaning services.
          </p>
          <p className="mb-4 text-2xl font-light">
            Known for honest work and great customer service, 
            our mission is to help families get the most out of their appliances — 
            safely and affordably.
          </p>
          <button className="bg-none border-charcoal border-3 rounded-xs mt-4 hover:bg-charcoal hover:text-latte text-charcoal font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
