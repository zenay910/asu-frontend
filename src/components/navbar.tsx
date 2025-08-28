"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-charcoal/50 shadow-md w-full p-4 relative z-20">
            <div className="max-w-full px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-3 text-2xl sm:text-3xl font-bold text-latte font-mono">
                            <Image
                                src="/Component 9.svg"
                                alt="ASU Appliances Logo"
                                width={70}
                                height={70}
                                // Keep square to preserve original SVG aspect ratio (1:1)
                                priority
                            />
                            <div className="flex flex-col text-left leading-tight">
                                <span>ASU</span>
                                <span>APPLIANCES</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-6 lg:space-x-8 text-base lg:text-lg">
                        <Link href="/" className="text-latte hover:text-silver transition-colors duration-300">
                            Home
                        </Link>
                        <Link href="/products" className="text-latte hover:text-silver transition-colors duration-300">
                            Products
                        </Link>
                        <Link href="/services" className="text-latte hover:text-silver transition-colors duration-300">
                            Services
                        </Link>
                        <Link href="/contact" className="text-latte hover:text-silver transition-colors duration-300">
                            Contact
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-latte hover:text-silver focus:outline-none focus:text-silver transition-colors duration-300"
                            aria-label="Toggle menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4">
                        <div className="flex flex-col space-y-3">
                            <Link 
                                href="/" 
                                className="text-latte hover:text-silver transition-colors duration-300 text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link 
                                href="/products" 
                                className="text-latte hover:text-silver transition-colors duration-300 text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Products
                            </Link>
                            <Link 
                                href="/services" 
                                className="text-latte hover:text-silver transition-colors duration-300 text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Services
                            </Link>
                            <Link 
                                href="/contact" 
                                className="text-latte hover:text-silver transition-colors duration-300 text-base font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}