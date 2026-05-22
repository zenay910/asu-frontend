"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import { toPublicUrl } from "@/lib/storage";
import { StorefrontProductCard } from "@/components/storefront-product-card";
import Navbar from "@/components/navbar";

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
        const image = firstImage?.photo_url
          ? toPublicUrl(firstImage.photo_url)
          : null;

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
    <div className="min-h-screen bg-smoke text-charcoal">
      <Navbar ctaLabel="Book a Repair" ctaHref="/contact" />

      <section className="relative overflow-hidden bg-charcoal px-5 pb-10 pt-28 text-white sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(140,31,31,0.16)_0%,transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-crimson-lt sm:text-[11px]">
            <span className="h-0.5 w-5 bg-crimson" />
            Inventory
          </div>
          <h1 className="text-[clamp(2.2rem,5.5vw,4rem)] font-bold leading-[0.95] tracking-[-0.03em] text-white">
            Refurbished Appliances
            <span className="mt-1 block font-light text-[#9a9a9a]">
              Ready for your home.
            </span>
          </h1>
          <p className="mt-5 max-w-3xl text-[16px] leading-7 text-[#b5b5b5] sm:text-[17px]">
            Shop tested units with transparent pricing. Use filters to find the
            right type, fuel, and brand quickly.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-12 sm:py-8">

        {/* Mobile Filter Toggle */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex w-full items-center justify-center space-x-2 rounded-[2px] bg-charcoal px-4 py-3 text-white transition-colors hover:bg-charcoal/85"
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
          className={`mb-6 rounded-[2px] border border-rule bg-white p-4 shadow-sm sm:mb-8 sm:p-6 ${
            showMobileFilters ? "block" : "hidden lg:block"
          }`}
        >
          <h2 className="mb-4 text-lg font-semibold text-charcoal sm:text-xl">
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
                className="w-full rounded-[2px] border border-rule bg-white p-2 text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal"
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
                  className="w-full rounded-[2px] border border-rule bg-white p-2 text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal"
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
                  className="w-full rounded-[2px] border border-rule bg-white p-2 text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal"
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
                className="w-full rounded-[2px] border border-rule bg-white p-2 text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal"
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
                  className="w-full rounded-[2px] border border-rule bg-white p-2 text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal"
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
                className="w-full rounded-[2px] border border-rule bg-white p-2 text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal"
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
          <div className="mt-4 flex flex-col justify-end space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <button
              onClick={clearFilters}
              className="rounded-[2px] border border-charcoal px-4 py-2 text-charcoal transition-colors hover:bg-charcoal hover:text-white"
            >
              Clear Filters
            </button>
            <button
              onClick={applyFilters}
              className="rounded-[2px] bg-charcoal px-4 py-2 text-white transition-colors hover:bg-charcoal/85"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-charcoal sm:text-base">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {(!loading
            ? filteredProducts
            : (Array.from({ length: 8 }).map((_, i) => ({
                id: `skeleton-${i}`,
              })) as any)
          ).map((p: ProductCard & { id: string }) => (
            <StorefrontProductCard
              key={p.id}
              id={p.id}
              image={loading ? null : p.image}
              title={loading ? "Loading..." : p.name}
              price={loading ? "..." : p.price}
              status={loading ? null : "Published"}
              brand={loading ? "..." : p.brand}
              type={loading ? "..." : p.type}
              condition={loading ? "..." : p.condition}
              loading={loading}
            />
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
              className="rounded-[2px] bg-charcoal px-6 py-3 text-white transition-colors hover:bg-charcoal/85"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Load More Button (placeholder for future pagination) */}
        {!loading && filteredProducts.length > 0 && (
          <div className="text-center mt-8">
            <button className="rounded-[2px] bg-charcoal px-6 py-3 text-white transition-colors hover:bg-charcoal/85">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
