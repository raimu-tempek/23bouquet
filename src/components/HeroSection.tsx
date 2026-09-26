import React from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
import heroWomanImg from '../assets/front-view-young-female-holding-bouquet-beautiful-roses-pinks-1.png';
import avatar1 from '../assets/ellipse-18-5.png';
import avatar2 from '../assets/ellipse-19-5.png';
import avatar3 from '../assets/ellipse-21-5.png';
import avatar4 from '../assets/ellipse-23-5.png';
import avatar5 from '../assets/ellipse-22-5.png';
// Floating badge icons: each SVG is a self-contained pink (#E74694) circle + white glyph.
import iconWallet from '../assets/dompet.svg';
import iconFlash from '../assets/flash.svg';
import iconRose from '../assets/rose.svg';
import { useRouter } from '../context/RouterContext';

export const HeroSection: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <section id="beranda" className="relative bg-[#fce8f3] overflow-hidden">
      {/* One uniform pink panel (#FCE8F3) that wraps BOTH columns.
          pb-0 = the panel ends exactly on the bottom edge of the photo (no pink stripe under it). */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 lg:pt-6 pb-0">
        {/* items-stretch = both columns are forced to the exact same height, so the pink
            behind the text column always matches the height of the photo column. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-x-8 lg:gap-y-0 items-stretch">

          {/* Left Column: Text & Content
              h-full + justify-center = the column keeps the full (stretched) height of the row
              and the headline/text/buttons stay vertically centred inside that height. */}
          <div className="lg:col-span-7 min-w-0 h-full flex flex-col justify-center items-start gap-6 sm:gap-8 py-2 sm:py-4 lg:py-12 z-10">
            {/* Tagline / Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-pink-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#e74694] animate-pulse"></span>
              <span className="text-xs sm:text-sm font-bold text-[#e74694] tracking-wide uppercase">
                23Bouquet Atelier & Gift
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#e74694] tracking-tight leading-[1.1] sm:leading-[1.15]">
              Bikin Momen Spesial Jadi Lebih Berarti
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-[#e74694]/90 font-normal leading-relaxed max-w-2xl">
              Setiap bouquet dirancang untuk menyampaikan makna di balik momen spesialmu. Karena detail kecil bisa meninggalkan kesan besar.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-1.5 sm:p-2 bg-[#e74694] rounded-2xl sm:rounded-full w-full sm:w-fit shadow-lg shadow-pink-300/40">
              <a
                href="/kustom-buket"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/kustom-buket');
                }}
                className="flex items-center justify-center px-6 sm:px-8 py-3 bg-white text-[#e74694] font-bold text-base sm:text-lg rounded-xl sm:rounded-full hover:bg-pink-50 transition-all active:scale-95 text-center shadow-xs"
              >
                Kustom Buket Sekarang
              </a>
              <a
                href="#katalog"
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 text-white font-bold text-base sm:text-lg hover:text-pink-100 transition-colors group text-center"
              >
                <span>Lihat Katalog</span>
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center gap-4 pt-2 sm:pt-4">
              {/* Overlapping Avatars */}
              <div className="flex -space-x-3 items-center">
                <img
                  src={avatar1}
                  alt="Pelanggan 23Bouquet"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#e74694] object-cover ring-2 ring-white"
                />
                <img
                  src={avatar2}
                  alt="Pelanggan 23Bouquet"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#e74694] object-cover ring-2 ring-white"
                />
                <img
                  src={avatar3}
                  alt="Pelanggan 23Bouquet"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#e74694] object-cover ring-2 ring-white"
                />
                <img
                  src={avatar4}
                  alt="Pelanggan 23Bouquet"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#e74694] object-cover ring-2 ring-white"
                />
                <img
                  src={avatar5}
                  alt="Pelanggan 23Bouquet"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#e74694] object-cover ring-2 ring-white"
                />
              </div>

              {/* Rating Text */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-sm sm:text-base font-bold text-[#e74694]">
                    Dinilai 4.7 oleh Pelanggan
                  </span>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#ff88ba]">
                  250+ Pelanggan Sudah Memilih 23Bouquet
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image with Floating Badges
              lg:h-full (NOT h-full) keeps the photo column auto-sized while it is stacked
              under the text on small screens: a percentage height combined with the mt-6
              margin would resolve against the full grid area and push the photo 24px past
              the bottom of the section (clipped by overflow-hidden). At lg+ the margins are
              removed so the column can stretch and the pink panel ends flush with the photo. */}
          <div className="lg:col-span-5 min-w-0 relative lg:h-full flex justify-center items-end mt-6 lg:mt-0 lg:min-h-[540px] xl:min-h-[620px]">
            {/* Visual glow background */}
            <div className="absolute inset-0 bg-radial from-pink-300/40 via-pink-200/20 to-transparent rounded-full filter blur-2xl transform scale-90"></div>

            {/* Main Photo Container (relative = positioning context for the floating badges) */}
            <div className="relative w-full h-full max-w-sm sm:max-w-md lg:max-w-none flex justify-center items-end">
              <img
                src={heroWomanImg}
                alt="23Bouquet Beautiful Rose Flower Bouquet"
                className="relative z-10 w-full h-auto lg:h-full object-cover object-center drop-shadow-xl select-none"
              />

              {/* Floating Badge 1 - "Pembayaran Aman":
                  dompet.svg (wallet icon), sits top-left next to the shoulder line (~37% height). */}
              <div className="absolute top-[33%] left-[2%] z-20 flex items-center gap-2 bg-white rounded-full shadow-md shadow-pink-900/10 px-4 py-2 animate-float-slow">
                <img src={iconWallet} alt="" aria-hidden="true" className="w-8 h-8 shrink-0 object-contain select-none" />
                <span className="text-sm font-bold text-[#e74694] whitespace-nowrap">
                  Pembayaran Aman
                </span>
              </div>

              {/* Floating Badge 2 - "Kustom Buket":
                  rose.svg (flower icon), pinned to the bottom-left edge of the kraft paper
                  wrapper (~82% height). From sm up it spills slightly left of the photo. */}
              <div className="absolute bottom-[15%] left-[1%] sm:left-[-4%] lg:left-[-10%] z-20 flex items-center gap-2 bg-white rounded-full shadow-md shadow-pink-900/10 px-4 py-2 animate-float-medium">
                <img src={iconRose} alt="" aria-hidden="true" className="w-8 h-8 shrink-0 object-contain select-none" />
                <span className="text-sm font-bold text-[#e74694] whitespace-nowrap">
                  Kustom Buket
                </span>
              </div>

              {/* Floating Badge 3 - "Pengerjaan Cepat":
                  flash.svg (lightning bolt icon), on the right side next to the arm
                  (~54% height), its right edge floating just outside the photo. */}
              <div className="absolute top-[50%] right-[-2%] z-20 flex items-center gap-2 bg-white rounded-full shadow-md shadow-pink-900/10 px-4 py-2 animate-float-fast">
                <img src={iconFlash} alt="" aria-hidden="true" className="w-8 h-8 shrink-0 object-contain select-none" />
                <span className="text-sm font-bold text-[#e74694] whitespace-nowrap">
                  Pengerjaan Cepat
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

