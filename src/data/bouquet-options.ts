// Aset kustom buket. Semua gambar punya latar transparan dan format .webp.
import lilyPink from '../assets/lily-pink.webp';
import gerberaOrange from '../assets/gerbera-orange.webp';
import gerberaPink from '../assets/gerbera-pink.webp';
import irisBiru from '../assets/iris-biru.webp';
import irisPutih from '../assets/iris-putih.webp';
import heliconiaEmas from '../assets/heliconia-emas.webp';
import heliconiaPink from '../assets/heliconia-pink.webp';
import heliconiaMerah from '../assets/heliconia-merah.webp';
import mawarOranye from '../assets/mawar-oranye.webp';
import mawarPutih from '../assets/mawar-putih.webp';
import mawarPink from '../assets/mawar-pink.webp';
import mawarMerah from '../assets/mawar-merah.webp';

import buketPutih from '../assets/buket-putih.webp';
import buketHitam from '../assets/buket-hitam.webp';
import buketWarna from '../assets/buket-warna.webp';

import kartuUcapan from '../assets/kartu-ucapan.webp';
import pita from '../assets/pita.webp';
import boneka from '../assets/boneka.webp';
import fotoPolaroid from '../assets/foto-polaroid.webp';

/**
 * Batas total tangkai bunga per buket. Dipakai untuk disable tombol tambah
 * dan menampilkan notifikasi kecil di preview - interaksi lain (kurangi
 * bunga, ganti wrapping, pilih add-on) tetap dibiarkan aktif.
 */
export const MAX_FLOWERS = 7;

/** Biaya jasa rangkai & kemasan (potong/kawat/kartonskor). */
export const BASE_FEE = 50000;

/** Ongkos kirim kalau user minta dikirim, gratis kalau ambil sendiri. */
export const DELIVERY_FEE = 20000;

export interface FlowerOption {
  id: string;
  name: string;
  image: string;
  /** Harga per tangkai. */
  price: number;
}

/**
 * Pilihan bunga untuk grid "Pilih Jenis Bunga".
 *
 * Setiap aset adalah satu tangkai utuh (bunga di atas, batang di bawah), bukan
 * close-up kepala bunga - itu yang dipakai {@link buildBouquetLayout} untuk
 * menyusun kipas dengan pangkal batang masuk ke dalam wrapping.
 */
export const FLOWER_OPTIONS: FlowerOption[] = [
  { id: 'lily-pink', name: 'Lily Pink', image: lilyPink, price: 22000 },
  { id: 'gerbera-orange', name: 'Gerbera Oranye', image: gerberaOrange, price: 15000 },
  { id: 'gerbera-pink', name: 'Gerbera Pink', image: gerberaPink, price: 15000 },
  { id: 'iris-biru', name: 'Iris Biru', image: irisBiru, price: 16000 },
  { id: 'iris-putih', name: 'Iris Putih', image: irisPutih, price: 16000 },
  { id: 'heliconia-emas', name: 'Heliconia Emas', image: heliconiaEmas, price: 20000 },
  { id: 'heliconia-pink', name: 'Heliconia Pink', image: heliconiaPink, price: 20000 },
  { id: 'heliconia-merah', name: 'Heliconia Merah', image: heliconiaMerah, price: 20000 },
  { id: 'mawar-oranye', name: 'Mawar Oranye', image: mawarOranye, price: 18000 },
  { id: 'mawar-putih', name: 'Mawar Putih', image: mawarPutih, price: 18000 },
  { id: 'mawar-pink', name: 'Mawar Pink', image: mawarPink, price: 18000 },
  { id: 'mawar-merah', name: 'Mawar Merah', image: mawarMerah, price: 18000 },
];

export interface WrappingOption {
  id: string;
  name: string;
  image: string;
  price: number;
  tagline: string;
  /**
   * Titik masuk tangkai ke dalam buket, dalam persen dari area preview.
   * Diperkirakan dari artwork: buket putih ~74% (tepat di atas pita), sedangkan
   * buket hitam/warna tidak punya pita dan ujungnya lebih runcing, jadi
   * sedikit lebih tinggi supaya batang tidak menembus ujung cone.
   */
  anchor: { x: number; y: number };
}

export const WRAPPING_OPTIONS: WrappingOption[] = [
  {
    id: 'putih',
    name: 'Buket Putih',
    image: buketPutih,
    price: 35000,
    tagline: 'Klasik & bersih',
    anchor: { x: 50, y: 74 },
  },
  {
    id: 'hitam',
    name: 'Buket Hitam',
    image: buketHitam,
    price: 45000,
    tagline: 'Elegan & bold',
    anchor: { x: 50, y: 64 },
  },
  {
    id: 'warna',
    name: 'Buket Warna',
    image: buketWarna,
    price: 55000,
    tagline: 'Ceria & ramah',
    anchor: { x: 50, y: 66 },
  },
];

export interface AddOnOption {
  id: string;
  name: string;
  image: string;
  price: number;
}

export const ADDON_OPTIONS: AddOnOption[] = [
  { id: 'kartu-ucapan', name: 'Kartu Ucapan', image: kartuUcapan, price: 15000 },
  { id: 'pita', name: 'Pita Kustom', image: pita, price: 10000 },
  { id: 'boneka', name: 'Boneka Pendek', image: boneka, price: 45000 },
  { id: 'foto-polaroid', name: 'Foto Polaroid', image: fotoPolaroid, price: 25000 },
];

