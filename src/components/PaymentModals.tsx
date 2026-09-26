import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  X,
  QrCode,
  Landmark,
  Copy,
  CheckCircle2,
  Receipt,
  Home,
} from 'lucide-react';
import { formatRupiahSpaced } from '../data/bouquet-options';

/** Metode pembayaran yang tersedia di flow dummy ini. */
export type PaymentMethod = 'qris' | 'bank';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Kerangka modal bersama yang dipakai PaymentModal & SuccessModal.
 *
 * Menutup lewat tombol X, klik area gelap, atau tombol Escape. Panel diberi
 * `role="dialog"` + focus awal ke panel supaya ramah keyboard/screen reader.
 */
const ModalShell: React.FC<BaseModalProps> = ({ open, onClose, children }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // Cegah halaman di belakang modal ikut ter-scroll.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up focus:outline-none"
      >
        {children}
      </div>
    </div>
  );
};

/**
 * QR statis untuk QRIS.
 *
 * Ini murni visual (project portofolio, tidak ada payment gateway sungguhan),
 * tapi polanya dibuat mirip QR asli: tiga "finder pattern" di sudut dan
 * modul acak yang stabil berdasarkan seed, supaya tidak berkedip tiap render.
 */
const QrPlaceholder: React.FC<{ seed: string }> = ({ seed }) => {
  const size = 21;

  // PRNG sederhana supaya pola QR sama setiap render.
  const hash = Array.from(seed).reduce(
    (h, c) => (h * 31 + c.charCodeAt(0)) >>> 0,
    2166136261
  );
  let state = hash;
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967295;
  };

  const cells: boolean[] = [];
  for (let i = 0; i < size * size; i += 1) cells.push(next() > 0.52);

  // Finder pattern 7x7 di tiga sudut, ditimpa di atas pola acak.
  const stamp = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        cells[(oy + y) * size + (ox + x)] = edge || core;
      }
    }
  };
  stamp(0, 0);
  stamp(size - 7, 0);
  stamp(0, size - 7);

  return (
    <div className="mx-auto w-fit rounded-2xl border-4 border-gray-900 bg-white p-3">
      <div
        className="grid gap-0"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        aria-hidden="true"
      >
        {cells.map((on, i) => (
          <span key={i} className={on ? 'bg-gray-900' : 'bg-white'} style={{ width: 7, height: 7 }} />
        ))}
      </div>
    </div>
  );
};

/** Nomor pesanan dummy, mis. "BB-2609-4821". */
export const makeOrderNumber = (): string => {
  const d = new Date();
  const y = String(d.getFullYear()).slice(2);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `BB-${y}${m}-${rand}`;
};


