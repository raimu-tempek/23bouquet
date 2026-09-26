import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import bouquetDrawing from '../assets/image-3016.png';
import girlHoldingBouquet from '../assets/gambar cewek.webp';

export const HighlightStats: React.FC = () => {
  return (
    <section id="kustom" className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Card 1: 250+ Pesanan Selesai Stat Card */}
          <div className="lg:col-span-3 flex justify-center w-full">
            <div className="w-full max-w-sm sm:max-w-xs h-[320px] sm:h-[340px] bg-[#e74694] rounded-[32px] border-[5px] border-[#ff88ba]/25 p-6 flex flex-col justify-between items-center text-center shadow-xl shadow-pink-600/10 hover:shadow-pink-600/20 transition-all transform hover:-translate-y-1">
              <div className="space-y-1 pt-2">
                <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  250+
                </p>
                <p className="text-lg font-bold text-white/95">
                  Pesanan Selesai
                </p>
              </div>
              <div className="relative w-full flex justify-center items-end flex-1 pb-2">
                <img
                  src={bouquetDrawing}
                  alt="Ilustrasi Buket Bunga"
                  className="max-h-[190px] w-auto object-contain select-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Foto orang memegang buket (src/assets/gambar cewek.webp) */}
          <div className="lg:col-span-4 flex justify-center w-full">
            <div className="relative w-full max-w-sm h-[320px] sm:h-[340px] rounded-[32px] overflow-hidden group shadow-xl shadow-pink-900/10 border border-pink-100 bg-pink-50/50">
              <img
                src={girlHoldingBouquet}
                alt="23Bouquet Floral Arrangement"
                className="w-full h-full object-cover object-[center_22%] transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Card 3: Value Proposition & Custom Button */}
          <div className="md:col-span-2 lg:col-span-5 flex flex-col items-start gap-6 lg:pl-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200">
              <span className="text-xs font-bold text-[#e74694] uppercase tracking-wider">
                Personalized Gift
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#e74694] leading-[1.2] tracking-tight">
              Setiap Perasaan, Punya Cara Sendiri Buat Disampaikan
            </h2>

            <p className="text-lg sm:text-xl text-[#ff85c0] font-medium leading-relaxed">
              Mix & match sesuai selera biar hadiahnya nggak pasaran dan lebih berkesan untuk momen yang tak terlupakan.
            </p>

            <a
              href="#katalog"
              className="inline-flex items-center gap-3 bg-[#e74694] hover:bg-[#db2777] text-white font-bold text-lg px-8 py-3.5 rounded-full transition-all shadow-lg shadow-pink-300/50 active:scale-95 group"
            >
              <span>Kustom Buketmu Sendiri</span>
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

