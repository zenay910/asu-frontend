"use client";
import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";

// Updated dummy data with more specific categories
const dummyProducts = [
	{
		id: 1,
		name: "Samsung Refrigerator",
		price: "$899",
		condition: "Excellent",
		brand: "Samsung",
		category: "Refrigerator",
		subcategory: "French Door",
		type: "Single Unit",
		image: "/images/placeholder-appliance.jpg",
	},
	{
		id: 2,
		name: "Whirlpool Front Load Washer",
		price: "$450",
		condition: "Good",
		brand: "Whirlpool",
		category: "Washer",
		subcategory: "Front Load",
		type: "Single Unit",
		image: "/images/placeholder-appliance.jpg",
	},
	{
		id: 3,
		name: "LG Top Load Washer",
		price: "$380",
		condition: "Excellent",
		brand: "LG",
		category: "Washer",
		subcategory: "Top Load",
		type: "Single Unit",
		image: "/images/placeholder-appliance.jpg",
	},
	{
		id: 4,
		name: "Samsung Washer & Dryer Set",
		price: "$1200",
		condition: "Excellent",
		brand: "Samsung",
		category: "Laundry",
		subcategory: "Front Load Set",
		type: "Set",
		image: "/images/placeholder-appliance.jpg",
	},
	{
		id: 5,
		name: "GE Electric Dryer",
		price: "$320",
		condition: "Good",
		brand: "GE",
		category: "Dryer",
		subcategory: "Electric",
		type: "Single Unit",
		image: "/images/placeholder-appliance.jpg",
	},
	{
		id: 6,
		name: "Maytag Gas Range",
		price: "$650",
		condition: "Good",
		brand: "Maytag",
		category: "Range",
		subcategory: "Gas",
		type: "Single Unit",
		image: "/images/placeholder-appliance.jpg",
	},
	{
		id: 7,
		name: "Frigidaire Microwave",
		price: "$180",
		condition: "Excellent",
		brand: "Frigidaire",
		category: "Microwave",
		image: "/images/placeholder-appliance.jpg",
	},
	{
		id: 8,
		name: "Bosch Dishwasher",
		price: "$520",
		condition: "Excellent",
		brand: "Bosch",
		category: "Dishwasher",
		image: "/images/placeholder-appliance.jpg",
	},
];

