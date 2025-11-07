import React from 'react';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import supabase from '@/lib/supabaseClient';
import Navbar from '@/components/navbar';
import ProductGallery from '@/components/ProductGallery';
import Link from 'next/link';

async function fetchProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
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
      description_long,
      dimensions,
      capacity,
      color,
      features,
      product_images (
        id,
        photo_url,
        product_id
      )
    `)
    .eq('id', id)
    .maybeSingle();
  
  if (error) { 
    console.error('Fetch product failed', error); 
    return null; 
  }
  if (!data) return null;

  // Map product_images to gallery format
  const gallery = (data.product_images ?? []).map((img: any, idx: number) => ({
    path: img.photo_url, // Use photo_url as path identifier
    url: img.photo_url,
    thumb: img.photo_url // Can add transformation later if needed
  }));

  return { ...data, gallery };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProduct(id);
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
          <ProductGallery images={product.gallery} alt={product.model_number || 'Appliance'} />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-2">
              {product.title || `${product.brand ? product.brand + ' ' : ''}${product.model_number || 'Appliance'}`}
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
