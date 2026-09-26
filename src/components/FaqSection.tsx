import { useState } from 'react';
import chevronUp from '@/assets/mynauichevron-up-solid.png';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: '1',
    question: 'Bisa custom bouquet sesuai keinginan?',
    answer:
      'Tentu saja! Kamu bisa memilih bunga, warna, dan tema sesuai dengan keinginanmu. Tim kami akan membantu mewujudkan buket impianmu.',
  },
  {
    id: '2',
    question: 'Berapa lama waktu pengerjaan bouquet?',
    answer:
      'Waktu pengerjaan normal adalah 2–3 hari kerja. Untuk acara mendadak, kami juga menyediakan layanan express dalam 24 jam dengan biaya tambahan. Hubungi kami via WhatsApp untuk informasi lebih lanjut.',
  },
  {
    id: '3',
    question: 'Apakah 23Bouquet melayani pengiriman ke luar kota?',
    answer:
      'Ya! Kami melayani pengiriman ke seluruh Indonesia. Biaya dan estimasi pengiriman akan dikalkulasi berdasarkan lokasi tujuanmu saat checkout.',
  },
  {
    id: '4',
    question: 'Apa saja metode pembayaran yang tersedia?',
    answer:
      'Kami menerima transfer bank (BCA, Mandiri, BRI, BNI), e-wallet (GoPay, OVO, DANA, ShopeePay), QRIS, dan kartu kredit/debit. Semua transaksi aman dan terenkripsi.',
  },
];

function FaqAccordionItem({ item }: { item: FaqItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
        isOpen ? 'bg-[#e74694]' : 'bg-[#e74694]'
      }`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex flex-row justify-between items-center gap-4 px-6 py-5">
        <p className="text-lg sm:text-xl font-bold text-white leading-snug flex-1">
          {item.question}
        </p>
        <img
          className={`w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-0' : 'rotate-180'
          }`}
          src={chevronUp}
          alt="toggle"
        />
      </div>
      {/* Smooth height animation via max-height trick */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 pb-5">
          <p className="text-base text-white/90 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 lg:items-start">
          {/* Left: heading + subtitle */}
          <div className="lg:w-[420px] flex-shrink-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#e74694] leading-tight">
              Pertanyaan yang Sering Ditanyakan
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#8e8e8e] leading-relaxed">
              Kami rangkum pertanyaan yang sering ditanyakan agar kamu bisa order dengan lebih
              tenang dan nyaman
            </p>
          </div>

          {/* Right: accordion */}
          <div className="flex-1 flex flex-col gap-3">
            {faqs.map((faq) => (
              <FaqAccordionItem key={faq.id} item={faq} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