export default function ProductsPage() {
	const [filteredProducts, setFilteredProducts] = useState(dummyProducts);
	const [filters, setFilters] = useState({
		type: "All Types",
		configuration: "All Configurations",
		unitType: "All Units",
		brand: "All Brands",
		priceRange: "All Prices",
	});
	const [showMobileFilters, setShowMobileFilters] = useState(false);

	const handleFilterChange = (filterType: string, value: string) => {
		setFilters((prev) => ({ ...prev, [filterType]: value }));
	};

	const applyFilters = () => {
		let filtered = dummyProducts;

		// Apply filters (basic implementation)
		if (filters.type !== "All Types") {
			filtered = filtered.filter(
				(product) => product.category === filters.type
			);
		}
		if (filters.brand !== "All Brands") {
			filtered = filtered.filter((product) => product.brand === filters.brand);
		}
		if (filters.unitType !== "All Units") {
			filtered = filtered.filter((product) => product.type === filters.unitType);
		}

		setFilteredProducts(filtered);
		setShowMobileFilters(false);
	};

	const clearFilters = () => {
		setFilters({
			type: "All Types",
			configuration: "All Configurations",
			unitType: "All Units",
			brand: "All Brands",
			priceRange: "All Prices",
		});
		setFilteredProducts(dummyProducts);
		setShowMobileFilters(false);
	};

	return (
		<div className="min-h-screen bg-latte">
			<Navbar />

			{/* Page Title */}
			<div className="container mx-auto px-4 py-6 sm:py-8">
				<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal text-center mb-6 sm:mb-8">
					Products
				</h1>

				{/* Mobile Filter Toggle */}
				<div className="lg:hidden mb-4">
					<button
						onClick={() => setShowMobileFilters(!showMobileFilters)}
						className="w-full bg-charcoal text-latte px-4 py-3 rounded-xs flex items-center justify-center space-x-2 hover:bg-charcoal/80 transition-colors"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
							/>
						</svg>
						<span>Filters</span>
					</button>
				</div>

				{/* Filter Section */}
				<div
					className={`bg-white rounded-xs shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 ${
						showMobileFilters ? "block" : "hidden lg:block"
					}`}
				>
					<h2 className="text-lg sm:text-xl font-semibold text-charcoal mb-4">
						Filter Products
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
						{/* Appliance Type Filter */}
						<div>
							<label className="block text-sm font-medium text-charcoal mb-2">
								Appliance Type
							</label>
							<select
								value={filters.type}
								onChange={(e) => handleFilterChange("type", e.target.value)}
								className="w-full p-2 border border-silver text-charcoal rounded-xs focus:outline-none focus:ring-2 focus:ring-charcoal bg-white"
							>
								<option>All Types</option>
								<option>Washer</option>
								<option>Dryer</option>
								<option>Laundry</option>
								<option>Refrigerator</option>
								<option>Range</option>
								<option>Dishwasher</option>
								<option>Microwave</option>
							</select>
						</div>

						{/* Configuration Filter */}
						<div>
							<label className="block text-sm font-medium text-charcoal mb-2">
								Configuration
							</label>
							<select
								value={filters.configuration}
								onChange={(e) =>
									handleFilterChange("configuration", e.target.value)
								}
								className="w-full p-2 border border-silver text-charcoal rounded-xs focus:outline-none focus:ring-2 focus:ring-charcoal bg-white"
							>
								<option>All Configurations</option>
								<optgroup label="Washers">
									<option>Front Load</option>
									<option>Top Load</option>
									<option>Compact/Portable</option>
								</optgroup>
								<optgroup label="Dryers">
									<option>Electric Dryer</option>
									<option>Gas Dryer</option>
								</optgroup>
								<optgroup label="Ranges/Stoves">
									<option>Gas Range</option>
									<option>Electric Range</option>
									<option>Induction</option>
								</optgroup>
								<optgroup label="Refrigerators">
									<option>French Door</option>
									<option>Side-by-Side</option>
									<option>Top Freezer</option>
									<option>Bottom Freezer</option>
								</optgroup>
							</select>
						</div>

						{/* Unit Type Filter */}
						<div>
							<label className="block text-sm font-medium text-charcoal mb-2">
								Unit Type
							</label>
							<select
								value={filters.unitType}
								onChange={(e) => handleFilterChange("unitType", e.target.value)}
								className="w-full p-2 border border-silver text-charcoal rounded-xs focus:outline-none focus:ring-2 focus:ring-charcoal bg-white"
							>
								<option>All Units</option>
								<option>Single Unit</option>
								<option>Set</option>
								<option>Mixed Set</option>
							</select>
						</div>

						{/* Brand Filter */}
						<div>
							<label className="block text-sm font-medium text-charcoal mb-2">
								Brand
							</label>
							<select
								value={filters.brand}
								onChange={(e) => handleFilterChange("brand", e.target.value)}
								className="w-full p-2 border border-silver text-charcoal rounded-xs focus:outline-none focus:ring-2 focus:ring-charcoal bg-white"
							>
								<option>All Brands</option>
								<option>Samsung</option>
								<option>LG</option>
								<option>Whirlpool</option>
								<option>GE</option>
								<option>Maytag</option>
								<option>Frigidaire</option>
								<option>KitchenAid</option>
								<option>Bosch</option>
								<option>Electrolux</option>
							</select>
						</div>

						{/* Price Range Filter */}
						<div>
							<label className="block text-sm font-medium text-charcoal mb-2">
								Price Range
							</label>
							<select
								value={filters.priceRange}
								onChange={(e) => handleFilterChange("priceRange", e.target.value)}
								className="w-full p-2 border border-silver text-charcoal rounded-xs focus:outline-none focus:ring-2 focus:ring-charcoal bg-white"
							>
								<option>All Prices</option>
								<option>Under $200</option>
								<option>$200 - $400</option>
								<option>$400 - $600</option>
								<option>$600 - $1000</option>
								<option>$1000 - $1500</option>
								<option>$1500+</option>
							</select>
						</div>
					</div>

					{/* Filter Buttons */}
					<div className="flex flex-col sm:flex-row justify-end mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
						<button
							onClick={clearFilters}
							className="px-4 py-2 text-charcoal border border-charcoal rounded-xs hover:bg-charcoal hover:text-latte transition-colors"
						>
							Clear Filters
						</button>
						<button
							onClick={applyFilters}
							className="px-4 py-2 bg-charcoal text-latte rounded-xs hover:bg-charcoal/80 transition-colors"
						>
							Apply Filters
						</button>
					</div>
				</div>

				{/* Results Count */}
				<div className="mb-4">
					<p className="text-charcoal text-sm sm:text-base">
						Showing {filteredProducts.length} of {dummyProducts.length} products
					</p>
				</div>

				{/* Products Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
					{filteredProducts.map((product) => (
						<Link
							key={product.id}
							href={`/products/${product.id}`}
							className="bg-white rounded-xs shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
						>
							<div className="relative w-full h-64 sm:h-80 bg-silver flex items-center justify-center overflow-hidden">
								<span className="text-charcoal text-sm">Product Image</span>

								{/* Fade-in overlay */}
								<div className="absolute inset-0 bg-charcoal/90 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
									<div className="text-white">
										<h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2">
											{product.name}
										</h3>
										<div className="space-y-1 mb-3 text-xs sm:text-sm">
											<p>Brand: {product.brand}</p>
											<p>Category: {product.category}</p>
											<p>Condition: {product.condition}</p>
										</div>

										<div className="flex items-center justify-between">
											<span className="text-lg sm:text-xl font-bold">
												{product.price}
											</span>
											<span className="bg-white text-charcoal px-3 py-1 rounded-xs text-xs sm:text-sm hover:bg-gray-100 transition-colors">
												View Details
											</span>
										</div>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>

				{/* No Results Message */}
				{filteredProducts.length === 0 && (
					<div className="text-center py-12">
						<p className="text-charcoal text-lg mb-4">
							No products found matching your criteria.
						</p>
						<button
							onClick={clearFilters}
							className="bg-charcoal text-latte px-6 py-3 rounded-xs hover:bg-charcoal/80 transition-colors"
						>
							Clear All Filters
						</button>
					</div>
				)}

				{/* Load More Button */}
				{filteredProducts.length > 0 && (
					<div className="text-center mt-8">
						<button className="bg-charcoal text-latte px-6 py-3 rounded-xs hover:bg-charcoal/80 transition-colors">
							Load More Products
						</button>
					</div>
				)}
			</div>
		</div>
	);
}