/** Pilihan bunga yang sedang aktif beserta jumlahnya. */
export interface FlowerSelection {
  id: string;
  count: number;
}

/** Satu tangkai yang sudah diposisikan di area preview. */
export interface PlacedStem {
  /** Kunci stabil per tangkai supaya posisi tidak acak ulang tiap render. */
  key: string;
  flowerId: string;
  image: string;
  /** Titik pangkal batang (persen dari area preview). */
  anchorX: number;
  anchorY: number;
  /** Sudut kipas terhadap vertikal, dalam derajat. Negatif = ke kiri. */
  angle: number;
  /** Lebar gambar tangkai (persen dari lebar area preview). */
  width: number;
  /**
   * Koreksi vertikal (persen tinggi gambar) untuk menyamakan ujung batang yang
   * ada di ~96% tinggi kanvas dengan titik masuk wrapping.
   */
  tipDrop: number;
  /** Urutan tumpukan: pinggir kipas di depan, tengah di belakang. */
  zIndex: number;
}

/**
 * Hash string -> angka 0..1. Dipakai untuk memberi variasi posisi yang stabil
 * per tangkai, sehingga buket tidak "berganti-acak" tiap kali di-render ulang,
 * tapi tiap tangkai tetap terlihat berbeda posisinya.
 */
const seededUnit = (seed: string): number => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
};

/** Rentang sudut kipas total (derajat) antara tangkai paling kiri & kanan. */
const FAN_SPREAD = 72;
/** Lebar gambar tangkai relatif terhadap lebar area preview (persen). */
const STEM_WIDTH = 62;
/**
 * Ujung batang pada semua aset berada di 92-99% tinggi kanvas (bukan 100%),
 * jadi tanpa koreksi ini batang akan menggantung sedikit di atas titik masuk
 * wrapping. Nilai ini menggeser gambar turun sebesar 3.5% tinggi gambarnya
 * (dihitung dari rata-rata ujung batang hasil pengukuran alpha channel).
 */
const STEM_TIP_DROP = 3.5;

/**
 * Mengubah pilihan bunga menjadi daftar tangkai yang siap dirender sebagai kipas
 * di atas wrapping.
 *
 * Cara kerjanya: pangkal setiap batang dikunci di titik yang sama (titik masuk
 * wrapping) dengan sedikit simpangan, lalu batang diputar dari pangkal itu
 * sehingga kepala bunganya membentang seperti kipas. Tangkai di tengah diberi
 * z-index lebih rendah (lebih belakang/"masuk ke dalam") sedangkan tangkai di
 * pinggir superimpos di depannya, persis seperti susunan buket sungguhan.
 */
export const buildBouquetLayout = (
  selections: FlowerSelection[],
  anchor: { x: number; y: number },
): PlacedStem[] => {
  // Ratakan pilihan jadi daftar tangkai satu per satu, urut sesuai urutan
  // flower di grid supaya posisinya konsisten.
  const stems: { key: string; flowerId: string; image: string }[] = [];
  for (const flower of FLOWER_OPTIONS) {
    const selected = selections.find((s) => s.id === flower.id);
    if (!selected) continue;
    for (let i = 0; i < selected.count; i += 1) {
      stems.push({ key: `${flower.id}#${i}`, flowerId: flower.id, image: flower.image });
    }
  }

  const total = stems.length;
  if (total === 0) return [];

  // Sudut dibagi rata supaya kipas selalu simetris, lalu tiap tangkai diberi
  // simpangan kecil supaya tidak terlihat berjejer rapi seperti barisan.
  const step = total > 1 ? FAN_SPREAD / (total - 1) : 0;

  return stems.map((stem, index) => {
    // -1 (paling kiri) .. 0 (tengah) .. 1 (paling kanan)
    const position = total > 1 ? (index / (total - 1)) * 2 - 1 : 0;
    const jitterAngle = (seededUnit(`${stem.key}:angle`) - 0.5) * 6;
    const jitterX = (seededUnit(`${stem.key}:x`) - 0.5) * 3.2;
    const jitterY = (seededUnit(`${stem.key}:y`) - 0.5) * 2.4;
    const jitterSize = (seededUnit(`${stem.key}:size`) - 0.5) * 7;

    return {
      key: stem.key,
      flowerId: stem.flowerId,
      image: stem.image,
      anchorX: anchor.x + jitterX,
      anchorY: anchor.y + jitterY,
      angle: position * step + jitterAngle,
      width: STEM_WIDTH + jitterSize,
      // Geser gambar turun sedikit supaya ujung batang (yang ada di ~96% tinggi
      // kanvas, bukan 100%) tepat berada di titik masuk wrapping.
      tipDrop: STEM_TIP_DROP,
      // Pinggir kipas = paling depan, tengah = paling belakang.
      zIndex: 10 + Math.round(Math.abs(position) * 8),
    };
  });
};

/** Format angka ke Rupiah tanpa spasi, contoh: 185000 -> "Rp185.000". */
export const formatRupiah = (value: number): string => `Rp${value.toLocaleString('id-ID')}`;

/** Format angka ke Rupiah dengan spasi, contoh: 185000 -> "Rp 185.000". */
export const formatRupiahSpaced = (value: number): string =>
  `Rp ${value.toLocaleString('id-ID')}`;
