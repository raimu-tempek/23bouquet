import cathrineBouquet from '../assets/Cathrine Bouquet.webp';
import omakaseBouquet from '../assets/Omakase Bouquet.webp';
import midnightSeriesA from '../assets/Midnight Series A.webp';
import summerSeriesA from '../assets/Summer Series A.webp';
import jesslynSeriesB from '../assets/Jesslyn Series B.webp';
import seoulBouquet from '../assets/Seoul Bouquet.webp';
// NOTE: nama file aslinya "Bloom Box  A.webp" (dua spasi) - produknya "Bloom Box A".
import bloomBoxA from '../assets/Bloom Box  A.webp';
import beijingBouquet from '../assets/Beijing Bouquet.webp';
import handBouquetB from '../assets/Hand Bouquet B.webp';
import pipeBouquetSeriesA from '../assets/Pipe Bouquet Series A.webp';
import pipeBouquetSeriesB from '../assets/Pipe Bouquet Series B.webp';
import vasBouquetL from '../assets/Vas Bouquet L.webp';
import midnightSeriesA1 from '../assets/Midnight Series A1.webp';
import siennaSeries from '../assets/Sienna Series.webp';
import pipeSizeL from '../assets/Pipe Size L.webp';
import jesslynSeriesA from '../assets/Jesslyn Series A.webp';
// NOTE: tidak ada file "Sienna Series B.webp" - dipakai "Sienna Series M.webp"
// (kemungkinan salah nama M/B, mohon dicek manual).
import siennaSeriesB from '../assets/Sienna Series M.webp';
import vasBouquet from '../assets/Vas Bouquet.webp';
import omakaseM from '../assets/Omakase M.webp';
import greeceBouquet from '../assets/Greece Bouquet.webp';
import seoulBouquetA from '../assets/Seoul Bouquet A.webp';
import hawaiBouquet from '../assets/Hawai Bouquet.webp';
import pipeSizeM from '../assets/Pipe Size M.webp';
import bloomBox from '../assets/Bloom Box.webp';
// @ts-expect-error - file js deskripsi produk disediakan oleh pengguna
import { productDescriptions } from './product-descriptions.js';

/** Variasi label badge di pojok kiri atas gambar produk. */
export type ProductBadge = 'Best Seller' | 'Elegan' | 'Ekonomis';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'all' | 'flower' | 'snack' | 'money';
  price: number;
  /** Harga coret (harga normal sebelum diskon). */
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  /** Deskripsi produk dari product-descriptions.js */
  description: string;
  /** Label di pojok kiri atas gambar. Semua produk sudah punya badge. */
  badge?: ProductBadge;
}

/**
 * Harga coret belum tercantum di daftar harga produk, jadi dihitung dari harga jual
 * (+20%) lalu dibulatkan ke 5.000 terdekat supaya konsisten dengan elemen harga coret
 * yang sudah ada di UI. Ganti dengan harga normal asli bila sudah tersedia, contoh:
 *   originalPrice: 950000,
 */
const normalPrice = (price: number) => Math.round((price * 1.2) / 5000) * 5000;

/** Rating produk belum ada datanya, memakai nilai placeholder seperti sebelumnya. */
const RATING = 5.0;

/**
 * Jumlah review belum ada datanya, jadi diisi angka acak 2 digit (10 - 99) per produk
 * supaya setiap kartu terlihat natural dan tidak seragam.
 *
 * Angkanya dihitung dari hash "id" produk (bukan Math.random) supaya nilainya tetap
 * sama setiap kali halaman di-render atau di-reload - kalau memakai Math.random,
 * angkanya berubah sendiri di tiap render dan terlihat seperti bug.
 * Kalau data review asli sudah tersedia, cukup tulis "reviewsCount" langsung di
 * produk yang bersangkutan: nilai manual selalu dipakai & menimpa angka acak ini.
 */
const reviewsFromId = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 100000;
  }
  return 10 + (hash % 90); // 10 - 99
};

/** Data produk dasar - "reviewsCount", "slug", dan "description" opsional di seed karena diisi otomatis di PRODUCTS. */
type ProductSeed = Omit<Product, 'reviewsCount' | 'slug' | 'description'> & {
  slug?: string;
  description?: string;
  reviewsCount?: number;
};

