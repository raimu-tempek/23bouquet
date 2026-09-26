import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from './RouterContext';

/** Satu baris rincian biaya di dalam item (mis. "Wrapping", "Bunga"). */
export interface CartItemLine {
  label: string;
  amount: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  /**
   * Rincian biaya untuk item custom buket, ditampilkan di halaman checkout.
   *
   * Sengaja opsional: produk katalog tidak punya rincian, jadi halaman
   * checkout cukup menampilkannya sebagai satu baris biasa. Item yang sudah
   * tersimpan di localStorage sebelum field ini ada juga tetap valid.
   */
  lines?: CartItemLine[];
  /** Catatan florist yang menempel ke item ini. */
  note?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  /**
   * Tambah item lalu arahkan user ke halaman checkout dalam satu aksi.
   * Dipakai tombol "Beli Sekarang" supaya produk ikut terbawa ke ringkasan
   * pesanan tanpa user harus add-to-cart dulu.
   */
  buyNow: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toastMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { navigate } = useRouter();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('23bouquet_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('23bouquet_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setToastMessage(`"${product.name}" ditambahkan ke keranjang! 💐`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /**
   * "Beli Sekarang": masukkan produk ke keranjang, lalu langsung buka checkout.
   *
   * Produk yang sudah ada di keranjang tidak digandakan - kuantitasnya
   * dinaikkan satu kali, supaya tidak muncul dua baris untuk produk yang sama.
   */
  const buyNow = useCallback(
    (item: Omit<CartItem, 'quantity'>) => {
      setItems((prev) =>
        prev.some((i) => i.id === item.id)
          ? prev.map((i) =>
              i.id === item.id ? { ...i, ...item, quantity: i.quantity + 1 } : i
            )
          : [...prev, { ...item, quantity: 1 }]
      );
      setIsCartOpen(false);
      navigate('/checkout');
    },
    [navigate]
  );

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        buyNow,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

