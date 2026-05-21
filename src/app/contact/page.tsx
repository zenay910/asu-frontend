import React from "react";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTiktok 
} from 'react-icons/fa';
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-smoke text-charcoal">
      <header className="border-b-2 border-crimson bg-charcoal px-5 sm:px-12">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="font-sans text-[18px] font-bold uppercase tracking-[0.07em] text-white sm:text-[20px]"
          >
            ASU Appliances
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center rounded-[2px] bg-crimson px-5 py-2.5 font-sans text-[14px] font-medium text-white transition-colors hover:bg-crimson-lt"
          >
            Browse Inventory
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-charcoal px-5 pb-10 pt-12 text-white sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(140,31,31,0.16)_0%,transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-crimson-lt sm:text-[11px]">
            <span className="h-0.5 w-5 bg-crimson" />
            Contact
          </div>
          <h1 className="text-[clamp(2.2rem,5.5vw,4rem)] font-bold leading-[0.95] tracking-[-0.03em] text-white">
            Let&apos;s Get Your Appliance Running.
          </h1>
          <p className="mt-5 max-w-3xl text-[16px] leading-7 text-[#b5b5b5] sm:text-[17px]">
            Reach out for diagnostics, repairs, installation, or inventory
            questions. We keep communication direct and transparent.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="tel:+18018337629"
              className="inline-flex items-center justify-center rounded-[2px] bg-crimson px-7 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-crimson-lt"
            >
              Call: (801) 833-7629
            </a>
            <a
              href="mailto:asuappliancesllc@gmail.com"
              className="inline-flex items-center justify-center rounded-[2px] border border-[#3a3a3a] px-7 py-3 text-[15px] font-medium text-[#ddd] transition-colors hover:border-[#555] hover:bg-[#ffffff12] hover:text-white"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-8 sm:px-12 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2px] border border-rule bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-[-0.02em] text-charcoal">
            Get In Touch
          </h2>

          <div className="space-y-7">
            <div className="flex items-start gap-4">
              <div className="rounded-[2px] bg-charcoal px-3 py-2 text-lg text-white">
                📞
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-lg font-semibold text-charcoal">Phone</h3>
                <a
                  href="tel:+18018337629"
                  className="text-base font-medium text-charcoal transition-colors hover:text-crimson sm:text-lg"
                >
                  (801) 833-7629
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-[2px] bg-charcoal px-3 py-2 text-lg text-white">
                ✉️
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-lg font-semibold text-charcoal">Email</h3>
                <a
                  href="mailto:asuappliancesllc@gmail.com"
                  className="break-all text-base font-medium text-charcoal transition-colors hover:text-crimson sm:text-lg"
                >
                  asuappliancesllc@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-[2px] bg-charcoal px-3 py-2 text-lg text-white">
                📍
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-lg font-semibold text-charcoal">Address</h3>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=2944+S+West+Temple+South+Salt+Lake+UT+84115"
                  target="_blank"
                  rel="noreferrer"
                  className="text-base text-charcoal transition-colors hover:text-crimson sm:text-lg"
                >
                  2944 S West Temple
                  <br />
                  South Salt Lake, UT 84115
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-[2px] bg-charcoal px-3 py-2 text-lg text-white">
                🕒
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-lg font-semibold text-charcoal">Business Hours</h3>
                <div className="space-y-1 text-[15px] text-mid sm:text-base">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-charcoal">Follow Us</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href="https://www.facebook.com/profile.php?id=61551740657314"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-[2px] border border-rule px-4 py-3 text-sm text-charcoal transition-colors hover:border-[#1877F2]/40 hover:bg-[#1877F2]/5 sm:text-base"
              >
                <FaFacebookF className="shrink-0 text-[#1877F2]" />
                <span className="truncate">ASU Appliances</span>
              </a>
              <a
                href="https://www.instagram.com/asuappliances?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-[2px] border border-rule px-4 py-3 text-sm text-charcoal transition-colors hover:border-[#E4405F]/40 hover:bg-[#E4405F]/5 sm:text-base"
              >
                <FaInstagram className="shrink-0 text-[#E4405F]" />
                <span className="truncate">@asuappliances</span>
              </a>
              <a
                href="https://tiktok.com/@asuappliances"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-[2px] border border-rule px-4 py-3 text-sm text-charcoal transition-colors hover:border-charcoal/30 hover:bg-charcoal/5 sm:text-base"
              >
                <FaTiktok className="shrink-0 text-charcoal" />
                <span className="truncate">@asuappliances</span>
              </a>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2px] border border-rule bg-white shadow-sm">
          <div className="h-full min-h-[420px] sm:min-h-[520px] lg:min-h-[620px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.4805876373657!2d-111.89687722341903!3d40.70743573789426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87528ae59672172d%3A0xcbc6e144fdbd0d2f!2sASU%20Appliance%20Sales%20%26%20Repair!5e0!3m2!1ses-419!2sus!4v1751054500008!5m2!1ses-419!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "420px" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ASU Appliances Location"
              className="h-full w-full"
            />
          </div>
        </section>
      </div>
    </div>
  );
}