import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "ASU Appliances and Parts | Washer, Dryer & Stove Repair South Salt Lake",
  description:
    "Expert appliance repair, diagnostics, and parts at 2944 S West Temple. Serving South Salt Lake, Taylorsville, and Murray with quality refurbished appliances.",
  keywords: [
    "appliance repair South Salt Lake",
    "washer and dryer repair 84115",
    "Salt Lake City appliance diagnostics",
    "used washers and dryers SLC",
    "refurbished stoves South Salt Lake",
    "affordable used appliances Utah",
    "appliance parts store SLC",
    "dryer heating element replacement",
    "washing machine pump parts",
    "ASU Appliances and Parts",
    "ASU Appliances SSL",
  ],
};

const services = [
  {
    id: "01",
    title: "Repair Services",
    description:
      "Washers, dryers, ovens, and ranges. Fast diagnosis, clear pricing.",
  },
  {
    id: "02",
    title: "Refurbished Appliances",
    description:
      "Fully restored units that are cleaned, tested, and ready for a second life with a 30-day warranty.",
  },
  {
    id: "03",
    title: "Parts & Accessories",
    description:
      "Hard-to-find parts in stock or sourced quickly.",
  },
];

const advantages = [
  {
    title: "Transparent pricing",
    description:
      "You get a clear estimate before any work starts. No hidden fees and no vague quotes.",
  },
  {
    title: "Local accountability",
    description:
      "A South Salt Lake business that depends on reputation, referrals, and doing the job well.",
  },
  {
    title: "All major brands",
    description:
      "Samsung, LG, Whirlpool, GE, Maytag, and more. We work across the major appliance lines.",
  },
  {
    title: "Parts on hand",
    description:
      "Common repairs move faster when the parts are in stock or easy to source.",
  },
];

