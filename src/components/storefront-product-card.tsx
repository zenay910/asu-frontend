import Image from "next/image";
import Link from "next/link";

type StorefrontProductCardProps = {
  id: string;
  image: string | null;
  title: string;
  price: string;
  status?: string | null;
  brand: string;
  type: string;
  condition: string;
  loading?: boolean;
  className?: string;
};

export function StorefrontProductCard({
  id,
  image,
  title,
  price,
  status,
  brand,
  type,
  condition,
  loading = false,
  className,
}: StorefrontProductCardProps) {
  const normalizedStatus = (status ?? "published").toLowerCase();
  const cardClassName = [
    "group block overflow-hidden rounded-lg border border-rule bg-white text-charcoal shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-charcoal/40 hover:shadow-md",
    loading ? "pointer-events-none" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={loading ? "#" : `/products/${id}`}
      aria-disabled={loading}
      className={cardClassName}
    >
      <article>
        <div className="relative flex h-64 w-full items-center justify-center overflow-hidden bg-smoke sm:h-80">
          {!loading && normalizedStatus !== "published" && (
            <span
              className={`absolute right-2 top-2 z-10 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm sm:text-xs ${
                normalizedStatus === "sold"
                  ? "bg-emerald-700 text-white"
                  : "bg-zinc-700 text-zinc-100"
              }`}
            >
              {status}
            </span>
          )}

          {loading ? (
            <div className="h-full w-full animate-pulse bg-charcoal/10" />
          ) : image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <span className="text-sm text-mid">No image</span>
          )}

          {!loading && (
            <div className="absolute inset-0 flex flex-col bg-charcoal/90 p-4 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out group-hover:opacity-100">
              <div className="text-white">
                <h3 className="mb-2 line-clamp-2 text-base font-semibold sm:text-lg">
                  {title}
                </h3>
                <div className="mb-3 space-y-1 text-xs text-[#c3c3c3] sm:text-sm">
                  <p>Brand: {brand}</p>
                  <p>Type: {type}</p>
                  <p>Condition: {condition}</p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3">
                <span className="text-lg font-bold text-white sm:text-xl">{price}</span>
                <span className="rounded-[2px] bg-white px-3 py-1 text-xs font-medium text-charcoal sm:text-sm">
                  More Details
                </span>
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}