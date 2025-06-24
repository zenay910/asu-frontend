import React from "react";

export default function Navbar() {
    return (
        <nav className="bg-charcoal/50 shadow-md w-full p-4 relative z-20">
            <div className="max-w-full px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="/" className="text-3xl font-bold text-latte font-mono">
                            <div className="flex flex-col text-left">
                                <span>ASU</span>
                                <span>APPLIANCES</span>
                            </div>
                        </a>
                    </div>
                    <div className="hidden md:flex space-x-4 text-lg mr-36">
                        <a href="/" className="text-latte hover:text-silver">
                            Home
                        </a>
                        <a href="/about" className="text-latte hover:text-silver">
                            Products
                        </a>
                        <a href="/about" className="text-latte hover:text-silver">
                            Services
                        </a>
                        <a href="/contact" className="text-latte hover:text-silver">
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}