"use client";
import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";

const servicesData = [
	{
		id: 1,
		title: "Diagnostic",
		icon: "🔍",
		shortDescription: "Professional appliance diagnosis to identify issues quickly and accurately",
		fullDescription:
			"Our experienced technicians provide comprehensive diagnostic services to identify issues with your appliances. We use advanced tools and techniques to pinpoint problems quickly and accurately, saving you time and money.",
		features: [
			"Complete system analysis",
			"Written diagnostic report",
			"Repair cost estimate",
			"Same-day service available",
		],
		price: "Starting at $60",
	},
	{
		id: 2,
		title: "Repair",
		icon: "🔧",
		shortDescription: "Expert repair services for all major appliance brands with warranty",
		fullDescription:
			"From minor fixes to major overhauls, our skilled technicians can repair all types of appliances. We use quality parts and provide warranties on our work to ensure your satisfaction.",
		features: [
			"All major brands serviced",
			"Quality replacement parts",
			"Emergency repair services",
		],
		price: "Labor starting at $80",
	},
	{
		id: 3,
		title: "Delivery & Installation",
		icon: "🚚",
		shortDescription: "Complete delivery and professional installation with testing",
		fullDescription:
			"We handle the complete process from delivery to installation. Our team ensures your new appliances are properly connected, tested, and ready to use safely and efficiently.",
		features: [
			"Safe appliance transport",
			"Professional installation",
			"Connection testing",
			"Old appliance removal available",
		],
		price: "Starting at $90",
	},
	{
		id: 4,
		title: "Dryer Vent Cleaning",
		icon: "🌪️",
		shortDescription: "Essential safety service to prevent fires and improve efficiency",
		fullDescription:
			"Regular dryer vent cleaning prevents fires, improves efficiency, and extends your dryer's lifespan. Our thorough cleaning removes lint buildup and ensures proper airflow.",
		features: [
			"Complete vent system cleaning",
			"Improved drying efficiency",
			"Fire hazard prevention",
		],
		price: "Starting at $100",
	},
];

export default function ServicesPage() {
	const [selectedService, setSelectedService] = useState<number | null>(null);

	const handleCardClick = (cardId: number) => {
		setSelectedService(selectedService === cardId ? null : cardId);
	};

	return (
		<div className="min-h-screen bg-smoke text-charcoal">
			<Navbar ctaLabel="Book a Repair" ctaHref="/contact" />

			<section className="relative overflow-hidden bg-charcoal px-5 pb-10 pt-28 text-white sm:px-12">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(140,31,31,0.16)_0%,transparent_55%)]" />
				<div className="relative mx-auto max-w-7xl">
					<div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-crimson-lt sm:text-[11px]">
						<span className="h-0.5 w-5 bg-crimson" />
						Services
					</div>
					<h1 className="text-[clamp(2.2rem,5.5vw,4rem)] font-bold leading-[0.95] tracking-[-0.03em] text-white">
						Expert Appliance Service
						<span className="mt-1 block font-light text-[#9a9a9a]">
							Repair, install, and maintain with confidence.
						</span>
					</h1>
					<p className="mt-5 max-w-3xl text-[16px] leading-7 text-[#b5b5b5] sm:text-[17px]">
						Choose a service card to view details, what is included, and
						starting pricing.
					</p>
				</div>
			</section>

			<div className="mx-auto max-w-7xl px-5 py-6 sm:px-12 sm:py-8">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
					{servicesData.map((service) => {
						const isSelected = selectedService === service.id;
						
						return (
							<div
								key={service.id}
								className={`group relative h-96 cursor-pointer overflow-hidden rounded-[2px] border bg-white shadow-sm transition-all duration-300 sm:h-[30rem] ${
									isSelected
										? "border-charcoal shadow-md"
										: "border-rule hover:-translate-y-1 hover:border-charcoal/20 hover:shadow-md"
								}`}
								onClick={() => handleCardClick(service.id)}
							>
								<div className={`p-6 sm:p-8 h-full flex flex-col justify-center transition-all duration-300 ${
									isSelected ? "pointer-events-none opacity-0" : ""
								}`}>
									<div className="text-center">
										<div className="text-4xl sm:text-5xl mb-4">{service.icon}</div>
										<h3 className="text-xl sm:text-2xl font-bold text-charcoal mb-3">{service.title}</h3>
										<p className="text-charcoal/80 text-sm sm:text-base mb-4 leading-relaxed">
											{service.shortDescription}
										</p>
										<p className="text-charcoal font-semibold text-lg">{service.price}</p>
										<div className="mt-4 text-xs uppercase tracking-[0.08em] text-charcoal/60 transition-colors group-hover:text-charcoal/80">
											Click to learn more →
										</div>
									</div>
								</div>

								<div className={`absolute inset-0 bg-charcoal p-4 text-white sm:p-6 transition-all duration-300 ${
									isSelected ? "opacity-100" : "pointer-events-none opacity-0"
								}`}>
									<div className="h-full flex flex-col">
										<button 
											onClick={(e) => {
												e.stopPropagation();
												setSelectedService(null);
											}}
											className="absolute right-3 top-3 z-10 rounded bg-white px-2 py-1 text-xs text-charcoal transition-colors hover:bg-[#f0f0f0]"
										>
											✕
										</button>

										<div className="flex-1 flex flex-col justify-between text-center py-4">
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-bold mb-2">{service.title}</h2>
                                                <p className="text-sm sm:text-base font-semibold mb-3">{service.price}</p>
                                            </div>
                                            
                                            <div className="flex-1 flex flex-col justify-center">
												<p className="text-xs sm:text-sm leading-relaxed mb-4">
													{service.fullDescription}
												</p>
												
												<div className="mb-4">
													<h3 className="text-sm sm:text-base font-semibold mb-2">What's Included:</h3>
													<ul className="space-y-1 text-xs sm:text-sm">
														{service.features.map((feature, index) => (
															<li key={index} className="flex items-center justify-center">
																<span className="mr-2 text-[#dddddd]">✓</span>
																{feature}
															</li>
														))}
													</ul>
												</div>
											</div>
											
                                            <Link href="/contact" className="mt-auto">
												<button className="w-full rounded-[2px] bg-white px-4 py-2 text-sm font-semibold text-charcoal transition-colors hover:bg-[#f0f0f0] sm:text-base">
                                                    Get Quote
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
							</div>
						);
					})}
				</div>
			</div>

			<section className="border-t border-rule bg-charcoal px-5 py-12 text-white sm:px-12">
				<div className="mx-auto max-w-7xl text-center">
					<h2 className="mb-4 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
						Ready to Get Started?
					</h2>
					<p className="mx-auto mb-6 max-w-2xl text-[#c9c9c9]">
						Contact us today for a free consultation and quote on any of our services.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="tel:8018337629"
							className="inline-flex items-center justify-center rounded-[2px] bg-crimson px-6 py-3 font-semibold text-white transition-colors hover:bg-crimson-lt"
						>
							Call Now: (801) 833-7629
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}