const PRODUCT_SEEDS: ProductSeed[] = [
  {
    id: 'cathrine-bouquet',
    name: 'Cathrine Bouquet',
    category: 'flower',
    price: 900000,
    originalPrice: normalPrice(900000),
    rating: RATING,
    image: cathrineBouquet,
    badge: 'Best Seller',
  },
  {
    id: 'omakase-bouquet',
    name: 'Omakase Bouquet',
    category: 'flower',
    price: 400000,
    originalPrice: normalPrice(400000),
    rating: RATING,
    image: omakaseBouquet,
    badge: 'Elegan',
  },
  {
    id: 'midnight-series-a',
    name: 'Midnight Series A',
    category: 'flower',
    price: 185000,
    originalPrice: normalPrice(185000),
    rating: RATING,
    image: midnightSeriesA,
    badge: 'Elegan',
  },
  {
    id: 'summer-series-a',
    name: 'Summer Series A',
    category: 'flower',
    price: 200000,
    originalPrice: normalPrice(200000),
    rating: RATING,
    image: summerSeriesA,
    badge: 'Best Seller',
  },
  {
    id: 'jesslyn-series-b',
    name: 'Jesslyn Series B',
    category: 'flower',
    price: 200000,
    originalPrice: normalPrice(200000),
    rating: RATING,
    image: jesslynSeriesB,
    badge: 'Best Seller',
  },
  {
    id: 'seoul-bouquet',
    name: 'Seoul Bouquet',
    category: 'flower',
    price: 250000,
    originalPrice: normalPrice(250000),
    rating: RATING,
    image: seoulBouquet,
    badge: 'Elegan',
  },
  {
    id: 'bloom-box-a',
    name: 'Bloom Box A',
    category: 'flower',
    price: 150000,
    originalPrice: normalPrice(150000),
    rating: RATING,
    image: bloomBoxA,
    badge: 'Ekonomis',
  },
  {
    id: 'beijing-bouquet',
    name: 'Beijing Bouquet',
    category: 'flower',
    price: 175000,
    originalPrice: normalPrice(175000),
    rating: RATING,
    image: beijingBouquet,
    badge: 'Elegan',
  },
  {
    id: 'hand-bouquet-b',
    name: 'Hand Bouquet B',
    category: 'flower',
    price: 230000,
    originalPrice: normalPrice(230000),
    rating: RATING,
    image: handBouquetB,
    badge: 'Best Seller',
  },
  {
    id: 'pipe-bouquet-series-a',
    name: 'Pipe Bouquet Series A',
    category: 'flower',
    price: 130000,
    originalPrice: normalPrice(130000),
    rating: RATING,
    image: pipeBouquetSeriesA,
    badge: 'Ekonomis',
  },
  {
    id: 'pipe-bouquet-series-b',
    name: 'Pipe Bouquet Series B',
    category: 'flower',
    price: 130000,
    originalPrice: normalPrice(130000),
    rating: RATING,
    image: pipeBouquetSeriesB,
    badge: 'Ekonomis',
  },
  {
    id: 'vas-bouquet-l',
    name: 'Vas Bouquet L',
    category: 'flower',
    price: 400000,
    originalPrice: normalPrice(400000),
    rating: RATING,
    image: vasBouquetL,
    badge: 'Best Seller',
  },
  {
    id: 'midnight-series-a1',
    name: 'Midnight Series A1',
    category: 'flower',
    price: 175000,
    originalPrice: normalPrice(175000),
    rating: RATING,
    image: midnightSeriesA1,
    badge: 'Elegan',
  },
  {
    id: 'sienna-series',
    name: 'Sienna Series',
    category: 'flower',
    price: 190000,
    originalPrice: normalPrice(190000),
    rating: RATING,
    image: siennaSeries,
    badge: 'Elegan',
  },
  {
    id: 'pipe-size-l',
    name: 'Pipe Size L',
    category: 'flower',
    price: 150000,
    originalPrice: normalPrice(150000),
    rating: RATING,
    image: pipeSizeL,
    badge: 'Ekonomis',
  },
  {
    id: 'jesslyn-series-a',
    name: 'Jesslyn Series A',
    category: 'flower',
    price: 180000,
    originalPrice: normalPrice(180000),
    rating: RATING,
    image: jesslynSeriesA,
    badge: 'Best Seller',
  },
  {
    // Gambar memakai "Sienna Series M.webp" (lihat catatan di atas).
    id: 'sienna-series-b',
    name: 'Sienna Series B',
    category: 'flower',
    price: 200000,
    originalPrice: normalPrice(200000),
    rating: RATING,
    image: siennaSeriesB,
    badge: 'Elegan',
  },
  {
    id: 'vas-bouquet',
    name: 'Vas Bouquet',
    category: 'flower',
    price: 300000,
    originalPrice: normalPrice(300000),
    rating: RATING,
    image: vasBouquet,
    badge: 'Best Seller',
  },
  {
    id: 'omakase-m',
    name: 'Omakase M',
    category: 'flower',
    price: 185000,
    originalPrice: normalPrice(185000),
    rating: RATING,
    image: omakaseM,
    badge: 'Ekonomis',
  },
  {
    id: 'greece-bouquet',
    name: 'Greece Bouquet',
    category: 'flower',
    price: 185000,
    originalPrice: normalPrice(185000),
    rating: RATING,
    image: greeceBouquet,
    badge: 'Elegan',
  },
  {
    id: 'seoul-bouquet-a',
    name: 'Seoul Bouquet A',
    category: 'flower',
    price: 250000,
    originalPrice: normalPrice(250000),
    rating: RATING,
    image: seoulBouquetA,
    badge: 'Best Seller',
  },
  {
    id: 'hawai-bouquet',
    name: 'Hawai Bouquet',
    category: 'flower',
    price: 185000,
    originalPrice: normalPrice(185000),
    rating: RATING,
    image: hawaiBouquet,
    badge: 'Ekonomis',
  },
  {
    id: 'pipe-size-m',
    name: 'Pipe Size M',
    category: 'flower',
    price: 115000,
    originalPrice: normalPrice(115000),
    rating: RATING,
    image: pipeSizeM,
    badge: 'Ekonomis',
  },
  {
    id: 'bloom-box',
    name: 'Bloom Box',
    category: 'flower',
    price: 130000,
    originalPrice: normalPrice(130000),
    rating: RATING,
    image: bloomBox,
    badge: 'Ekonomis',
  },
];

