import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import { DELIVERY_FEE, formatRupiahSpaced } from '../data/bouquet-options';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { navigate } = useRouter();

  const goToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-all duration-300 ease-out">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#fce8f3]/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#e74694]" />
              <h2 className="text-xl font-bold text-gray-900">Keranjang Belanja</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#e74694] text-white">
                {items.length}
              </span>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-white text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
                <div className="w-20 h-20 rounded-full bg-[#fce8f3] flex items-center justify-center mb-4 text-3xl">
                  💐
                </div>
                <p className="text-lg font-bold text-gray-800">Keranjang masih kosong</p>
                <p className="text-sm text-gray-500 max-w-xs mt-1">
                  Pilih buket favoritmu sekarang dan kirimkan senyuman untuk orang tersayang!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-[#e74694] text-white font-semibold rounded-full hover:bg-[#db2777] transition-all shadow-md shadow-pink-200"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-pink-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-[#e74694] font-bold text-sm mt-0.5">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                    {item.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">
                        Rp {item.originalPrice.toLocaleString('id-ID')}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-gray-200 transition-colors text-gray-600"
                          aria-label="Kurangi kuantitas"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-gray-200 transition-colors text-gray-600"
                          aria-label="Tambah kuantitas"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Hapus produk"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/70 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimasi Pengiriman</span>
                  <span className="font-medium text-gray-900">
                    {formatRupiahSpaced(DELIVERY_FEE)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#e74694] text-lg">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={goToCheckout}
                  className="w-full py-3.5 bg-[#e74694] hover:bg-[#db2777] text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-200 active:scale-[0.99]"
                >
                  <span>Lanjut ke Pembayaran</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Kosongkan Keranjang
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

