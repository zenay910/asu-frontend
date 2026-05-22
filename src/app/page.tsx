import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ReviewsWidget from "@/components/reviews-widget";

export const metadata: Metadata = {
  title: "ASU Appliances - Appliances, Parts & Repair · Salt Lake City",
  description:
    "ASU Appliances offers appliance repair, refurbished units, and parts in Salt Lake City with honest pricing and same-day estimates.",
};

const services = [
  {
    name: "Appliance Repair",
    detail: "All major brands",
  },
  {
    name: "Refurbished Units",
    detail: "30-day warranty",
  },
  {
    name: "Parts & Supplies",
    detail: "In-stock & special order",
  },
//   {
//     name: "Free Estimates",
//     detail: "Transparent pricing",
//   },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ASU Appliances and Parts",
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
  };

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <section className="relative overflow-hidden px-5 pb-0 pt-28 sm:px-12 sm:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(140,31,31,0.16)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_25%,transparent_75%,rgba(0,0,0,0.08))]" />

        <section className="relative mx-auto max-w-7xl pb-16 sm:pb-20">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-crimson-lt sm:text-[11px]">
              <span className="h-0.5 w-5 bg-crimson" />
              Salt Lake City - local and trusted
            </div>

            <h1 className="max-w-4xl text-[clamp(3rem,7vw,5.6rem)] font-bold leading-[0.92] tracking-[-0.03em] text-white">
              We fix it.
              <br />
              <span className="block font-light text-[#8a8a8a]">
                We sell it.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-[17px] leading-8 text-[#b0b0b0] sm:text-[18px]">
              Lean, honest <span className="text-rule font-semibold">appliance</span> repair with refurbished units and parts
              when you need them. Clear estimates, practical service, and no
              clutter getting in the way.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/contact"
                className="inline-flex min-w-[220px] items-center justify-center rounded-[2px] bg-crimson px-7 py-4 text-[16px] font-semibold text-white transition-colors hover:bg-crimson-lt"
              >
                Book a Repair
              </Link>
              <Link
                href="/products"
                className="inline-flex min-w-[220px] items-center justify-center rounded-[2px] border border-[#343434] bg-[#ffffff0a] px-7 py-4 text-[16px] font-medium text-[#d0d0d0] transition-colors hover:border-[#4d4d4d] hover:bg-[#ffffff10] hover:text-white"
              >
                Browse Inventory
              </Link>
            </div>

            <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
              <div>
                <a
                  href="tel:8018337629"
                  className="block text-[22px] font-semibold tracking-[-0.02em] text-white transition-colors hover:text-crimson-lt sm:text-[24px]"
                >
                  (801) 833-7629
                </a>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#b8b8b8] sm:text-[10px]">
                  Mon-Fri · 9am-6pm
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#b8b8b8] sm:text-[10px]">
                  Sat · 10am-4pm
                </div>
              </div>

              <div className="h-px w-full bg-[#2f2f2f] sm:hidden" />

              <div className="sm:h-20 sm:w-px sm:bg-[#2f2f2f]" />

              <div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=2944+S+West+Temple+South+Salt+Lake+UT+84115"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[16px] font-semibold tracking-[-0.02em] text-white transition-colors hover:text-crimson-lt sm:text-[18px]"
                >
                  2944 S West Temple
                  <br />
                  South Salt Lake, UT 84115
                </a>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#b8b8b8] sm:text-[10px]">
                  Open in Google Maps
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section
        id="inventory"
        className="border-t border-rule bg-smoke px-5 py-8 text-charcoal sm:px-12"
      >
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.name}
              className="border-r border-rule pr-0 last:border-r-0 sm:pr-4 xl:pr-6"
            >
              <div className="text-[16px] font-semibold tracking-[-0.01em] text-charcoal sm:text-[17px]">
                {service.name}
              </div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#6b6b6b] sm:text-[10px]">
                {service.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="parts"
        className="border-t border-rule bg-charcoal px-5 py-10 text-white sm:px-12"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:gap-8">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-crimson-lt sm:text-[10px]">
              Reviews
            </div>
            <h2 className="mt-2 text-[22px] font-bold tracking-[-0.02em] text-white sm:text-[28px]">
              Google reviews.
            </h2>
          </div>

          <div className="rounded-[2px] border border-[#2f2f2f] bg-[#121212] p-4 sm:p-6">
            <ReviewsWidget widgetId="featurable-367e2998-e895-442a-b6f5-3eeb61f89d71" />
          </div>
        </div>
      </section>

      <footer
        id="about"
        className="border-t-2 border-crimson bg-[#111] px-5 py-8 text-white sm:px-12"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-sans text-[18px] font-bold uppercase tracking-[0.07em] sm:text-[20px]">
              ASU Appliances
            </div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#b8b8b8] sm:text-[10px]">
              Salt Lake City, Utah
            </div>
          </div>

          <div className="text-left sm:text-right">
            <a
              href="tel:8018337629"
              className="block text-[22px] font-semibold tracking-[-0.02em] text-white transition-colors hover:text-crimson-lt sm:text-[24px]"
            >
              (801) 833-7629
            </a>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#b8b8b8] sm:text-[10px]">
              Mon-Fri · 9am - 6pm
            </div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#b8b8b8] sm:text-[10px]">
              Sat · 10am - 4pm
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
