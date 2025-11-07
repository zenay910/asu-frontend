"use client";
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import { toPublicUrl } from "@/lib/storage";

// ---------- Types ----------
type ProductImage = {
  id: string;
  photo_url: string;
  product_id: string;
};

type Product = {
  id: string;
  title: string;
  brand: string;
  price: number;
  model_number: string;
  type: string | null;
  configuration: string | null;
  unit_type: string | null;
  fuel: string | null;
  color: string | null;
  condition: string | null;
  status: string | null;
  description_long: string | null;
  product_images: ProductImage[];
};

type ProductCard = {
  id: string;
  name: string;
  price: string; // formatted for UI
  priceNumber: number | null; // raw for filtering
  condition: string;
  brand: string;
  type: string; // maps from DB `type`
  configuration?: string | null;
  unitType?: string | null;
  fuel?: string | null;
  image: string | null;
};

const filterOptions = {
  types: ["Washers", "Dryers", "Stoves/Ranges"],
  configurations: {
    Washers: ["Front Load", "Top Load", "Stacked Unit"],
    Dryers: ["Front Load", "Top Load", "Stacked Unit"], // moved Electric/Gas out
    "Stoves/Ranges": [], // we filter those by fuel only
  },
  unitTypes: ["Individual", "Set"],
  fuels: ["Electric", "Gas"], // NEW
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
} as const;

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<ProductCard[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    type: "All",
    configuration: "All",
    unitType: "All",
    fuel: "All", // NEW
    brand: "All",
    priceRange: "All",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 1) Fetch Published items with their photos
  useEffect(() => {
    (async () => {
      setLoading(true);
      console.log("Fetching products from Supabase...");
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          id,
          title,
          brand,
          price,
          model_number,
          condition,
          status,
          type,
          configuration,
          unit_type,
          fuel,
          color,
          product_images (
            id,
            photo_url,
            product_id
          )
        `
        )
        .eq("status", "Published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load products:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        setAllProducts([]);
        setFilteredProducts([]);
        setLoading(false);
        return;
      }

      console.log("Fetched data:", data);
      console.log("Number of products:", data?.length || 0);

      const mapped: ProductCard[] = (data || []).map((row: any) => {
        // Get the first image from product_images array
        const images = row.product_images || [];
        const firstImage = images[0];
        const image = firstImage?.photo_url || null;

        const priceNumber = row.price === null ? null : Number(row.price);

        return {
          id: row.id,
          name: row.title || `${row.brand ? row.brand + ' ' : ''}${row.model_number || 'Item'}`.trim(),
          price: priceNumber != null ? `$${priceNumber}` : "Call",
          priceNumber,
          condition: row.condition ?? "Good",
          brand: row.brand ?? "—",
          type: row.type ?? "Other",
          configuration: row.configuration ?? null,
          unitType: row.unit_type ?? null,
          fuel: row.fuel ?? null,
          image,
        };
      });

      setAllProducts(mapped);
      setFilteredProducts(mapped);
      setLoading(false);
    })();
  }, []);

  // 2) Filter handlers
  const handleFilterChange = (filterType: string, value: string) => {
    const next = { ...filters, [filterType]: value } as typeof filters;
    if (filterType === "type") {
      next.configuration = "All";
      next.unitType = "All";
    }
    setFilters(next);
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    // Type
    if (filters.type !== "All") {
      if (filters.type === "Washers")
        filtered = filtered.filter((p) => p.type === "Washer");
      else if (filters.type === "Dryers")
        filtered = filtered.filter((p) => p.type === "Dryer");
      else if (filters.type === "Stoves/Ranges")
        filtered = filtered.filter(
          (p) => p.type === "Stove" || p.type === "Range"
        );
    }

    // Configuration (no Electric/Gas here anymore)
    if (filters.configuration !== "All" && filters.type !== "All") {
      filtered = filtered.filter(
        (p) =>
          (p.configuration ?? "").toLowerCase() ===
          filters.configuration.toLowerCase()
      );
    }

    // Fuel
    if (filters.fuel !== "All") {
      filtered = filtered.filter(
        (p) => (p.fuel ?? "").toLowerCase() === filters.fuel.toLowerCase()
      );
    }

    // Unit Type
    if (filters.unitType !== "All") {
      filtered = filtered.filter(
        (p) =>
          (p.unitType ?? "").toLowerCase() === filters.unitType.toLowerCase()
      );
    }

    // Brand
    if (filters.brand !== "All") {
      filtered = filtered.filter((p) => p.brand === filters.brand);
    }

    // Price Range
    if (filters.priceRange !== "All") {
      filtered = filtered.filter((p) => {
        const price = p.priceNumber;
        if (price == null) return false;
        switch (filters.priceRange) {
          case "Under $200":
            return price < 200;
          case "$200 - $400":
            return price >= 200 && price <= 400;
          case "$400 - $600":
            return price > 400 && price <= 600;
          case "$600 - $1000":
            return price > 600 && price <= 1000;
          case "$1000 - $1500":
            return price > 1000 && price <= 1500;
          case "$1500+":
            return price > 1500;
          default:
            return true;
        }
      });
    }

    setFilteredProducts(filtered);
    setShowMobileFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      type: "All",
      configuration: "All",
      unitType: "All",
      fuel: "All", // NEW
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

            {/* Fuel Filter (Dryers & Stoves/Ranges) */}
            {(filters.type === "Dryers" ||
              filters.type === "Stoves/Ranges") && (
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Fuel
                </label>
                <select
                  value={filters.fuel}
                  onChange={(e) => handleFilterChange("fuel", e.target.value)}
                  className="w-full p-2 border border-silver text-charcoal rounded-xs focus:outline-none focus:ring-2 focus:ring-charcoal bg-white"
                >
                  <option value="All">All Fuel Types</option>
                  {filterOptions.fuels.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
            {loading ? (
              "Loading products…"
            ) : (
              <>
                Showing {filteredProducts.length} of {allProducts.length}{" "}
                products
              </>
            )}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {(!loading
            ? filteredProducts
            : (Array.from({ length: 8 }).map((_, i) => ({
                id: `skeleton-${i}`,
              })) as any)
          ).map((p: ProductCard & { id: string }) => (
            <Link
              key={p.id}
              href={typeof p === "object" ? `/products/${p.id}` : "#"}
              className="bg-white rounded-xs shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative w-full h-64 sm:h-80 bg-silver flex items-center justify-center overflow-hidden">
                {loading ? (
                  <div className="animate-pulse w-full h-full bg-gray-200" />
                ) : p.image ? (
                  // If you use next/image, add your Supabase domain to next.config.js images.domains
                  // Otherwise <img> is fine too:
                  <img
                    src={p.image as string}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-charcoal text-sm">No image</span>
                )}

                {!loading && (
                  <div className="absolute inset-0 bg-charcoal/90 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    <div className="text-white">
                      <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2">
                        {p.name}
                      </h3>
                      <div className="space-y-1 mb-3 text-xs sm:text-sm">
                        <p>Brand: {p.brand}</p>
                        <p>Type: {p.type}</p>
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
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* No Results Message */}
        {!loading && filteredProducts.length === 0 && (
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

        {/* Load More Button (placeholder for future pagination) */}
        {!loading && filteredProducts.length > 0 && (
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