interface PaymentModalProps {
  open: boolean;
  method: PaymentMethod;
  total: number;
  orderNumber: string;
  /** Nama penerima, ditampilkan di rekening transfer. */
  customerName: string;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Modal pembayaran: menampilkan QRIS atau data rekening sesuai metode yang
 * dipilih, lalu tombol konfirmasi memakai flow dummy (tanpa API pembayaran).
 */
export const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  method,
  total,
  orderNumber,
  customerName,
  onClose,
  onConfirm,
}) => {
  const [copied, setCopied] = React.useState(false);
  const isQris = method === 'qris';

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText('8812345678901');
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard bisa ditolak browser; tombol tetap aman untuk diklik.
    }
  };

  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="flex items-start justify-between gap-3 p-6 border-b border-pink-100">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-pink-100 flex items-center justify-center shrink-0">
            {isQris ? (
              <QrCode className="w-6 h-6 text-[#e74694]" />
            ) : (
              <Landmark className="w-6 h-6 text-[#e74694]" />
            )}
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 leading-tight">
              {isQris ? 'Bayar via QRIS' : 'Transfer Bank'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Nomor pesanan {orderNumber}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full text-gray-400 hover:bg-pink-50 hover:text-gray-700 transition-colors cursor-pointer shrink-0"
          aria-label="Tutup modal pembayaran"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {isQris ? (
          <>
            <QrPlaceholder seed={orderNumber} />
            <p className="text-center text-sm text-gray-600 leading-relaxed">
              Scan QR ini dengan aplikasi e-wallet atau mobile banking kamu.
            </p>
          </>
        ) : (
          <div className="rounded-2xl bg-pink-50/70 border border-pink-100 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Bank</p>
                <p className="text-sm font-bold text-gray-900">BCA Digital</p>
              </div>
              <Landmark className="w-5 h-5 text-[#e74694] shrink-0" />
            </div>
            <div className="h-px bg-pink-200" />
            <div>
              <p className="text-xs text-gray-500">Nomor rekening</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-lg font-extrabold text-gray-900 tracking-wider">
                  8812345678901
                </p>
                <button
                  type="button"
                  onClick={copyAccount}
                  className="p-1.5 rounded-lg border border-pink-200 bg-white text-[#e74694] hover:bg-pink-50 transition-colors cursor-pointer shrink-0"
                  aria-label="Salin nomor rekening"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Atas nama</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">
                {customerName || 'Pelanggan 23Bouquet'}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
          <span className="text-sm text-gray-600">Total yang harus dibayar</span>
          <span className="text-lg font-extrabold text-[#e74694]">
            {formatRupiahSpaced(total)}
          </span>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          Ini adalah simulasi ({' '}
          <span className="font-semibold">project portofolio</span>
          {' '}— tidak ada pembayaran sungguhan yang diproses. Tekan tombol di bawah
          untuk melanjutkan ke halaman konfirmasi pesanan.
        </p>
      </div>

      <div className="p-6 pt-0 flex gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 py-3.5 rounded-2xl bg-[#e74694] hover:bg-[#db2777] text-white font-bold text-sm shadow-lg shadow-pink-200 active:scale-[0.99] transition-all cursor-pointer"
        >
          Saya Sudah Bayar
        </button>
      </div>
    </ModalShell>
  );
};


interface SuccessModalProps {
  open: boolean;
  orderNumber: string;
  total: number;
  customerName: string;
  onViewOrder: () => void;
  onGoHome: () => void;
}

/** Warna konfeti: pink brand + palet cerah biar festive tapi tetap on-brand. */
const CONFETTI_COLORS = ['#e74694', '#f9a8d4', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'];

/**
 * Lapisan z-index.
 *
 * PENTING: canvas-confetti secara default memakai zIndex 100, sedangkan overlay
 * modal ada di z-150 dengan `backdrop-blur-sm`. Kalau confetti di bawah
 * overlay, dia ikut ter-blur dan praktis tidak terlihat. Jadi confetti wajib
 * diberi z-index DI ATAS overlay, supaya partikel benar-benar melintas di
 * depan kartu modal (white card) lalu jatuh menghilang.
 *
 * Canvas-nya sendiri tetap `pointer-events: none` (diatur library), jadi
 * meski gambarnya menutupi tombol, klik ke tombol tetap tembus.
 */
const MODAL_Z = 150;
const CONFETTI_Z = MODAL_Z + 10;

/**
 * Modal "Pesanan Berhasil!".
 *
 * Konfeti dinyalakan sekali saat modal pertama kali muncul (bukan tiap
 * render). Library canvas-confetti membuat <canvas> full-screen dengan
 * `pointer-events: none`, jadi PARTICLE TIDAK PERNAH MENGHALANGI klik pada
 * tombol di bawah ini.
 */
export const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  orderNumber,
  total,
  customerName,
  onViewOrder,
  onGoHome,
}) => {
  useEffect(() => {
    if (!open) return;

    const fire = (
      particleCount: number,
      x: number,
      y: number,
      spread: number,
      startVelocity: number
    ) =>
      confetti({
        particleCount,
        spread,
        startVelocity,
        gravity: 1,
        scalar: 0.95,
        ticks: 240,
        origin: { x, y },
        colors: CONFETTI_COLORS,
        zIndex: CONFETTI_Z,
        disableForReducedMotion: true,
      });

    // Ledakan utama tepat di area kartu modal. Kecepatan awal sengaja dibuat
    // pelan supaya gumpalan partikel terlihat melintas DI DEPAN kartu putih
    // selama sekitar setengah detik, baru mulai gravitational jatuh ke bawah.
    fire(90, 0.5, 0.4, 95, 22);
    // Semburan kecil terus-menerus dari dua sudut, seperti celebration Duolingo.
    const durationMs = 2500;
    const startedAt = Date.now();
    let frame = 0;
    const loop = () => {
      if (Date.now() - startedAt > durationMs) return;
      fire(3, 0.12, 0.16, 55, 34);
      fire(3, 0.88, 0.16, 55, 34);
      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);

    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  return (
    <ModalShell open={open} onClose={onViewOrder}>
      <div className="p-7 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-11 h-11 text-emerald-500" />
        </div>

        <h2 className="mt-5 text-2xl font-extrabold text-gray-900 tracking-tight">
          Pesanan Berhasil!
        </h2>
        <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
          Terima kasih{customerName ? `, ${customerName}` : ''}! Pesananmu sudah kami
          terima dan akan segera diproses oleh tim florist kami.
        </p>

        <div className="mt-5 rounded-2xl bg-pink-50/70 border border-pink-100 p-4 space-y-2.5 text-left">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-gray-500">
              <Receipt className="w-4 h-4" />
              Nomor pesanan
            </span>
            <span className="font-bold text-gray-900">{orderNumber}</span>
          </div>
          <div className="h-px bg-pink-200" />
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-gray-500">Total dibayar</span>
            <span className="font-extrabold text-[#e74694]">
              {formatRupiahSpaced(total)}
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-400 leading-relaxed">
          Ini simulasi project portofolio, jadi tidak ada transaksi pembayaran
          sungguhan yang diproses.
        </p>
      </div>

      <div className="px-7 pb-7 space-y-2.5">
        <button
          type="button"
          onClick={onViewOrder}
          className="w-full py-3.5 rounded-2xl bg-[#e74694] hover:bg-[#db2777] text-white font-bold text-sm shadow-lg shadow-pink-200 active:scale-[0.99] transition-all cursor-pointer"
        >
          Lihat Pesanan Saya
        </button>
        <button
          type="button"
          onClick={onGoHome}
          className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </button>
      </div>
    </ModalShell>
  );
};

