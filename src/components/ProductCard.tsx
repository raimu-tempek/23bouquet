import React, { useState } from 'react';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import type { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

/**
 * Kartu produk yang dipakai bersama oleh section "Semua Buket" (beranda) dan
 * halaman Katalog (/katalog) supaya tampilannya konsisten.
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [added, setAdded] = useState(false);
  const { addToCart, buyNow } = useCart();
  const { navigate } = useRouter();

  const handleCardClick = () => {
    navigate(`/produk/${product.slug}`);
  };

  /** "Beli Sekarang": produk langsung ikut ke keranjang lalu buka /checkout. */
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    buyNow({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="bg-white rounded-2xl sm:rounded-3xl border-2 border-pink-500/10 p-4 sm:p-5 flex flex-col justify-between group hover:border-[#e74694]/40 hover:shadow-xl hover:shadow-pink-900/5 transition-all duration-300 cursor-pointer select-none"
    >
      <div>
        {/* Image Container with Badge */}
        <div className="relative w-full aspect-4/5 rounded-xl sm:rounded-2xl overflow-hidden bg-pink-50/40 mb-4">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badge (opsional) - semua label memakai satu warna pink solid yang sama
              agar rapi, yang membedakan hanya teks labelnya
              (Best Seller, Trending, Elegan, Populer, Baru, Ekonomis) */}
          {product.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-[#e74694] text-white text-[11px] font-bold rounded-full shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-[#e74694] transition-colors">
          {product.name}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1.5 my-2">
          <div className="flex items-center text-amber-500">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-extrabold text-gray-800 ml-1">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            ({product.reviewsCount} reviews)
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-2 mb-4">
          <span className="text-2xl font-extrabold text-gray-900">
            Rp {product.price.toLocaleString('id-ID')}
          </span>
          <span className="text-xs text-gray-400 line-through">
            Rp {product.originalPrice.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 py-3 px-4 bg-[#e74694] hover:bg-[#db2777] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-md shadow-pink-200 active:scale-95 text-center cursor-pointer"
        >
          Beli Sekarang
        </button>

        <button
          type="button"
          onClick={handleQuickAdd}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            added
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-pink-200 hover:bg-pink-50 text-[#e74694]'
          }`}
          aria-label={`Tambah ${product.name} ke keranjang`}
        >
          {added ? (
            <Check className="w-5 h-5" />
          ) : (
            <ShoppingBag className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
