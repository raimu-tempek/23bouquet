import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { PRODUCTS, type Product } from '../data/products';

type Category = 'all' | 'flower' | 'snack' | 'money';

const CATEGORY_TABS: { key: Category; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'flower', label: 'Bunga Asli' },
  { key: 'snack', label: 'Snack' },
  { key: 'money', label: 'Uang' },
];

interface ProductShowcaseProps {
  /** id section, dipakai juga sebagai target anchor */
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** Sembunyikan judul bawaan (dipakai di halaman Katalog yang punya intro sendiri). */
  hideHeader?: boolean;
  /** Produk yang ditampilkan - default semua produk. */
  products?: Product[];
  /** Tab filter kategori: dipakai di /katalog, dimatikan di beranda. Default: true. */
  showFilters?: boolean;
  /** Konten tambahan di bawah grid, mis. tombol CTA "Lihat Semua Koleksi". */
  footer?: React.ReactNode;
}

/**
 * Grid produk + filter kategori yang dipakai bersama oleh section "Semua Buket"
 * dan halaman Katalog (/katalog), supaya kartu & layout grid-nya konsisten.
 */
export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  id = 'katalog',
  eyebrow,
  title,
  subtitle,
  hideHeader = false,
  products = PRODUCTS,
  showFilters = true,
  footer,
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  // Kategori 'all' atau saat filter dimatikan (beranda) -> tampilkan semua produk yang dikirim
  const visibleProducts =
    showFilters && activeCategory !== 'all'
      ? products.filter((p) => p.category === activeCategory)
      : products;

  const filterTabs = showFilters ? (
    <div className="flex flex-wrap items-center gap-2 bg-pink-50/80 p-1.5 rounded-2xl border border-pink-100">
      {CATEGORY_TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveCategory(tab.key)}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeCategory === tab.key
              ? 'bg-[#e74694] text-white shadow-xs'
              : 'text-gray-600 hover:text-[#e74694] hover:bg-white/60'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <section id={id} className="py-12 sm:py-16 lg:py-24 bg-[#fffbfe]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        {hideHeader ? (
          filterTabs && <div className="mb-8 sm:mb-10">{filterTabs}</div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100/70 mb-3">
                <span className="text-xs font-bold text-[#e74694] uppercase tracking-wider">
                  {eyebrow}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#e74694] tracking-tight">
                {title}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-xl">
                {subtitle}
              </p>
            </div>

            {/* Filter Tabs */}
            {filterTabs}
          </div>
        )}

        {/* Product Grid */}
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl sm:rounded-3xl border-2 border-pink-500/10">
            <p className="text-base font-bold text-[#e74694]">
              Belum ada produk untuk kategori ini.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Silakan pilih kategori &quot;Semua&quot; atau &quot;Bunga Asli&quot;.
            </p>
          </div>
        )}

        {/* Konten tambahan di bawah grid (mis. CTA ke halaman katalog) */}
        {footer}

      </div>
    </section>
  );
};
