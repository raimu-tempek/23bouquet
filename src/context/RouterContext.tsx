import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface RouterContextValue {
  /** pathname aktif, contoh: '/' atau '/katalog' */
  path: string;
  /** Pindah halaman secara client-side. Mendukung hash, contoh: navigate('/#katalog') */
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

/** '/' atau '/katalog' (trailing slash diabaikan) */
const readPath = () => window.location.pathname.replace(/\/+$/, '') || '/';

const scrollToHash = (hash: string) => {
  // dua kali rAF: menunggu React selesai render halaman tujuan dulu
  window.requestAnimationFrame(() =>
    window.requestAnimationFrame(() =>
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    )
  );
};

/**
 * Router mini (tanpa dependency) - cukup untuk 2 halaman: beranda ('/') dan
 * katalog ('/katalog'). Memakai History API + popstate supaya tombol back/forward
 * browser tetap jalan dan URL-nya bisa di-share.
 */
export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(readPath);

  useEffect(() => {
    const handlePopState = () => setPath(readPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Deep link pertama kali dibuka, contoh: /#katalog
  useEffect(() => {
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) scrollToHash(initialHash);
  }, []);

  const navigate = useCallback((to: string) => {
    const [rawPath, hash] = to.split('#');
    const nextPath = rawPath || '/';
    window.history.pushState({}, '', `${nextPath}${hash ? `#${hash}` : ''}`);
    setPath(readPath());
    if (hash) {
      scrollToHash(hash);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
