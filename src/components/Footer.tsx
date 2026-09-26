import logoImg from '../assets/logo.webp';
import { useRouter } from '../context/RouterContext';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { navigate } = useRouter();

  // Link "Tentang Kami" sudah punya route-nya sendiri, jadi dipindah client-side
  // supaya konsisten dengan navigasi Navbar (tanpa reload halaman).
  const handleTentangKamiClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/tentang-kami');
  };

  return (
    <footer className="bg-[#fce8f3] border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-6 justify-between">
          {/* Brand column */}
          <div className="flex flex-col gap-3 sm:max-w-[220px]">
            {/* Logo */}
            {/* `self-start` mencegah kolom flex meregangkan lebar gambar ke
                220px (align-items default = stretch), yang bikin kotaknya
                melebar melebihi rasio asli logo. */}
            <img
              src={logoImg}
              alt="23Bouquet"
              width={183}
              height={48}
              className="self-start h-10 sm:h-12 w-auto object-contain object-left"
            />
            <p className="text-sm font-light text-[#727885] leading-relaxed">
              Custom buket, money bouquet, snack bouquet &amp; gift lainnya.
              <br />
              Bukan fresh flowers tapi tetap full makna.
            </p>
          </div>

          {/* Links grid */}
          <div className="flex flex-wrap gap-10 sm:gap-16">
            {/* Menu */}
            <div className="flex flex-col gap-4">
              <p className="font-bold text-gray-800 text-base">Menu</p>
              <ul className="flex flex-col gap-2.5 text-sm text-[#727885]">
                <li>
                  <a href="/" className="hover:text-[#e74694] transition-colors">
                    Beranda
                  </a>
                </li>
                <li>
                  <a href="/katalog" className="hover:text-[#e74694] transition-colors">
                    Katalog
                  </a>
                </li>
                <li>
                  <a href="/layanan" className="hover:text-[#e74694] transition-colors">
                    Layanan
                  </a>
                </li>
                <li>
                  <a
                    href="/tentang-kami"
                    onClick={handleTentangKamiClick}
                    className="hover:text-[#e74694] transition-colors"
                  >
                    Tentang Kami
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-4">
              <p className="font-bold text-gray-800 text-base">Legal</p>
              <ul className="flex flex-col gap-2.5 text-sm text-[#727885]">
                <li>
                  <a href="/privacy-policy" className="hover:text-[#e74694] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-[#e74694] transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/#faq" className="hover:text-[#e74694] transition-colors">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Socials */}
            <div className="flex flex-col gap-4">
              <p className="font-bold text-gray-800 text-base">Socials</p>
              <ul className="flex flex-col gap-2.5 text-sm text-[#727885]">
                <li>
                  <a
                    href="https://instagram.com/23bouquet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#e74694] transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com/@23bouquet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#e74694] transition-colors"
                  >
                    Tiktok
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 pt-6 border-t border-pink-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#8e8e8e]">
          <p>&copy; {currentYear} 23Bouquet. All rights reserved.</p>
          <p>Made with 💐 for bouquet lovers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}

