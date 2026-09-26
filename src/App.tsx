import { useEffect, useMemo } from 'react';
import { CartProvider, useCart } from '@/context/CartContext';
import { RouterProvider, useRouter } from '@/context/RouterContext';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { HeroSection } from '@/components/HeroSection';
import { HighlightStats } from '@/components/HighlightStats';
import { ProductCatalog } from '@/components/ProductCatalog';
import { KatalogPage } from '@/components/KatalogPage';
import { KustomBuketPage } from '@/components/KustomBuketPage';
import { CheckoutPage } from '@/components/CheckoutPage';
import { ProductDetailPage } from '@/components/ProductDetailPage';
import { TentangKamiPage } from '@/components/TentangKamiPage';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Testimonials } from '@/components/Testimonials';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';
import { PRODUCTS } from '@/data/products';

// Toast notification that reads from CartContext
function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-[#e74694] text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-lg animate-fade-in pointer-events-none"
      aria-live="polite"
    >
      {toastMessage}
    </div>
  );
}

function AppContent() {
  // Prevent body scroll when cart drawer is open
  const { isCartOpen } = useCart();
  const { path } = useRouter();

  // Parsing route: /produk/:slug atau /katalog/:slug
  const activeProduct = useMemo(() => {
    let slug: string | undefined;
    if (path.startsWith('/produk/')) {
      slug = path.replace('/produk/', '');
    } else if (path.startsWith('/katalog/')) {
      slug = path.replace('/katalog/', '');
    }
    if (!slug) return null;
    return PRODUCTS.find((p) => p.slug === slug || p.id === slug) || null;
  }, [path]);

  const isKatalogPage = path === '/katalog';
  const isKustomBuketPage = path === '/kustom-buket';
  const isCheckoutPage = path === '/checkout';
  const isTentangKamiPage = path === '/tentang-kami';

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Judul tab mengikuti halaman yang aktif
  useEffect(() => {
    if (activeProduct) {
      document.title = `${activeProduct.name} — 23Bouquet`;
    } else if (isCheckoutPage) {
      document.title = 'Checkout — 23Bouquet';
    } else if (isKustomBuketPage) {
      document.title = 'Kustom Buket — 23Bouquet';
    } else if (isKatalogPage) {
      document.title = 'Katalog Buket — 23Bouquet';
    } else if (isTentangKamiPage) {
      document.title = 'Tentang Kami — 23Bouquet';
    } else {
      // Judul default harus sinkron dengan <title> di index.html
      document.title = '23Bouquet | Custom Bouquet';
    }
  }, [activeProduct, isKatalogPage, isKustomBuketPage, isCheckoutPage, isTentangKamiPage]);

  return (
    <div className="min-h-screen font-sans antialiased">
      <Navbar />
      <CartDrawer />
      <Toast />

      <main>
        {activeProduct ? (
          <ProductDetailPage product={activeProduct} />
        ) : isCheckoutPage ? (
          <CheckoutPage />
        ) : isKustomBuketPage ? (
          <KustomBuketPage />
        ) : isKatalogPage ? (
          <KatalogPage />
        ) : isTentangKamiPage ? (
          <TentangKamiPage />
        ) : (
          <>
            <HeroSection />
            <HighlightStats />
            <ProductCatalog />
            <WhyChooseUs />
            <Testimonials />
            <FaqSection />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </RouterProvider>
  );
}

