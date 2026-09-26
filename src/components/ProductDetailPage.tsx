import React, { useState } from 'react';
import {
  Star,
  ShoppingBag,
  Check,
  ChevronRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import type { Product } from '../data/products';

interface ProductDetailPageProps {
  product: Product;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const [added, setAdded] = useState(false);
  const { addToCart, buyNow } = useCart();
  const { navigate } = useRouter();

  /** "Beli Sekarang": produk ikut ke keranjang lalu buka /checkout. */
  const handleBuyNow = () => {
    buyNow({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    });
  };

  const handleAddToCart = () => {
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
    <div className="pt-24 sm:pt-28 pb-16 sm:pb-24 bg-[#fffbfe] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigasi balik ditangani breadcrumb di bawah ini, jadi tidak ada
            lagi link "Kembali ke Katalog" terpisah di halaman ini. */}

        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 flex-wrap"
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            className="hover:text-[#e74694] transition-colors cursor-pointer"
          >
            Beranda
          </button>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          <button
            type="button"
            onClick={() => navigate('/katalog')}
            className="hover:text-[#e74694] transition-colors cursor-pointer"
          >
            Katalog
          </button>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
          <span className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Big Product Image */}
          <div className="lg:col-span-6 w-full">
            <div className="relative w-full aspect-4/5 rounded-3xl overflow-hidden bg-pink-50/50 border-2 border-pink-500/10 shadow-lg shadow-pink-900/5">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 sm:top-5 sm:left-5 px-3.5 py-1.5 bg-[#e74694] text-white text-xs sm:text-sm font-bold rounded-full shadow-md">
                  {product.badge}
                </span>
              )}
            </div>
          </div>
          {/* Right Column: Product Info & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Badge & Category */}
              <div className="flex items-center gap-2 mb-3">
                {product.badge && (
                  <span className="inline-block px-3 py-1 bg-pink-100 text-[#e74694] text-xs font-bold rounded-full uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Bunga Asli Pilihan
                </span>
              </div>

              {/* Product Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                  <span className="text-sm sm:text-base font-extrabold text-gray-800 ml-1.5">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-xs sm:text-sm text-gray-500">
                  {product.reviewsCount} reviews
                </span>
              </div>

              {/* Price Block */}
              <div className="p-4 sm:p-5 rounded-2xl bg-pink-50/60 border border-pink-100 mb-6 sm:mb-8">
                <div className="text-xs text-gray-500 mb-1 font-medium">Harga Spesial</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#e74694]">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm sm:text-base text-gray-400 line-through">
                      Rp {product.originalPrice.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                  Deskripsi Produk
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {product.description ||
                    'Rangkaian buket bunga segar berkualitas tinggi yang dirangkai dengan teliti dan penuh dedikasi oleh florist profesional 23Bouquet.'}
                </p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 pb-6 border-t border-b border-gray-100 mb-8">
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <Truck className="w-4 h-4 text-[#e74694] shrink-0" />
                  <span>Pengiriman Aman</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-[#e74694] shrink-0" />
                  <span>100% Bunga Segar</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-600">
                  <HeartHandshake className="w-4 h-4 text-[#e74694] shrink-0" />
                  <span>Garansi Kepuasan</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-3.5 sm:py-4 px-6 bg-[#e74694] hover:bg-[#db2777] text-white font-bold text-base rounded-2xl transition-all shadow-lg shadow-pink-200 active:scale-95 cursor-pointer"
              >
                Beli Sekarang
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`py-3.5 sm:py-4 px-6 rounded-2xl border font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  added
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-pink-200 hover:bg-pink-50 text-[#e74694]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Ditambahkan</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>+ Keranjang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
