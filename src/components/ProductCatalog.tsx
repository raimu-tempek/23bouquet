import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductShowcase } from './ProductShowcase';
import { FEATURED_PRODUCTS } from '../data/products';
import { useRouter } from '../context/RouterContext';

/**
 * Section "Semua Buket" di beranda.
 *
 * Beranda hanya menampilkan produk unggulan (FEATURED_PRODUCTS) tanpa tab filter -
 * daftar lengkap 24 produk + filternya ada di halaman Katalog (/katalog). Kartu dan
 * layout grid tetap memakai <ProductShowcase /> yang sama, jadi tampilannya konsisten.
 */
export const ProductCatalog: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <ProductShowcase
      id="katalog"
      eyebrow="Koleksi Terlaris"
      title="Rekomendasi Buket Paling Favorit"
      subtitle="Pilihan buket cantik yang paling sering dipesan dan disukai oleh pelanggan setia 23Bouquet."
      products={FEATURED_PRODUCTS}
      showFilters={false}
      footer={
        <div className="flex justify-center mt-10 sm:mt-12">
          <a
            href="/katalog"
            onClick={(e) => {
              e.preventDefault();
              navigate('/katalog');
            }}
            className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 bg-[#e74694] hover:bg-[#db2777] text-white text-sm sm:text-base font-bold rounded-2xl shadow-lg shadow-pink-300/40 transition-all active:scale-95 text-center"
          >
            Lihat Semua Koleksi
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      }
    />
  );
};
