export const dynamic = 'force-dynamic';
export const revalidate = 0;
import supabase from '@/lib/supabaseClient';
import { toPublicUrl } from '@/lib/storage';
import ProductGallery from '@/components/ProductGallery';
import Link from 'next/link';

function formatDimensions(dimensions: unknown) {
  if (!dimensions) return null;

  if (typeof dimensions === 'string') {
    return dimensions;
  }

  if (typeof dimensions === 'object') {
    const record = dimensions as Record<string, unknown>;
    const width = record.width_in ?? record.width;
    const depth = record.depth_in ?? record.depth;
    const height = record.height_in ?? record.height;

    if (width != null && depth != null && height != null) {
      return `${width} x ${depth} x ${height}`;
    }

    return Object.values(record)
      .filter((value) => value != null && value !== '')
      .join(' x ');
  }

  return String(dimensions);
}

function formatFeatures(features: unknown) {
  if (!features) return [] as string[];

  if (Array.isArray(features)) {
    return features
      .map((feature) => String(feature).trim())
      .filter(Boolean);
  }

  if (typeof features === 'string') {
    return features
      .split(/,|\n|;/)
      .map((feature) => feature.trim())
      .filter(Boolean);
  }

  return [String(features)];
}

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
  const gallery = (data.product_images ?? []).map((img: any) => ({
    path: img.photo_url,
    url: toPublicUrl(img.photo_url),
    thumb: toPublicUrl(img.photo_url, { width: 320, quality: 75, format: 'webp' })
  }));

  return { ...data, gallery };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProduct(id);
  const features = formatFeatures(product?.features);
  if (!product) {
    return (
      <div className="min-h-screen bg-smoke text-charcoal">
        <header className="border-b-2 border-crimson bg-charcoal px-5 sm:px-12">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
            <Link
              href="/"
              className="font-sans text-[18px] font-bold uppercase tracking-[0.07em] text-white sm:text-[20px]"
            >
              ASU Appliances
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-[2px] bg-crimson px-5 py-2.5 font-sans text-[14px] font-medium text-white transition-colors hover:bg-crimson-lt"
            >
              Book a Repair
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-12">
          <h1 className="mb-4 text-3xl font-bold tracking-[-0.02em] text-charcoal sm:text-4xl">
            Product Not Found
          </h1>
          <Link href="/products" className="text-charcoal underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const title =
    product.title ||
    `${product.brand ? `${product.brand} ` : ''}${product.model_number || 'Appliance'}`;

  return (
    <div className="min-h-screen bg-smoke text-charcoal">
      <header className="border-b-2 border-crimson bg-charcoal px-5 sm:px-12">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="font-sans text-[18px] font-bold uppercase tracking-[0.07em] text-white sm:text-[20px]"
          >
            ASU Appliances
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-[2px] bg-crimson px-5 py-2.5 font-sans text-[14px] font-medium text-white transition-colors hover:bg-crimson-lt"
          >
            Book a Repair
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-charcoal px-5 pb-10 pt-12 text-white sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(140,31,31,0.16)_0%,transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/products"
            className="mb-4 inline-block font-mono text-[10px] uppercase tracking-[0.18em] text-[#ababab] underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            ← Back to Products
          </Link>
          <h1 className="max-w-4xl text-[clamp(2.2rem,5.2vw,3.8rem)] font-bold leading-[0.95] tracking-[-0.03em] text-white">
            {title}
          </h1>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <span className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
              {product.price != null ? `$${product.price}` : 'Call for Price'}
            </span>
            {product.condition && (
              <span className="rounded-[2px] border border-[#3a3a3a] bg-[#ffffff12] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[#ddd]">
                {product.condition}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-12 sm:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2px] border border-rule bg-white p-4 shadow-sm sm:p-5">
            <ProductGallery images={product.gallery} alt={product.model_number || 'Appliance'} />
          </div>

          <div className="space-y-6">
            <section className="rounded-[2px] border border-rule bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-crimson">
                Product Details
              </h2>

              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                {product.brand && (
                  <>
                    <dt className="font-medium text-charcoal">Brand</dt>
                    <dd className="text-charcoal/80">{product.brand}</dd>
                  </>
                )}
                {product.type && (
                  <>
                    <dt className="font-medium text-charcoal">Type</dt>
                    <dd className="text-charcoal/80">{product.type}</dd>
                  </>
                )}
                {product.fuel && (
                  <>
                    <dt className="font-medium text-charcoal">Fuel</dt>
                    <dd className="text-charcoal/80">{product.fuel}</dd>
                  </>
                )}
                {product.color && (
                  <>
                    <dt className="font-medium text-charcoal">Color</dt>
                    <dd className="text-charcoal/80">{product.color}</dd>
                  </>
                )}
                {product.capacity && (
                  <>
                    <dt className="font-medium text-charcoal">Capacity (Cu. Ft.)</dt>
                    <dd className="text-charcoal/80">{product.capacity}</dd>
                  </>
                )}
                {product.dimensions && (
                  <>
                    <dt className="font-medium text-charcoal">Dimensions</dt>
                    <dd className="text-charcoal/80">
                      {formatDimensions(product.dimensions)}
                    </dd>
                  </>
                )}
                {features.length > 0 && (
                  <>
                    <dt className="font-medium text-charcoal">Features</dt>
                    <dd className="text-charcoal/80">
                      <ul className="list-disc space-y-1 pl-5">
                        {features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </dd>
                  </>
                )}
              </dl>
            </section>

            {product.description_long && (
              <section className="rounded-[2px] border border-rule bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-crimson">
                  Description
                </h2>
                <p className="whitespace-pre-line text-[15px] leading-7 text-charcoal/85">
                  {product.description_long}
                </p>
              </section>
            )}

            <section className="rounded-[2px] border border-rule bg-charcoal p-5 text-white shadow-sm sm:p-6">
              <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-crimson-lt">
                Interested In This Unit?
              </h2>
              <p className="mb-5 text-[15px] leading-7 text-[#bababa]">
                Call for availability, delivery options, and final details.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="tel:8018337629"
                  className="inline-flex items-center justify-center rounded-[2px] bg-crimson px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-crimson-lt"
                >
                  (801) 833-7629
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-[2px] border border-[#3c3c3c] px-6 py-3 text-[15px] font-medium text-[#ddd] transition-colors hover:border-[#555] hover:bg-[#ffffff12] hover:text-white"
                >
                  Contact About This Item
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
