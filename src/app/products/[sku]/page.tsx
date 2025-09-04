import React from 'react';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import supabase from '@/lib/supabaseClient';
import Navbar from '@/components/navbar';
import ProductGallery from '@/components/ProductGallery';
import { toPublicUrl } from '@/lib/storage';
import Link from 'next/link';

async function fetchProduct(sku: string) {
  const cols = `
    sku,
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
    description_long,
    dimensions,
    capacity,
    color,
    features,
    photos:item_photos ( path, role, sort_order )
  `;
  const { data, error } = await supabase
    .from('items')
    .select(cols)
    .eq('sku', sku)
    .maybeSingle();
  if (error) { console.error('Fetch product failed', error); return null; }
  if (!data) return null;
  const sortedPhotos = (data.photos ?? []).sort((a: any, b: any) => {
    const ac = (a.role ?? '') === 'cover' ? -1 : 0;
    const bc = (b.role ?? '') === 'cover' ? -1 : 0;
    if (ac !== bc) return ac - bc;
    return (a.sort_order ?? 9999) - (b.sort_order ?? 9999);
  });
  const gallery = sortedPhotos.map((p: any) => ({
    path: p.path,
    url: toPublicUrl(p.path, { width: 1200, quality: 75, format: 'webp' }),
    thumb: toPublicUrl(p.path, { width: 300, quality: 60, format: 'webp' })
  }));
  return { ...data, gallery };
}

export default async function ProductDetailBySkuPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const product = await fetchProduct(sku);
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
          <ProductGallery images={product.gallery} alt={product.model_number || product.sku || 'Appliance'} />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-2">
              {product.title || `${product.brand ? product.brand + ' ' : ''}${product.model_number || product.sku || 'Appliance'}`}
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
              {product.color && <><dt className="font-medium text-charcoal">Color</dt><dd className="text-charcoal/80">{product.color}</dd></>}
              {product.capacity && <><dt className="font-medium text-charcoal">Capacity (in Cu. Ft.)</dt><dd className="text-charcoal/80">{product.capacity}</dd></>}
            </dl>
            {product.description_long && (
              <div className="prose prose-sm max-w-none mb-8">
                <h2 className="font-semibold text-charcoal mb-2">Description</h2>
                <p className="text-charcoal/80 whitespace-pre-line">{product.description_long}</p>
              </div>
            )}
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