/**
 * Daftar produk final yang dipakai UI: "reviewsCount" diisi angka acak stabil dari
 * id produk (lihat reviewsFromId), atau nilai manual kalau ditulis langsung.
 * Ditambahkan juga field "slug" (mengacu ke id unik produk) dan "description"
 * dari product-descriptions.js.
 */
export const PRODUCTS: Product[] = PRODUCT_SEEDS.map(({ reviewsCount, ...product }) => ({
  ...product,
  slug: product.id,
  description: (productDescriptions as Record<string, string>)[product.id] || '',
  reviewsCount: reviewsCount ?? reviewsFromId(product.id),
}));

/** Banyaknya produk unggulan yang tampil di section "Semua Buket" beranda. */
export const FEATURED_COUNT = 4;

/**
 * Produk unggulan untuk section "Semua Buket" di beranda (sisanya bisa dilihat
 * lengkap di halaman /katalog).
 *
 * Urutan: rating tertinggi dulu, kalau sama -> urutan asli di data. Jumlah review
 * sengaja TIDAK dipakai sebagai penentu urutan karena angkanya masih data acak
 * (lihat reviewsFromId): kalau dipakai, produk unggulan di beranda bisa berubah hanya
 * karena angka acaknya kebetulan lebih besar. Saat ini rating masih placeholder (5.0),
 * jadi hasilnya = 4 produk pertama; begitu data rating asli diisi, urutannya otomatis
 * ikut menyesuaikan tanpa perlu ubah komponen.
 */
export const FEATURED_PRODUCTS: Product[] = PRODUCTS.map((product, index) => ({
  product,
  index,
}))
  .sort(
    (a, b) => b.product.rating - a.product.rating || a.index - b.index
  )
  .slice(0, FEATURED_COUNT)
  .map(({ product }) => product);

