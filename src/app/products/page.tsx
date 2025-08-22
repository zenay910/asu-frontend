"use client";
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import { toPublicUrl } from "@/lib/storage";

type PhotoRow = {
  path: string;
  role: string | null;
  sort_order: number | null;
};
type ItemRow = {
  id: string;
  sku: string | null;
  brand: string | null;
  model_number: string | null;
  condition: string | null;
  price: number | null;
  category: string | null;
  photos: PhotoRow[] | null;
};

type ProductCard = {
  id: string;
  name: string;
  price: string;
  condition: string;
  brand: string;
  category: string;
  image: string | null;
};

const filterOptions = {
  types: ["Washers", "Dryers", "Stoves/Ranges"],
  configurations: {
    Washers: ["Front Load", "Top Load", "Stacked Unit"],
    Dryers: ["Front Load", "Top Load", "Stacked Unit", "Electric", "Gas"],
    "Stoves/Ranges": ["Gas", "Electric"],
  },
  unitTypes: ["Individual", "Set"],
  brands: [
    "Samsung",
    "LG",
    "Whirlpool",
    "GE",
    "Maytag",
    "Frigidaire",
    "KitchenAid",
    "Bosch",
    "Electrolux",
  ],
  priceRanges: [
    "Under $200",
    "$200 - $400",
    "$400 - $600",
    "$600 - $1000",
    "$1000 - $1500",
    "$1500+",
  ],
};

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<ProductCard[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductCard[]>([]);
  const [filters, setFilters] = useState({
    type: "All",
    configuration: "All",
    unitType: "All",
    brand: "All",
    priceRange: "All",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 1) Fetch Published items with their photos
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("items")
        .select(
          `
          id, sku, brand, model_number, condition, price, category,
          photos:item_photos ( path, role, sort_order )
        `
        )
        .eq("status", "Published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load items:", error);
        setAllProducts([]);
        setFilteredProducts([]);
        return;
      }

      // Map DB rows -> UI cards
      const mapped: ProductCard[] = (data as ItemRow[]).map((row) => {
        // pick cover photo first; else earliest by sort_order
        const sorted = (row.photos ?? []).sort((a, b) => {
          const ac = (a.role ?? "") === "cover" ? -1 : 0;
          const bc = (b.role ?? "") === "cover" ? -1 : 0;
          if (ac !== bc) return ac - bc;
          return (a.sort_order ?? 9999) - (b.sort_order ?? 9999);
        });
        const coverPath = sorted[0]?.path ?? null;
        const image = coverPath ? toPublicUrl(coverPath, { width: 800 }) : null;

        return {
          id: row.id,
          name:
            `${row.brand ?? ""} ${row.model_number ?? ""}`.trim() ||
            (row.sku ?? "Item"),
          price: row.price != null ? `$${row.price}` : "Call",
          condition: row.condition ?? "Used",
          brand: row.brand ?? "—",
          category: row.category ?? "Other",
          image,
        };
      });

      setAllProducts(mapped);
      setFilteredProducts(mapped);
    })();
  }, []);

  // 2) Your existing filter logic can stay; just use allProducts instead of dummyProducts
  const handleFilterChange = (filterType: string, value: string) => {
    const next = { ...filters, [filterType]: value };
    if (filterType === "type") {
      next.configuration = "All";
      next.unitType = "All";
    }
    setFilters(next);
  };

  const applyFilters = () => {
    let filtered = [...allProducts];
    // Example type filter mapping (adjust as you like)
    if (filters.type !== "All") {
      if (filters.type === "Washers")
        filtered = filtered.filter((p) => p.category === "Washer");
      else if (filters.type === "Dryers")
        filtered = filtered.filter((p) => p.category === "Dryer");
      else if (filters.type === "Stoves/Ranges")
        filtered = filtered.filter(
          (p) => p.category === "Stove" || p.category === "Range"
        );
    }
    if (filters.brand !== "All")
      filtered = filtered.filter((p) => p.brand === filters.brand);

    setFilteredProducts(filtered);
    setShowMobileFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      type: "All",
      configuration: "All",
      unitType: "All",
      brand: "All",
      priceRange: "All",
    });
    setFilteredProducts(allProducts);
    setShowMobileFilters(false);
  };

  return (
    <div className="min-h-screen bg-latte">
      <Navbar />
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
                <option value="All">All Types</option>
                {filterOptions.types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Configuration Filter (Conditional) */}
            {filters.type !== "All" && (
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
                  <option value="All">All Configurations</option>
                  {filterOptions.configurations[
                    filters.type as keyof typeof filterOptions.configurations
                  ]?.map((config) => (
                    <option key={config} value={config}>
                      {config}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Unit Type Filter (Conditional) */}
            {(filters.type === "Washers" || filters.type === "Dryers") && (
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Unit Type
                </label>
                <select
                  value={filters.unitType}
                  onChange={(e) =>
                    handleFilterChange("unitType", e.target.value)
                  }
                  className="w-full p-2 border border-silver text-charcoal rounded-xs focus:outline-none focus:ring-2 focus:ring-charcoal bg-white"
                >
                  <option value="All">All Units</option>
                  {filterOptions.unitTypes.map((unitType) => (
                    <option key={unitType} value={unitType}>
                      {unitType}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                <option value="All">All Brands</option>
                {filterOptions.brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) =>
                  handleFilterChange("priceRange", e.target.value)
                }
                className="w-full p-2 border border-silver text-charcoal rounded-xs focus:outline-none focus:ring-2 focus:ring-charcoal bg-white"
              >
                <option value="All">All Prices</option>
                {filterOptions.priceRanges.map((price) => (
                  <option key={price} value={price}>
                    {price}
                  </option>
                ))}
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
            Showing {filteredProducts.length} of {allProducts.length} products
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="bg-white rounded-xs shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative w-full h-64 sm:h-80 bg-silver flex items-center justify-center overflow-hidden">
                {p.image ? (
                  // If you use next/image, add your Supabase domain to next.config.js images.domains
                  // Otherwise <img> is fine too:
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-charcoal text-sm">No image</span>
                )}

                <div className="absolute inset-0 bg-charcoal/90 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <div className="text-white">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2">
                      {p.name}
                    </h3>
                    <div className="space-y-1 mb-3 text-xs sm:text-sm">
                      <p>Brand: {p.brand}</p>
                      <p>Category: {p.category}</p>
                      <p>Condition: {p.condition}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl font-bold">
                        {p.price}
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
