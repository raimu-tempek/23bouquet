import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
  Store,
  User,
  QrCode,
  Landmark,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import { DELIVERY_FEE, formatRupiahSpaced } from '../data/bouquet-options';
import {
  PaymentModal,
  SuccessModal,
  makeOrderNumber,
  type PaymentMethod,
} from './PaymentModals';

/** Cara pesanan sampai ke tangan pembeli. */
type Fulfillment = 'delivery' | 'pickup';

/* ------------------------------------------------------------------ *
 * Helper tanggal - sengaja tanpa library supaya bundle tetap ringan.
 * ------------------------------------------------------------------ */

/** Tanggal lokal sebagai "yyyy-mm-dd" (toISOString() memakai UTC, jangan dipakai). */
const toISODate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const todayISO = () => toISODate(new Date());

/** Besok, jadi default form tidak pernah bermasalah dengan tanggal lampau. */
const tomorrowISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toISODate(d);
};

/** "2026-09-27" -> "Minggu, 27 September 2026". */
const formatTanggal = (iso: string) => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/** Style input yang dipakai bersama seluruh field form. */
const fieldClass = (invalid: boolean) =>
  `w-full rounded-xl border-2 bg-pink-50/40 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:border-[#e74694] focus:bg-white ${
    invalid ? 'border-red-300' : 'border-pink-200'
  }`;

/** Pesan error di bawah field. */
const ErrorText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
    {children}
  </p>
);


/**
 * Halaman Checkout (/checkout).
 *
 * Sumber data: `CartContext`. Item custom buket membawa rincian biaya
 * (`lines`) supaya ringkasan di sini sama persis dengan "Detail Pesanan" di
 * halaman Kustom Buket, sementara produk katalog hanya tampil sebagai satu
 * baris biasa.
 *
 * Ongkos kirim sengaja dihitung di halaman ini (bukan di halaman asal),
 * karena pilihan Kirim/Ambil di toko dibuat di form checkout - jadi tidak ada
 * risiko ongkir terhitung dua kali.
 *
 * Tidak ada payment gateway sungguhan: metode pembayaran (QRIS / Transfer
 * Bank) dipilih di halaman ini, lalu dibuka modal instruksi pembayaran dummy
 * dan ditutup dengan modal "Pesanan Berhasil".
 */
