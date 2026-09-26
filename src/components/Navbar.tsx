import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Search,
  ShoppingBag,
  User,
  Flower2,
  Truck,
  Gift,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import logoImg from '../assets/logo.webp';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';

interface LayananItem {
  label: string;
  description: string;
  icon: LucideIcon;
  /** Link tujuan item (dipakai apa adanya untuk link eksternal). */
  href: string;
  /** id section beranda yang di-scroll untuk link internal. */
  hash?: string;
  /** true = buka di tab baru (mis. WhatsApp). */
  external?: boolean;
}

/**
 * Isi dropdown "Layanan" - daftar LAYANAN, bukan jenis produk (jenis produk
 * sudah jadi filter di halaman Katalog, jadi akan redundant kalau diulang di sini).
 */
const LAYANAN_ITEMS: LayananItem[] = [
  {
    label: 'Kustom Buket',
    description: 'Pilih bunga, warna & wrapping sendiri',
    icon: Flower2,
    href: '/kustom-buket',
  },
  {
    label: 'Same Day Delivery',
    description: 'Selesai & dikirim di hari yang sama',
    icon: Truck,
    href: '/#keunggulan',
    hash: 'keunggulan',
  },
  {
    label: 'Kartu Ucapan Gratis',
    description: 'Bonus kartu ucapan di setiap pesanan',
    icon: Gift,
    href: '/#faq',
    hash: 'faq',
  },
];

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems, setIsCartOpen } = useCart();
  const { path, navigate } = useRouter();

  // Dropdown "Layanan": dibuka/ditutup dengan CLICK, bukan hover. Versi hover
  // sebelumnya bermasalah - menu sempat menutup sebelum klik item ter-register.
  // Sekarang menu hanya tertutup saat: klik item, klik di luar menu, atau Escape.
  const [isLayananOpen, setIsLayananOpen] = useState(false);
  const layananRef = useRef<HTMLDivElement>(null);

  const closeLayanan = () => setIsLayananOpen(false);

  // Link ke section di beranda - tetap jalan walau sedang berada di /katalog
  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    closeLayanan();
    if (path === '/') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState({}, '', `/#${hash}`);
    } else {
      navigate(`/#${hash}`);
    }
  };

  // Link antar halaman (client-side)
  const handlePageClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    closeLayanan();
    navigate(to);
  };

  // Style link nav: yang aktif diberi underline pink
  const navLinkClass = (isActive: boolean) =>
    isActive
      ? 'text-base font-semibold text-[#e74694] hover:text-[#db2777] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#e74694] after:rounded-full'
      : 'text-base font-medium text-gray-700 hover:text-[#e74694] transition-colors py-1';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tutup dropdown "Layanan" saat klik di luar menu atau tekan Escape.
  useEffect(() => {
    if (!isLayananOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!layananRef.current?.contains(event.target as Node)) closeLayanan();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLayanan();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
    // closeLayanan stabil (hanya menutup state) jadi tidak perlu jadi dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLayananOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs py-3.5'
            : 'bg-white py-5 sm:py-6 shadow-[0px_2px_4px_0px_rgb(0_0_0_/_0.06)]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => handlePageClick(e, '/')}
              className="group inline-flex items-center cursor-pointer select-none"
              aria-label="23Bouquet - kembali ke beranda"
            >
              <img
                src={logoImg}
                alt="23Bouquet"
                width={153}
                height={40}
                className="h-8 sm:h-10 w-auto object-contain object-left transition-transform group-hover:scale-105"
              />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              <a
                href="/#beranda"
                onClick={(e) => handleSectionClick(e, 'beranda')}
                className={navLinkClass(path === '/')}
              >
                Beranda
              </a>
              <a
                href="/katalog"
                onClick={(e) => handlePageClick(e, '/katalog')}
                className={navLinkClass(path === '/katalog')}
              >
                Katalog
              </a>
              {/* Dropdown Layanan - trigger click supaya semua item selalu bisa diklik */}
              <div ref={layananRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsLayananOpen((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={isLayananOpen}
                  aria-controls="nav-layanan-menu"
                  className={`flex items-center gap-1 text-base font-medium transition-colors py-1 cursor-pointer ${
                    isLayananOpen ? 'text-[#e74694]' : 'text-gray-700 hover:text-[#e74694]'
                  }`}
                >
                  <span>Layanan</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isLayananOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* pt-2 (bukan mt-2) supaya area menu tetap nyambung ke tombolnya */}
                <div
                  id="nav-layanan-menu"
                  className={`absolute top-full left-0 z-50 w-72 pt-2 transition-all duration-200 ${
                    isLayananOpen
                      ? 'visible opacity-100 translate-y-0'
                      : 'invisible opacity-0 -translate-y-1 pointer-events-none'
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-pink-100 py-2 overflow-hidden">
                    {LAYANAN_ITEMS.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        onClick={(e) => {
                          if (item.external) {
                            // Link keluar (WhatsApp) - tidak perlu preventDefault,
                            // cukup tutup dropdown-nya.
                            closeLayanan();
                            return;
                          }
                          // Item dengan hash = section di beranda, tanpa hash =
                          // halaman tersendiri (mis. /kustom-buket).
                          if (item.hash) {
                            handleSectionClick(e, item.hash);
                          } else {
                            handlePageClick(e, item.href);
                          }
                        }}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-pink-50 transition-colors group/layanan"
                      >
                        <item.icon className="w-5 h-5 mt-0.5 shrink-0 text-[#e74694]" />
                        <span className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-800 group-hover/layanan:text-[#e74694] transition-colors">
                            {item.label}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">{item.description}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <a
                href="/tentang-kami"
                onClick={(e) => handlePageClick(e, '/tentang-kami')}
                className={navLinkClass(path === '/tentang-kami')}
              >
                Tentang Kami
              </a>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-pink-50 text-gray-700 hover:text-[#e74694] transition-colors"
                aria-label="Cari produk"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Cart Button with Counter */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-pink-50 text-gray-700 hover:text-[#e74694] transition-colors group cursor-pointer"
                aria-label="Keranjang belanja"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[#e74694] text-white text-[11px] font-bold shadow-xs animate-scale">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Account */}
              <a
                href="#masuk"
                className="p-2 rounded-full hover:bg-pink-50 text-gray-700 hover:text-[#e74694] transition-colors hidden sm:flex"
                aria-label="Akun saya"
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-gray-700 hover:bg-pink-50 md:hidden focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6 text-[#e74694]" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Quick Search Bar (expandable) */}
          {isSearchOpen && (
            <div className="pt-3 pb-2 mt-2 border-t border-pink-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Cari buket (contoh: Seoul Bouquet, Omakase, Snack)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full px-4 py-2 text-sm bg-pink-50/50 border border-pink-200 rounded-full focus:outline-none focus:border-[#e74694] text-gray-800 placeholder:text-gray-400"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-3/4 max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-pink-100">
                <div className="flex items-center">
                  <span className="text-base font-extrabold text-[#e74694] mr-1">23</span>
                  <span className="text-2xl font-extrabold text-[#e74694]">Bouquet</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-gray-500 hover:text-gray-900"
                  aria-label="Tutup menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-4 text-base font-semibold text-gray-800">
                <a
                  href="/#beranda"
                  onClick={(e) => handleSectionClick(e, 'beranda')}
                  className={
                    path === '/'
                      ? 'p-2 rounded-xl text-[#e74694] bg-pink-50'
                      : 'p-2 rounded-xl hover:bg-pink-50 hover:text-[#e74694] transition-colors'
                  }
                >
                  Beranda
                </a>
                <a
                  href="/katalog"
                  onClick={(e) => handlePageClick(e, '/katalog')}
                  className={
                    path === '/katalog'
                      ? 'p-2 rounded-xl text-[#e74694] bg-pink-50'
                      : 'p-2 rounded-xl hover:bg-pink-50 hover:text-[#e74694] transition-colors'
                  }
                >
                  Katalog
                </a>
                <a
                  href="/kustom-buket"
                  onClick={(e) => handlePageClick(e, '/kustom-buket')}
                  className={
                    path === '/kustom-buket'
                      ? 'p-2 rounded-xl text-[#e74694] bg-pink-50'
                      : 'p-2 rounded-xl hover:bg-pink-50 hover:text-[#e74694] transition-colors'
                  }
                >
                  Kustom Buket
                </a>
                <a
                  href="/#keunggulan"
                  onClick={(e) => handleSectionClick(e, 'keunggulan')}
                  className="p-2 rounded-xl hover:bg-pink-50 hover:text-[#e74694] transition-colors"
                >
                  Keunggulan
                </a>
                <a
                  href="/#testimoni"
                  onClick={(e) => handleSectionClick(e, 'testimoni')}
                  className="p-2 rounded-xl hover:bg-pink-50 hover:text-[#e74694] transition-colors"
                >
                  Ulasan Pelanggan
                </a>
                <a
                  href="/#faq"
                  onClick={(e) => handleSectionClick(e, 'faq')}
                  className="p-2 rounded-xl hover:bg-pink-50 hover:text-[#e74694] transition-colors"
                >
                  FAQ
                </a>
                <a
                  href="/tentang-kami"
                  onClick={(e) => handlePageClick(e, '/tentang-kami')}
                  className={
                    path === '/tentang-kami'
                      ? 'p-2 rounded-xl text-[#e74694] bg-pink-50'
                      : 'p-2 rounded-xl hover:bg-pink-50 hover:text-[#e74694] transition-colors'
                  }
                >
                  Tentang Kami
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-3 bg-[#e74694] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-pink-200"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Keranjang ({totalItems})</span>
              </button>
              <p className="text-xs text-center text-gray-400">
                &copy; {new Date().getFullYear()} 23Bouquet. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

