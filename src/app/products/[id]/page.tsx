import React from 'react';

// Ensure this route is always dynamic so freshly added products resolve immediately.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import supabase from '@/lib/supabaseClient';
import Navbar from '@/components/navbar';
import ProductGallery from '@/components/ProductGallery';
import { toPublicUrl } from '@/lib/storage';
import Link from 'next/link';

// We use a server component (default) for SEO-friendly product details.
// This will fetch the product record and related photos by id.

async function fetchProduct(id: string) {
  // Base columns we know exist from listing page
  const baseColumns = `
      id,
      sku,
      model_number,
      condition,
      price,
      status,
      type,
      configuration,
      unit_type,
      fuel,
      brand:brands_new(name),
      photos:item_photos_new ( path, role, sort_order )
  `;

  // Attempt extended selection first (future expansion) – currently removed because of 42703 errors
  const { data, error } = await supabase
    .from('items_new')
    .select(baseColumns)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Fetch product failed', error);
    return null;
  }
  if (!data) return null;
  const sortedPhotos = (data.photos ?? []).sort((a: any, b: any) => {
    const ac = (a.role ?? '') === 'cover' ? -1 : 0;
    const bc = (b.role ?? '') === 'cover' ? -1 : 0;
    if (ac !== bc) return ac - bc;
    return (a.sort_order ?? 9999) - (b.sort_order ?? 9999);
  });

  const gallery = sortedPhotos.map((p: any) => ({
    path: p.path,
    url: toPublicUrl(p.path),
    thumb: toPublicUrl(p.path, { width: 300 })
  }));

  return { ...data, gallery };
}

interface ProductPageProps { params: { id: string } }

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await fetchProduct(params.id);
  if (!product) {
    return (
      <div className="min-h-screen bg-latte">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-charcoal mb-4">Product Not Found</h1>
          <Link href="/products" className="text-charcoal underline">Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-latte">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <Link href="/products" className="text-charcoal text-sm underline inline-block mb-4">&larr; Back to Products</Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images */}
          <ProductGallery
            images={product.gallery}
            alt={product.model_number || product.sku || 'Appliance'}
          />

          {/* Right: Details */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-2">
              {(() => {
                // Supabase nested select may return single object or array depending on relationship config
                const b: any = product.brand;
                const brandName = Array.isArray(b) ? b[0]?.name : b?.name;
                return `${brandName ? brandName + ' ' : ''}${product.model_number || product.sku || 'Appliance'}`;
              })()}
            </h1>
            <div className="flex items-end gap-4 mb-6">
              <span className="text-3xl font-semibold text-charcoal">{product.price != null ? `$${product.price}` : 'Call for Price'}</span>
              {product.condition && <span className="px-3 py-1 text-xs bg-charcoal text-white rounded-xs uppercase tracking-wide">{product.condition}</span>}
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-8">
              {product.type && <><dt className="font-medium text-charcoal">Type</dt><dd className="text-charcoal/80">{product.type}</dd></>}
              {product.configuration && <><dt className="font-medium text-charcoal">Configuration</dt><dd className="text-charcoal/80">{product.configuration}</dd></>}
              {product.unit_type && <><dt className="font-medium text-charcoal">Unit Type</dt><dd className="text-charcoal/80">{product.unit_type}</dd></>}
              {product.fuel && <><dt className="font-medium text-charcoal">Fuel</dt><dd className="text-charcoal/80">{product.fuel}</dd></>}
              {product.model_number && <><dt className="font-medium text-charcoal">Model Number</dt><dd className="text-charcoal/80">{product.model_number}</dd></>}
            </dl>


            <div className="space-y-3">
              <button className="w-full sm:w-auto bg-charcoal text-white px-6 py-3 rounded-xs hover:bg-charcoal/80 transition">Contact About This Item</button>
              <Link href="/contact" className="block text-center sm:inline-block sm:ml-4 text-charcoal underline text-sm">General Inquiries</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
