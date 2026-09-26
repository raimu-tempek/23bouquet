import React from 'react';
import iconSecure from '../assets/frame-2147259102.png';
import iconCustom from '../assets/group-2.png';
import iconFast from '../assets/frame-2147259103.png';
import iconMoment from '../assets/frame-2147259103-2.png';

interface FeatureItem {
  icon: string;
  isGroupIcon?: boolean;
  title: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: iconSecure,
    title: 'Pembayaran Aman',
    description: 'Nikmati proses pembayaran yang mudah dan terpercaya dengan berbagai metode pembayaran yang tersedia untuk kenyamanan setiap transaksi.',
  },
  {
    icon: iconCustom,
    isGroupIcon: true,
    title: 'Kustomisasi Buket',
    description: 'Pilih bunga, warna, dan pembungkus sesuai keinginanmu untuk menciptakan buket yang lebih personal dan penuh makna.',
  },
  {
    icon: iconFast,
    title: 'Pengerjaan Cepat',
    description: 'Setiap pesanan diproses dengan sigap dan teliti agar buket dapat siap tepat waktu tanpa mengurangi kualitas hasilnya.',
  },
  {
    icon: iconMoment,
    title: 'Cocok untuk Momen',
    description: 'Mulai dari wisuda, ulang tahun, anniversary, hingga hadiah kejutan, tersedia berbagai pilihan buket yang dapat disesuaikan dengan kebutuhanmu.',
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="keunggulan" className="py-14 sm:py-20 lg:py-28 bg-[#fce8f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Heading and Intro */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-pink-200 shadow-xs">
              <span className="text-xs font-bold text-[#e74694] uppercase tracking-wider">
                Kenapa Memilih Kami
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#e74694] leading-[1.2] tracking-tight">
              Kenapa 23Bouquet Jadi Pilihan Banyak Orang?
            </h2>

            <p className="text-base sm:text-lg text-[#727885] font-normal leading-relaxed">
              Kami menghadirkan bouquet yang tidak hanya indah secara visual, tetapi juga dirancang untuk menyampaikan makna di setiap momen berharga dalam hidupmu.
            </p>
          </div>

          {/* Right Column: 2x2 Features Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {FEATURES.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xs p-6 rounded-3xl border border-pink-200/60 shadow-lg shadow-pink-900/5 hover:shadow-xl hover:shadow-pink-900/10 hover:bg-white transition-all duration-300 flex flex-col items-start gap-3"
              >
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-[#e74694]/10 flex items-center justify-center shrink-0">
                  {item.isGroupIcon ? (
                    <div className="w-11 h-11 rounded-xl bg-[#e74694] flex items-center justify-center p-2">
                      <img src={item.icon} alt={item.title} className="w-5 h-7 object-contain" />
                    </div>
                  ) : (
                    <img src={item.icon} alt={item.title} className="w-11 h-11 object-contain rounded-xl" />
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-gray-900 pt-1">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-[#727885] font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