export const CheckoutPage: React.FC = () => {
  const { items, totalPrice } = useCart();
  const { navigate } = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fulfillment, setFulfillment] = useState<Fulfillment>('delivery');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(tomorrowISO);
  const [time, setTime] = useState('10:00');
  const [note, setNote] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Alur pembayaran dummy: pilih metode -> modal pembayaran -> modal sukses.
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const isDelivery = fulfillment === 'delivery';
  const deliveryCost = isDelivery ? DELIVERY_FEE : 0;
  const grandTotal = totalPrice + deliveryCost;


  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};

    if (!name.trim()) {
      next.name = 'Nama lengkap wajib diisi.';
    }

    const digits = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      next.phone = 'Nomor WhatsApp wajib diisi.';
    } else if (digits.length < 9 || digits.length > 15) {
      next.phone = 'Nomor WhatsApp tidak valid (9-15 digit).';
    }

    if (isDelivery && !address.trim()) {
      next.address = 'Alamat wajib diisi karena pesanan dikirim.';
    }

    if (!date) {
      next.date = 'Tanggal wajib diisi.';
    } else if (date < todayISO()) {
      next.date = 'Tanggal tidak boleh di masa lalu.';
    }

    if (!time) {
      next.time = 'Jam wajib diisi.';
    }

    return next;
  };

  /**
   * Submit form: validasi dulu, kalau lolos baru buka modal pembayaran.
   * Tidak ada navigasi keluar aplikasi di sini.
   */
  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstInvalid?.focus();
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setOrderNumber(makeOrderNumber());
    setIsPaymentOpen(true);
  };

  /** User menekan "Saya Sudah Bayar" -> tutup modal bayar, buka modal sukses. */
  const handlePaymentConfirmed = () => {
    setIsPaymentOpen(false);
    setIsSuccessOpen(true);
  };

  /** "Lihat Pesanan Saya": tutup modal lalu scroll ke kartu ringkasan pesanan. */
  const handleViewOrder = () => {
    setIsSuccessOpen(false);
    window.requestAnimationFrame(() => {
      document
        .getElementById('checkout-summary')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };


  /* ---------------- Keranjang kosong ---------------- */
  if (items.length === 0) {
    return (
      <div className="bg-[#fffbfe] min-h-screen">
        <section className="pt-24 sm:pt-28 pb-16 sm:pb-24">
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-[#fce8f3] flex items-center justify-center mx-auto mb-5 text-4xl">
              💐
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Keranjang masih kosong
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Belum ada pesanan untuk dikonfirmasi. Pilih buket favoritmu atau rancang
              sendiri di halaman Kustom Buket.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                onClick={() => navigate('/kustom-buket')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#e74694] hover:bg-[#db2777] text-white font-bold text-sm transition-all shadow-lg shadow-pink-200 active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
                Rancang Buket
              </button>
              <button
                type="button"
                onClick={() => navigate('/katalog')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-[#e74694] text-[#e74694] hover:bg-pink-50 font-bold text-sm transition-all active:scale-95"
              >
                Lihat Katalog
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* ---------------- Halaman checkout ---------------- */
  return (
    <div className="bg-[#fffbfe] min-h-screen">
      <section className="pt-24 sm:pt-28 pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#e74694] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>

          <div className="mt-3 mb-7 sm:mb-9">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Checkout
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-gray-600">
              Isi data pengiriman lalu konfirmasi pesananmu ke WhatsApp kami.
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start"
          >
            {/* ============ KOLOM KIRI: FORM ============ */}
            <div className="lg:col-span-3 space-y-5">


              {/* ---------- Informasi Pengiriman ---------- */}
              <section className="bg-white rounded-3xl border-2 border-pink-500/10 p-5 sm:p-6 space-y-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Informasi Pengiriman
                </h2>

                <div>
                  <label htmlFor="co-nama" className="block text-sm text-gray-600 mb-2">
                    Nama lengkap <span className="text-[#e74694]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      id="co-nama"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Aisyah Putri"
                      aria-invalid={Boolean(errors.name)}
                      className={`${fieldClass(Boolean(errors.name))} pl-11`}
                    />
                  </div>
                  {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </div>

                <div>
                  <label htmlFor="co-telp" className="block text-sm text-gray-600 mb-2">
                    Nomor WhatsApp <span className="text-[#e74694]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      id="co-telp"
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      aria-invalid={Boolean(errors.phone)}
                      className={`${fieldClass(Boolean(errors.phone))} pl-11`}
                    />
                  </div>
                  {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
                </div>

                {/* Metode pengiriman - pill yang sama seperti di Kustom Buket */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Metode pengiriman</p>
                  <div className="inline-flex items-center gap-1.5 bg-pink-100/70 p-1.5 rounded-full border border-pink-200/60">
                    <button
                      type="button"
                      onClick={() => setFulfillment('delivery')}
                      aria-pressed={isDelivery}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isDelivery
                          ? 'bg-[#e74694] text-white shadow-sm'
                          : 'text-gray-600 hover:text-[#e74694] hover:bg-white/60'
                      }`}
                    >
                      Kirim
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillment('pickup')}
                      aria-pressed={!isDelivery}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        !isDelivery
                          ? 'bg-[#e74694] text-white shadow-sm'
                          : 'text-gray-600 hover:text-[#e74694] hover:bg-white/60'
                      }`}
                    >
                      Ambil di toko
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {isDelivery
                      ? `Ongkos kirim ${formatRupiahSpaced(DELIVERY_FEE)} per pesanan.`
                      : 'Gratis, ambil langsung di toko.'}
                  </p>
                </div>


                {/* Field alamat hanya muncul saat mode kirim */}
                {isDelivery && (
                  <div>
                    <label htmlFor="co-alamat" className="block text-sm text-gray-600 mb-2">
                      Alamat lengkap <span className="text-[#e74694]">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
                      <textarea
                        id="co-alamat"
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, kode pos"
                        aria-invalid={Boolean(errors.address)}
                        className={`${fieldClass(Boolean(errors.address))} pl-11 resize-none`}
                      />
                    </div>
                    {errors.address && <ErrorText>{errors.address}</ErrorText>}
                  </div>
                )}

                {!isDelivery && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                    <Store className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Alamat tidak diperlukan. Kami akan kabari lewat WhatsApp saat buket
                      siap diambil di toko.
                    </p>
                  </div>
                )}

                {/* Tanggal & jam */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="co-tanggal" className="block text-sm text-gray-600 mb-2">
                      Tanggal <span className="text-[#e74694]">*</span>
                    </label>
                    <div className="relative">
                      <CalendarDays className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        id="co-tanggal"
                        type="date"
                        value={date}
                        min={todayISO()}
                        onChange={(e) => setDate(e.target.value)}
                        aria-invalid={Boolean(errors.date)}
                        className={`${fieldClass(Boolean(errors.date))} pl-11`}
                      />
                    </div>
                    {errors.date && <ErrorText>{errors.date}</ErrorText>}
                  </div>

                  <div>
                    <label htmlFor="co-jam" className="block text-sm text-gray-600 mb-2">
                      Jam <span className="text-[#e74694]">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        id="co-jam"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        aria-invalid={Boolean(errors.time)}
                        className={`${fieldClass(Boolean(errors.time))} pl-11`}
                      />
                    </div>
                    {errors.time && <ErrorText>{errors.time}</ErrorText>}
                  </div>
                </div>
              </section>


              {/* ---------- Catatan Tambahan ---------- */}
              <section className="bg-white rounded-3xl border-2 border-pink-500/10 p-5 sm:p-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Catatan Tambahan{' '}
                  <span className="normal-case font-medium text-gray-400">(opsional)</span>
                </h2>
                <label htmlFor="co-catatan" className="sr-only">
                  Catatan untuk florist
                </label>
                <textarea
                  id="co-catatan"
                  rows={3}
                  value={note}
                  maxLength={200}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Contoh: warna dominan merah, tambahkan pita cokelat..."
                  className="mt-3 w-full rounded-xl border border-pink-200 bg-pink-50/40 px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#e74694] focus:bg-white transition-colors resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{note.length}/200</p>
              </section>

              {/* ---------- Metode Pembayaran ---------- */}
              <section className="bg-white rounded-3xl border-2 border-pink-500/10 p-5 sm:p-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Metode Pembayaran
                </h2>

                <div className="mt-3 space-y-2.5">
                  {(
                    [
                      {
                        id: 'qris' as PaymentMethod,
                        label: 'QRIS',
                        desc: 'Scan pakai e-wallet atau mobile banking apa pun',
                        Icon: QrCode,
                      },
                      {
                        id: 'bank' as PaymentMethod,
                        label: 'Transfer Bank',
                        desc: 'BCA Digital -/virtual account',
                        Icon: Landmark,
                      },
                    ] as const
                  ).map(({ id, label, desc, Icon }) => {
                    const active = paymentMethod === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPaymentMethod(id)}
                        aria-pressed={active}
                        className={`w-full flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all cursor-pointer ${
                          active
                            ? 'border-[#e74694] bg-pink-50/60'
                            : 'border-pink-200 hover:border-[#e74694]/40 hover:bg-pink-50/30'
                        }`}
                      >
                        <span
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            active ? 'bg-[#e74694] text-white' : 'bg-pink-100 text-[#e74694]'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-gray-900">
                            {label}
                          </span>
                          <span className="block text-xs text-gray-500 mt-0.5">{desc}</span>
                        </span>
                        <span
                          className={`w-5 h-5 rounded-full border-[5px] shrink-0 ${
                            active ? 'border-[#e74694] bg-white' : 'border-gray-300 bg-white'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-xs text-amber-800">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Simulasi pembayaran untuk project portofolio - tidak ada transaksi
                    sungguhan yang diproses.
                  </span>
                </p>
              </section>
            </div>


            {/* ============ KOLOM KANAN: RINGKASAN (STICKY) ============ */}
            <div className="lg:col-span-2 lg:sticky lg:top-24 space-y-5">
              <section
                id="checkout-summary"
                className="bg-white rounded-3xl border-2 border-pink-500/10 p-5 sm:p-6 scroll-mt-24"
              >
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Ringkasan Pesanan
                </h2>

                <ul className="mt-4 space-y-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={item.image}
                          alt=""
                          aria-hidden="true"
                          className="w-16 h-16 rounded-xl object-cover border border-pink-100"
                        />
                        <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-[#e74694] text-white text-[11px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 leading-snug">
                          {item.name}
                        </p>
                        {item.lines?.length ? (
                          <ul className="mt-1.5 space-y-0.5">
                            {item.lines.map((line) => (
                              <li
                                key={line.label}
                                className="flex justify-between gap-2 text-xs text-gray-500"
                              >
                                <span className="min-w-0 truncate">{line.label}</span>
                                <span className="shrink-0">{formatRupiahSpaced(line.amount)}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">Produk siap kirim</p>
                        )}
                        {item.note && (
                          <p className="mt-1.5 text-xs text-gray-500 italic">
                            Catatan: {item.note}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>


                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2 text-sm">
                  <div className="flex items-start justify-between gap-3 text-gray-600">
                    <span className="shrink-0">Jadwal</span>
                    <span className="font-semibold text-gray-900 text-right">
                      {formatTanggal(date)}
                      {date ? `, ${time}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      {formatRupiahSpaced(totalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Ongkos kirim</span>
                    <span
                      className={
                        deliveryCost === 0
                          ? 'font-semibold text-emerald-600'
                          : 'font-semibold text-gray-900'
                      }
                    >
                      {deliveryCost === 0 ? 'Gratis' : formatRupiahSpaced(deliveryCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-base font-extrabold text-gray-900">Total</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#e74694]">
                      {formatRupiahSpaced(grandTotal)}
                    </span>
                  </div>
                </div>

                {note.trim() && (
                  <p className="mt-4 rounded-xl bg-pink-50/70 px-3.5 py-2.5 text-xs text-gray-600 leading-relaxed">
                    <span className="font-bold text-gray-800">Catatan Anda: </span>
                    {note.trim()}
                  </p>
                )}
              </section>

              {/* ---------- Tombol utama ---------- */}
              <section className="bg-white rounded-3xl border-2 border-pink-500/10 p-5 sm:p-6 space-y-2.5">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#e74694] hover:bg-[#db2777] text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-pink-200 active:scale-[0.99] cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  Konfirmasi Pesanan
                </button>
                <button
                  type="button"
                  onClick={goBack}
                  className="w-full py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Kembali
                </button>
                <p className="pt-1 text-center text-xs text-gray-400">
                  Menampilkan instruksi pembayaran, tanpa transaksi sungguhan.
                </p>
              </section>
            </div>
          </form>
        </div>
      </section>

      {/* ---------- Modal pembayaran & konfirmasi ---------- */}
      <PaymentModal
        open={isPaymentOpen}
        method={paymentMethod}
        total={grandTotal}
        orderNumber={orderNumber}
        customerName={name.trim()}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={handlePaymentConfirmed}
      />

      <SuccessModal
        open={isSuccessOpen}
        orderNumber={orderNumber}
        total={grandTotal}
        customerName={name.trim()}
        onViewOrder={handleViewOrder}
        onGoHome={() => {
          setIsSuccessOpen(false);
          navigate('/');
        }}
      />
    </div>
  );
};

