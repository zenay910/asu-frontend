"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";

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
		<div className="h-screen bg-latte flex flex-col">
			<Navbar />
			
			{/* Page Title */}
			<div className="container mx-auto px-4 py-6 sm:py-8">
				<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal text-center mb-6 sm:mb-8">
					Our Services
				</h1>
				<p className="text-center text-charcoal/80 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
					Professional appliance services you can trust. Click on any service to learn more about what we offer.
				</p>
			</div>

			{/* Services Grid - Responsive with increased card height */}
			<div className="container mx-auto px-4 pb-8 flex-1">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{servicesData.map((service) => {
						const isSelected = selectedService === service.id;
						
						return (
							<div
								key={service.id}
								className={`relative bg-white rounded-xs shadow-sm cursor-pointer transition-all duration-300 overflow-hidden group border-2 h-96 sm:h-[30rem] ${
									isSelected ? 'border-charcoal shadow-lg' : 'border-transparent hover:shadow-md hover:border-charcoal/20'
								}`}
								onClick={() => handleCardClick(service.id)}
							>
								{/* Default Card Content */}
								<div className={`p-6 sm:p-8 h-full flex flex-col justify-center transition-all duration-300 ${
									isSelected ? 'opacity-0 pointer-events-none' : ''
								}`}>
									<div className="text-center">
										<div className="text-4xl sm:text-5xl mb-4">{service.icon}</div>
										<h3 className="text-xl sm:text-2xl font-bold text-charcoal mb-3">{service.title}</h3>
										<p className="text-charcoal/80 text-sm sm:text-base mb-4 leading-relaxed">
											{service.shortDescription}
										</p>
										<p className="text-charcoal font-semibold text-lg">{service.price}</p>
										<div className="mt-4 text-xs text-charcoal/60 group-hover:text-charcoal/80 transition-colors">
											Click to learn more →
										</div>
									</div>
								</div>

								{/* Expanded Content with better spacing */}
								<div className={`absolute inset-0 bg-charcoal text-latte p-4 sm:p-6 transition-all duration-300 ${
									isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'
								}`}>
									<div className="h-full flex flex-col">
										{/* Close button */}
										<button 
											onClick={(e) => {
												e.stopPropagation();
												setSelectedService(null);
											}}
											className="absolute top-3 right-3 bg-latte text-charcoal px-2 py-1 rounded text-xs hover:bg-latte/90 transition-colors z-10"
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
																<span className="text-latte mr-2">✓</span>
																{feature}
															</li>
														))}
													</ul>
												</div>
											</div>
											
                                            <Link href="/contact" className="mt-auto">
                                                <button className="w-full bg-latte text-charcoal px-4 py-2 rounded-xs font-semibold hover:bg-latte/90 transition-colors text-sm sm:text-base">
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

			{/* Call to Action Section - now at bottom of viewport */}
			<div className="bg-charcoal text-latte py-12">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Get Started?</h2>
					<p className="text-latte/80 mb-6 max-w-2xl mx-auto">
						Contact us today for a free consultation and quote on any of our services.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="bg-latte text-charcoal px-6 py-3 rounded-xs font-semibold hover:bg-latte/90 transition-colors">
							Call Now: (801) 833-7629
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}