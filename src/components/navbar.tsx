"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavbarProps = {
  ctaLabel?: string;
  ctaHref?: string;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Inventory" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar({
  ctaLabel = "Book a Repair",
  ctaHref = "/contact",
}: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b-2 border-crimson bg-charcoal px-5 sm:px-12">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <Link
          href="/"
          className="font-sans text-[18px] font-bold uppercase tracking-[0.07em] text-white transition-colors hover:text-crimson-lt sm:text-[20px]"
        >
          ASU Appliances
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-sans text-[14px] font-normal transition-colors ${
                isActive(pathname, item.href)
                  ? "text-white"
                  : "text-[#a0a0a0] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href={ctaHref}
            className="inline-flex items-center rounded-[2px] bg-crimson px-5 py-2.5 font-sans text-[14px] font-medium text-white transition-colors hover:bg-crimson-lt"
          >
            {ctaLabel}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="inline-flex items-center justify-center rounded-[2px] border border-[#3a3a3a] px-3 py-2 text-white transition-colors hover:bg-[#ffffff0d] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-[#2f2f2f] bg-charcoal md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-sans text-[14px] font-normal transition-colors ${
                  isActive(pathname, item.href)
                    ? "text-white"
                    : "text-[#a0a0a0] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-[2px] bg-crimson px-5 py-2.5 font-sans text-[14px] font-medium text-white transition-colors hover:bg-crimson-lt"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}