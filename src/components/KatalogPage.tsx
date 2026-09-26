import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { PRODUCTS, type ProductBadge } from '../data/products';

type FilterTabKey = 'all' | ProductBadge;

const FILTER_TABS: { key: FilterTabKey; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'Best Seller', label: 'Best Seller' },
  { key: 'Elegan', label: 'Elegan' },
  { key: 'Ekonomis', label: 'Ekonomis' },
];

/**
 * Halaman showcase khusus katalog (route /katalog).
 * Menampilkan header baru: background bersih/transparan, badge "✨ JELAJAHI KOLEKSI",
 * judul & subtitle di kiri, serta 4 tab filter kategori di kanan rata bawah (scrollable horizontal).
 */
export const KatalogPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTabKey>('all');

  const visibleProducts =
    activeTab === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.badge === activeTab);

  return (
    <div className="bg-[#fffbfe]">
      <section id="katalog-list" className="py-10 sm:py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Filter Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-14">
            {/* Bagian Kiri: Flex-grow selebar mungkin */}
            <div className="flex-1 min-w-0">
              {/* Badge kecil pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 text-[#e74694] mb-3">
                <Sparkles className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  JELAJAHI KOLEKSI
                </span>
              </div>

              {/* Judul Besar */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#e74694] tracking-tight">
                Setiap Buket, Setiap Cerita
              </h1>

              {/* Subtitle Abu-abu */}
              <p className="text-gray-500 text-sm sm:text-base lg:text-lg leading-relaxed mt-2.5 max-w-2xl">
                Dari yang klasik sampai yang custom, semua ada di sini &mdash; tinggal pilih yang paling pas buat kamu.
              </p>
            </div>

            {/* Bagian Kanan: Tab filter kategori (rata bawah, scroll horizontal jika layar sempit) */}
            <div className="w-full lg:w-auto shrink-0 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-pink-100/70 p-1.5 rounded-full border border-pink-200/60 whitespace-nowrap">
                {FILTER_TABS.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-[#e74694] text-white shadow-sm'
                          : 'text-gray-600 hover:text-[#e74694] hover:bg-white/60'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

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
                Silakan pilih kategori &quot;Semua&quot;.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
