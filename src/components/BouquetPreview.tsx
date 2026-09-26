import React from 'react';
import { Sparkles } from 'lucide-react';
import { MAX_FLOWERS, type PlacedStem } from '../data/bouquet-options';

interface BouquetPreviewProps {
  /** Tangkai yang sudah diposisikan oleh buildBouquetLayout(). */
  stems: PlacedStem[];
  /** Gambar wrapping sebagai base layer. */
  wrappingImage: string;
  wrappingName: string;
  /** Jumlah tangkai terpilih, untuk badge penghitung. */
  totalStems: number;
}

/**
 * Preview buket secara real-time.
 *
 * Dua layer:
 * 1. Base layer - gambar wrapping/vas sesuai pilihan user di
 *    "Pilih Tampilan Buket".
 * 2. Overlay layer - setiap tangkai bunga terpilih dirender sebagai <img>
 *    absolut. Pangkal batangnya dikunci di titik masuk wrapping lalu diputar
 *    dari pangkal itu, sehingga kepala bunganya membentang seperti kipas dan
 *    batangnya terlihat masuk ke dalam cone.
 *
 * Catatan transform: wrapper <div> hanya diposisikan (tanpa transform),
 * sementara rotasi dilakukan pada <img> dengan transform-origin di titik
 * bawah-tengah (= pangkal batang). Kalau rotasi ikut dipasang di wrapper yang
 * sudah di-translate, sumbu putar ikut bergeser dan batangnya tidak lagi
 * menyatu di titik yang sama.
 */
export const BouquetPreview: React.FC<BouquetPreviewProps> = ({
  stems,
  wrappingImage,
  wrappingName,
  totalStems,
}) => {
  const isFull = totalStems >= MAX_FLOWERS;

  return (
    <div className="w-full">
      <div
        className="relative w-full aspect-square rounded-3xl sm:rounded-[32px] bg-gradient-to-b from-pink-50/70 via-white to-pink-50/50 border-2 border-pink-500/10 overflow-hidden"
        aria-label={`Preview buket dengan ${wrappingName}`}
      >
        {/* Base layer: wrapping / vas yang dipilih */}
        <img
          src={wrappingImage}
          alt={wrappingName}
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain select-none"
        />

        {/* Overlay layer: tangkai bunga tersusun kipas di atas wrapping */}
        {stems.map((stem) => (
          <div
            key={stem.key}
            className="absolute"
            style={{
              left: `${stem.anchorX}%`,
              top: `${stem.anchorY}%`,
              width: `${stem.width}%`,
              // Geser wrapper agar titik bawah-tengah img (= pangkal batang)
              // tepat berada di titik masuk wrapping.
              transform: 'translate(-50%, -100%)',
              zIndex: stem.zIndex,
            }}
          >
            <img
              src={stem.image}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="block w-full h-auto select-none transition-transform duration-300 ease-out"
              style={{
                transformOrigin: '50% 100%',
                // rotate dulu, baru translateY: geser searah sumbu batang yang
                // sudah diputar supaya ujung batang mendarat di titik masuk.
                transform: `rotate(${stem.angle}deg) translateY(${stem.tipDrop}%)`,
              }}
            />
          </div>
        ))}

        {/* Empty state: belum ada bunga dipilih */}
        {stems.length === 0 && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-white/80 border border-pink-100 flex items-center justify-center shadow-sm">
              <Sparkles className="w-6 h-6 text-[#e74694]" />
            </div>
            <p className="mt-3 text-sm font-bold text-gray-800">Belum ada bunga dipilih</p>
            <p className="mt-1 text-xs text-gray-500 max-w-[16rem] leading-relaxed">
              Pilih bunga di sebelah kanan, buketmu akan langsung tersusun di sini secara otomatis.
            </p>
          </div>
        )}

        {/* Badge jumlah bunga + penanda ketika sudah kena batas maksimum */}
        <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-3 py-1.5 bg-white/85 backdrop-blur-sm rounded-full text-[11px] font-bold text-[#e74694] shadow-sm">
            {totalStems} / {MAX_FLOWERS} bunga
          </span>
          {isFull && (
            <span className="px-3 py-1.5 bg-[#e74694] text-white rounded-full text-[11px] font-bold shadow-sm">
              Maksimal tercapai
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