const trustItems = [
  { icon: "", title: "Appliance Repair", subtitle: "All major brands" },
  { icon: "", title: "Refurbished Units", subtitle: "Tested and warrantied" },
  { icon: "", title: "Parts & Supplies", subtitle: "In stock and special order" },
  // { icon: "", title: "Free Estimates", subtitle: "Transparent pricing" },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ASU Appliances and Parts",
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
    <main className="min-h-screen bg-smoke text-charcoal">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="border-b border-rule bg-charcoal px-6 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#666] sm:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span>
            <strong className="text-white">ASU Appliances</strong> · Salt Lake City, UT
          </span>
          <span className="text-[#999]">
            Mon-Fri 9am-6pm · Sat 10am-4pm · Same-day estimates available
          </span>
        </div>
      </div>

      <header className="border-b-4 border-crimson bg-charcoal px-6 sm:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 py-4 md:flex-row md:items-stretch md:justify-between md:gap-8">
          <div className="font-sans text-2xl font-bold uppercase tracking-[0.06em] text-white">
            ASU Appliances
            <span className="mt-1 block font-mono text-[9px] font-normal uppercase tracking-[0.22em] text-[#666]">
              Appliances · Parts · Repair
            </span>
          </div>

          <nav aria-label="Primary" className="flex flex-wrap gap-2 md:items-stretch">
            <Link href="#services" className="inline-flex items-center border border-[#2a2a2a] px-4 py-3 font-sans text-sm text-[#999] transition-colors hover:bg-[#232323] hover:text-white">
              Services
            </Link>
            <Link href="#why" className="inline-flex items-center border border-[#2a2a2a] px-4 py-3 font-sans text-sm text-[#999] transition-colors hover:bg-[#232323] hover:text-white">
              Why ASU
            </Link>
            <Link href="/products" className="inline-flex items-center border border-[#2a2a2a] px-4 py-3 font-sans text-sm text-[#999] transition-colors hover:bg-[#232323] hover:text-white">
              Shop
            </Link>
            <Link href="/contact" className="inline-flex items-center bg-crimson px-5 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-crimson-lt">
              Call Now
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-charcoal px-6 py-20 text-white sm:px-12 lg:px-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(140,31,31,0.18)_0%,transparent_56%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-crimson-lt">
              <span className="h-0.5 w-5 bg-crimson" />
              Local and trusted in South Salt Lake
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-none sm:text-6xl lg:text-7xl text-white">
              We fix what<br />
              <span className="font-normal text-[#888]">others replace.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#7a7a7a] sm:text-base">
              Professional appliance repair, quality refurbished units, and hard-to-find parts with honest pricing and no surprises.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex items-center justify-center bg-crimson px-7 py-3.5 font-sans text-[15px] font-medium text-white transition-colors hover:bg-crimson-lt">
                Book a Repair
              </Link>
              <Link href="/products" className="inline-flex items-center justify-center border border-[#333] bg-transparent px-7 py-3.5 font-sans text-[15px] font-normal text-[#aaa] transition-colors hover:border-[#444] hover:bg-[#232323] hover:text-white">
                Browse Inventory
              </Link>
            </div>

            <div className="mt-8 font-sans text-[15px] font-medium text-[#777]">
              (801) 833-7629
            </div>
          </div>

          <div className="border-l border-[#2e2e2e] pl-0 lg:border-l lg:pl-16">
            <div className="space-y-7">
              <div>
                <div className="font-sans text-5xl font-bold leading-none tracking-[-0.02em] text-white sm:text-6xl">
                  10<span className="text-[0.65em] font-normal text-crimson-lt">+ yrs</span>
                </div>
                <div className="mt-2 font-sans text-[13px] text-[#666]">Serving Salt Lake City</div>
              </div>

              <div className="h-0.5 w-7 bg-[#2e2e2e]" />

              <div>
                <div className="font-sans text-5xl font-bold leading-none tracking-[-0.02em] text-white sm:text-6xl">
                  All <span className="text-[0.65em] font-normal text-crimson-lt">brands</span>
                </div>
                <div className="mt-2 font-sans text-[13px] text-[#666]">
                  Washer, dryer, and oven
                </div>
              </div>

              <div className="h-0.5 w-7 bg-[#2e2e2e]" />

              <div>
                <div className="font-sans text-5xl font-bold leading-none tracking-[-0.02em] text-white sm:text-6xl">
                  30<span className="text-[0.65em] font-normal text-crimson-lt">-day</span>
                </div>
                <div className="mt-2 font-sans text-[13px] text-[#666]">Warranty on refurbished units</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-crimson px-6 py-6 text-white sm:px-12">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4 md:gap-6">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-center gap-3 border-r border-white/20 pr-0 md:pr-6 last:border-r-0">
              <div className="text-lg">{item.icon}</div>
              <div>
                <div className="font-sans text-sm font-semibold leading-none">{item.title}</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-white/60">
                  {item.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="border-b border-rule bg-white px-6 py-18 sm:px-12 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-crimson">
            What we do
          </div>
          <h2 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-charcoal sm:text-5xl">
            Everything your appliances need.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-mid">
            Repair, refurbish, or replace. We handle the full cycle with a straightforward process and no wasted motion.
          </p>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="border-t-3 border-transparent bg-smoke p-7">
                <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#ccc]">
                  {service.id}
                </div>
                <h3 className="mb-3 text-[18px] font-semibold tracking-[-0.01em] text-charcoal">
                  {service.title}
                </h3>
                <p className="text-[14px] leading-7 text-mid">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="border-b border-rule bg-white px-6 py-18 sm:px-12 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-crimson">
            Why ASU
          </div>
          <h2 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-charcoal sm:text-5xl">
            The difference you will notice.
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {advantages.map((item) => (
              <div key={item.title} className="border-l-4 border-crimson bg-white p-7 shadow-[0_0_0_1px_#e9e9e9]">
                <h3 className="mb-2 text-[16px] font-semibold tracking-[-0.01em] text-charcoal">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-7 text-mid">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-charcoal px-6 py-14 sm:px-12 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-crimson-lt">
              Get started today
            </div>
            <h2 className="text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl">
              Ready to book a repair?
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#666]">
              Call us or request service online. Same-day estimates are available.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="tel:+18018337629" className="inline-flex items-center justify-center bg-crimson px-7 py-3.5 font-sans text-[15px] font-medium text-white transition-colors hover:bg-crimson-lt">
              (801) 833-7629
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center border border-[#333] px-7 py-3.5 font-sans text-[15px] font-normal text-[#aaa] transition-colors hover:border-[#444] hover:bg-[#232323] hover:text-white">
              Book Online
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#141414] px-6 py-14 text-white sm:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="mb-2 text-[20px] font-bold uppercase tracking-[0.06em]">
              ASU Appliances
            </div>
            <div className="mb-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#444]">
              Appliances · Parts · Repair — Salt Lake City, UT
            </div>
            <div className="space-y-2 text-[13px] leading-8 text-[#555]">
              <div>
                <strong className="font-medium text-[#aaa]">Phone</strong> (801) 833-7629
              </div>
              <div>
                <strong className="font-medium text-[#aaa]">Hours</strong> Mon-Sat, 8:00am - 6:00pm
              </div>
              <div>
                <strong className="font-medium text-[#aaa]">Email</strong> info@asuappliances.com
              </div>
              <div>Salt Lake City, Utah</div>
            </div>
          </div>

          <div>
            <div className="mb-4 border-b border-[#222] pb-2 text-[13px] font-semibold text-white">
              Services
            </div>
            <ul className="space-y-2 text-[13px] leading-8 text-[#555]">
              <li>Appliance Repair</li>
              <li>Refurbished Units</li>
              <li>Parts &amp; Supplies</li>
              <li>Free Estimates</li>
            </ul>
          </div>

          <div>
            <div className="mb-4 border-b border-[#222] pb-2 text-[13px] font-semibold text-white">
              Company
            </div>
            <ul className="space-y-2 text-[13px] leading-8 text-[#555]">
              <li>About Us</li>
              <li>Reviews</li>
              <li>Contact</li>
              <li>Book a Repair</li>
            </ul>
          </div>
        </div>
      </footer>

      <div className="bg-[#0d0d0d] px-6 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#333] sm:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2025 ASU Appliances</span>
          <span>Salt Lake City, Utah</span>
        </div>
      </div>
    </main>
  );
}
