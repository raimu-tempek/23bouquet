import React, { useState } from 'react';
import {
  ShieldCheck,
  SlidersHorizontal,
  HeartHandshake,
  Gift,
  Search,
  Scissors,
  Package,
  Truck,
  Target,
  Check,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import girlHoldingBouquet from '../assets/gambar cewek.webp';
import { useRouter } from '../context/RouterContext';

interface StatItem {
  value: string;
  label: string;
}

interface ValueItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface StepItem {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const STATS: StatItem[] = [
  { value: '250+', label: 'Pesanan Selesai' },
  { value: '5.0', label: 'Rating Rata-rata' },
  { value: '24', label: 'Pilihan Desain Buket' },
];

const VALUES: ValueItem[] = [
  {
    icon: ShieldCheck,
    title: 'Awet, Bukan Cuma Cantik Sesaat',
    description:
      'Buket kami dirancang tahan lama, jadi kenangannya nggak ikut layu dalam beberapa hari.',
  },
  {
    icon: SlidersHorizontal,
    title: '100% Bisa Dikustom',
    description:
      'Kamu yang tentukan jenis bunga, warna, dan gaya wrapping-nya sendiri.',
  },
  {
    icon: HeartHandshake,
    title: 'Dibuat dengan Tangan',
    description: 'Setiap pesanan dirangkai manual, bukan produksi massal.',
  },
  {
    icon: Gift,
    title: 'Cocok untuk Semua Momen',
    description:
      'Dari ulang tahun, wisuda, sampai permintaan maaf — kami bantu sampaikan lewat buket yang tepat.',
  },
];

const STEPS: StepItem[] = [
  {
    number: '01',
    icon: Search,
    title: 'Pilih atau Kustom',
    description: 'Pilih dari koleksi favorit, atau rangkai sendiri lewat fitur Kustom Buket.',
  },
  {
    number: '02',
    icon: Scissors,
    title: 'Kami Rangkai dengan Tangan',
    description: 'Tim kami mengerjakan pesananmu satu per satu.',
  },
  {
    number: '03',
    icon: Package,
    title: 'Dikemas dengan Rapi',
    description: 'Setiap buket dikemas aman supaya sampai dalam kondisi sempurna.',
  },
  {
    number: '04',
    icon: Truck,
    title: 'Sampai di Momen yang Tepat',
    description: 'Kirim langsung atau ambil sendiri, sesuai kebutuhanmu.',
  },
];

const MISSIONS: string[] = [
  'Menghadirkan buket berkualitas yang bisa dinikmati lebih lama dari bunga segar biasa',
  'Memberikan kebebasan penuh bagi pelanggan untuk mengkustom hadiahnya sendiri',
  'Mengutamakan detail dan kerapian di setiap proses pembuatan',
  'Membangun kepercayaan lewat pelayanan yang ramah dan responsif',
];

const FAQS: FaqItem[] = [
  {
    id: '1',
    question: 'Bunga di 23Bouquet itu asli atau bukan?',
    answer:
      'Bukan bunga segar asli — kami pakai bahan yang lebih awet (kain/artificial berkualitas), jadi buketmu bisa disimpan lama tanpa layu.',
  },
  {
    id: '2',
    question: 'Bisa request desain sendiri?',
    answer:
      'Bisa! Gunakan fitur Kustom Buket untuk pilih jenis bunga, warna, dan wrapping sesuai keinginanmu.',
  },
  {
    id: '3',
    question: 'Apakah ada layanan pengiriman?',
    answer:
      'Ada, dengan estimasi ongkir yang muncul otomatis saat checkout. Tersedia juga opsi ambil langsung di toko.',
  },
];

/** Item FAQ yang bisa expand/collapse. Dipakai <button> + aria-expanded supaya
 *  bisa dipakai keyboard dan dibaca screen reader. */
function FaqAccordionItem({ item }: { item: FaqItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `tentang-faq-panel-${item.id}`;

  return (
    <div
      className={`rounded-2xl overflow-hidden border transition-colors duration-300 ${
        isOpen
          ? 'bg-[#e74694] border-[#e74694] shadow-lg shadow-pink-600/15'
          : 'bg-white border-pink-200 hover:border-[#ff88ba]'
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left cursor-pointer"
      >
        <span
          className={`text-base sm:text-lg font-bold leading-snug flex-1 transition-colors duration-300 ${
            isOpen ? 'text-white' : 'text-gray-900'
          }`}
        >
          {item.question}
        </span>
        <span
          className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
            isOpen ? 'bg-white/20 rotate-180' : 'bg-pink-50'
          }`}
        >
          <ChevronDown
            className={`w-5 h-5 transition-colors duration-300 ${
              isOpen ? 'text-white' : 'text-[#e74694]'
            }`}
          />
        </span>
      </button>

      <div
        id={panelId}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 sm:px-6 pb-5 text-sm sm:text-base text-white/90 leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export const TentangKamiPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="bg-[#fffbfe]">
      {/* ============ 1. HERO ============ */}
      <section className="relative bg-[#fce8f3] overflow-hidden">
        <div className="absolute inset-0 bg-radial from-pink-300/30 via-pink-200/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-14 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Kolom kiri: badge, headline, subtext */}
            <div className="lg:col-span-7 min-w-0 flex flex-col items-start gap-5 sm:gap-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-pink-200 shadow-xs">
                <Target className="w-4 h-4 text-[#e74694]" />
                <span className="text-xs sm:text-sm font-bold text-[#e74694] uppercase tracking-wider">
                  Tentang 23Bouquet
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#e74694] tracking-tight leading-[1.15]">
                Buket yang Nggak Layu, Tapi Tetap Penuh Makna
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-[#727885] leading-relaxed max-w-2xl">
                Kami percaya hadiah terbaik itu bukan soal seberapa mahal, tapi seberapa
                personal — dan seberapa lama ia bisa dikenang.
              </p>
            </div>

            {/* Kolom kanan: foto */}
            <div className="lg:col-span-5 min-w-0">
              <div className="relative w-full max-w-sm mx-auto lg:max-w-none aspect-[4/5] rounded-[32px] overflow-hidden border border-pink-100 bg-white shadow-xl shadow-pink-900/10">
                <img
                  src={girlHoldingBouquet}
                  alt="Pelanggan 23Bouquet sedang memegang buket bunga"
                  className="w-full h-full object-cover object-[center_22%] select-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. CERITA + PENCAPAIAN ============ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Kolom kiri: cerita */}
            <div className="lg:col-span-7 min-w-0">
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#e74694] leading-[1.2] tracking-tight">
                Dari Ide Sederhana, Jadi Kado yang Berarti
              </h2>
              <div className="mt-5 w-16 h-1 rounded-full bg-[#e74694]/30" />
              <p className="mt-5 text-base sm:text-lg text-[#727885] leading-relaxed">
                23Bouquet berawal dari satu pertanyaan sederhana: kenapa hadiah bunga harus
                layu dalam hitungan hari, padahal perasaan di baliknya nggak pernah luntur? Dari
                situ, kami mulai merangkai buket dari bahan yang lebih tahan lama, tapi tetap
                terlihat dan terasa seindah bunga asli. Setiap buket dibuat dengan tangan,
                disesuaikan dengan cerita dan momen di balik setiap pesanan. Kami percaya, hadiah
                yang baik itu personal. Makanya di 23Bouquet, kamu bisa kustom sendiri buketmu —
                pilih bunga, warna, sampai wrapping-nya.
              </p>
            </div>

            {/* Kolom kanan: 3 stat card (gaya kartu "250+ Pesanan Selesai") */}
            <div className="lg:col-span-5 min-w-0 flex flex-col gap-4 sm:gap-5">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-5 bg-[#e74694] rounded-[32px] border-[5px] border-[#ff88ba]/25 px-6 py-6 shadow-xl shadow-pink-600/10 hover:shadow-pink-600/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight shrink-0">
                    {stat.value}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-white/95">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. VALUE PROPS ============ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#fce8f3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-pink-200 shadow-xs">
              <span className="text-xs font-bold text-[#e74694] uppercase tracking-wider">
                Kenapa 23Bouquet
              </span>
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[40px] font-black text-[#e74694] leading-[1.2] tracking-tight">
              Apa yang Membuat Kami Berbeda
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {VALUES.map((item) => (
              <div
                key={item.title}
                className="bg-white/80 backdrop-blur-xs p-6 rounded-3xl border border-pink-200/60 shadow-lg shadow-pink-900/5 hover:shadow-xl hover:shadow-pink-900/10 hover:bg-white transition-all duration-300 flex flex-col items-start gap-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#e74694]/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-7 h-7 text-[#e74694]" />
                </div>
                <h3 className="text-xl font-black text-gray-900 pt-1">{item.title}</h3>
                <p className="text-sm sm:text-[15px] text-[#727885] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. PROSES ============ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200">
              <span className="text-xs font-bold text-[#e74694] uppercase tracking-wider">
                Cara Pesan
              </span>
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[40px] font-black text-[#e74694] leading-[1.2] tracking-tight">
              Dari Pesanan Sampai di Tanganmu
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="relative bg-white rounded-3xl border border-pink-200 shadow-lg shadow-pink-900/5 hover:shadow-xl hover:shadow-pink-900/10 transition-all duration-300 p-6 pt-8 flex flex-col items-start gap-3"
              >
                {/* Nomor urut di pojok kartu */}
                <span className="absolute -top-4 left-6 flex items-center justify-center w-10 h-10 rounded-2xl bg-[#e74694] text-white text-sm font-black shadow-md shadow-pink-300/40">
                  {step.number}
                </span>
                <div className="w-14 h-14 rounded-2xl bg-[#e74694]/10 flex items-center justify-center shrink-0">
                  <step.icon className="w-7 h-7 text-[#e74694]" />
                </div>
                <h3 className="text-lg font-black text-gray-900 pt-1">{step.title}</h3>
                <p className="text-sm sm:text-[15px] text-[#727885] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 5. VISI & MISI ============ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#fce8f3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#e74694] leading-[1.2] tracking-tight">
              Visi &amp; Misi Kami
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {/* Visi: kartu pink menonjol */}
            <div className="lg:col-span-5 min-w-0 flex flex-col justify-center gap-4 bg-[#e74694] rounded-[32px] border-[5px] border-[#ff88ba]/25 p-7 sm:p-8 shadow-xl shadow-pink-600/10">
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-white/20">
                <Target className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Visi
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                Menjadi pilihan utama hadiah bunga yang personal, tahan lama, dan bermakna bagi
                setiap momen penting masyarakat Indonesia.
              </p>
            </div>

            {/* Misi: kartu putih berisi list */}
            <div className="lg:col-span-7 min-w-0 bg-white rounded-[32px] border border-pink-200 shadow-lg shadow-pink-900/5 p-7 sm:p-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200">
                <Check className="w-4 h-4 text-[#e74694]" />
                <span className="text-xs font-bold text-[#e74694] uppercase tracking-wider">
                  Misi
                </span>
              </div>
              <ul className="mt-5 flex flex-col gap-3.5">
                {MISSIONS.map((mission) => (
                  <li key={mission} className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[#e74694]/10 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-[#e74694]" strokeWidth={3} />
                    </span>
                    <span className="text-sm sm:text-base text-[#727885] leading-relaxed">
                      {mission}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 6. FAQ ============ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 lg:items-start">
            {/* Kiri: judul */}
            <div className="lg:w-[420px] flex-shrink-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#e74694] leading-tight">
                Pertanyaan yang Sering Ditanyakan
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#8e8e8e] leading-relaxed">
                Masih ada yang penasaran? Ini jawaban dari pertanyaan yang paling sering kami
                terima.
              </p>
            </div>

            {/* Kanan: accordion */}
            <div className="flex-1 flex flex-col gap-3">
              {FAQS.map((faq) => (
                <FaqAccordionItem key={faq.id} item={faq} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 7. CTA PENUTUP ============ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#fce8f3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#e74694] leading-[1.2] tracking-tight">
            Yuk, Mulai Rangkai Ceritamu Sendiri
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#727885] leading-relaxed max-w-2xl mx-auto">
            Pilih bunga, warna, dan wrapping sesuai cerita di balik hadiahmu.
          </p>
          <a
            href="/kustom-buket"
            onClick={(e) => {
              e.preventDefault();
              navigate('/kustom-buket');
            }}
            className="mt-8 inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 bg-[#e74694] hover:bg-[#db2777] text-white text-base sm:text-lg font-bold rounded-2xl shadow-lg shadow-pink-300/40 transition-all active:scale-95"
          >
            Kustom Buket Sekarang
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

