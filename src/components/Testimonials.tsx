import ellipse18 from '@/assets/ellipse-18.png';
import ellipse19 from '@/assets/ellipse-19.png';
import ellipse21 from '@/assets/ellipse-21.png';
import ellipse22 from '@/assets/ellipse-22.png';
import ellipse23 from '@/assets/ellipse-23.png';

interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
}

const reviews: Review[] = [
  {
    id: '1',
    name: 'Wimdut Bersaudara',
    role: 'Mahasiswa',
    rating: 5,
    text: 'Bouquet-nya cantik banget dan tahan lama! Sempurna buat hadiah wisuda sahabatku. Kemasannya rapi dan pengirimannya tepat waktu. Pasti akan order lagi!',
    avatar: ellipse18,
  },
  {
    id: '2',
    name: 'Leslie Alexander',
    role: 'Librarian',
    rating: 5,
    text: 'I ordered a custom snack bouquet for my friend\'s birthday and they absolutely loved it! The arrangement was beautiful and everything was fresh. Will definitely recommend to others!',
    avatar: ellipse19,
  },
  {
    id: '3',
    name: 'Robert Fox',
    role: 'Security Guard',
    rating: 5,
    text: 'Kualitasnya luar biasa! Money bouquet yang saya pesan untuk acara pernikahan terlihat elegan dan unik. Semua tamu kagum. Terima kasih 23Bouquet!',
    avatar: ellipse21,
  },
  {
    id: '4',
    name: 'Kristin Watson',
    role: 'Translator',
    rating: 5,
    text: 'Pelayanannya sangat ramah dan responsif. Saya minta custom desain khusus dan hasilnya melebihi ekspektasi. Bouquet-nya jadi centerpiece yang sempurna di acara kami!',
    avatar: ellipse23,
  },
  {
    id: '5',
    name: 'Ronald Richards',
    role: 'Recruiter',
    rating: 5,
    text: 'Best bouquet shop ever! Ordered multiple times now and each time the quality is consistently amazing. The team is very accommodating with custom requests. Highly recommended!',
    avatar: ellipse22,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl p-5 shadow-sm border border-pink-100 mx-3">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-11 h-11 rounded-full object-cover flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="font-bold text-gray-800 text-sm truncate">{review.name}</p>
          <p className="text-xs text-[#8e8e8e]">{review.role}</p>
        </div>
      </div>
      <StarRating count={review.rating} />
      <p className="mt-2.5 text-sm text-[#727885] leading-relaxed line-clamp-4">{review.text}</p>
    </div>
  );
}

export function Testimonials() {
  // Duplicate reviews for seamless infinite loop
  const doubled = [...reviews, ...reviews];

  return (
    <section id="testimoni" className="py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#e74694]">
          Apa Kata Mereka?
        </h2>
        <p className="mt-3 text-base sm:text-lg text-[#8e8e8e] max-w-xl mx-auto">
          Ribuan pelanggan sudah puas dengan bouquet dari 23Bouquet.
        </p>
      </div>

      {/* Marquee track — overflow hidden set on parent */}
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee">
          {doubled.map((review, i) => (
            <ReviewCard key={`${review.id}-${i}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

