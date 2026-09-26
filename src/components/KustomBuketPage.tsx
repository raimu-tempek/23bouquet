import React, { useMemo, useState } from 'react';
import {
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Info,
  MessageCircle,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { BouquetPreview } from './BouquetPreview';
import { useCart, type CartItem, type CartItemLine } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import {
  ADDON_OPTIONS,
  BASE_FEE,
  DELIVERY_FEE,
  FLOWER_OPTIONS,
  MAX_FLOWERS,
  WRAPPING_OPTIONS,
  buildBouquetLayout,
  formatRupiahSpaced,
  type FlowerSelection,
} from '../data/bouquet-options';
import { DOT, TIMES } from '../data/site';

const WRAPPING_PLACEHOLDER = WRAPPING_OPTIONS[0];

/**
 * Halaman Kustom Buket (/kustom-buket).
 *
 * Alur interaksi:
 * - Klik kartu bunga di "Pilih Jenis Bunga" untuk menambah 1 tangkai.
 * - Klik tombol (-) atau klik kanan (right-click) kartu untuk mengurangi.
 * - Batas keras TOTAL {MAX_FLOWERS} tangkai gabungan semua jenis bunga. Saat
 *   batas tercapai tombol tambah dinonaktifkan & muncul badge "Maksimal
 *   tercapai", tapi semua interaksi lain tetap jalan (kurangi bunga, ganti
 *   wrapping, pilih add-on, tulis catatan).
 * - Preview, Ringkasan Buket, Detail Pesanan, dan Total semuanya diturunkan
 *   dari state yang sama sehingga selalu sinkron secara real-time.
 * - Tombol "Hapus Semua" mengembalikan seluruh state di atas ke kondisi awal.
 * - "Tambah ke Keranjang" menitipkan rincian biaya ke CartContext lalu
 *   mengarahkan user ke /checkout.
 */
export const KustomBuketPage: React.FC = () => {
  const [selections, setSelections] = useState<FlowerSelection[]>([]);
  const [wrappingId, setWrappingId] = useState<string>(WRAPPING_PLACEHOLDER.id);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [isDelivery, setIsDelivery] = useState(true);

  const { addToCart, buyNow } = useCart();
  const { navigate } = useRouter();

  const activeWrapping =
    WRAPPING_OPTIONS.find((w) => w.id === wrappingId) ?? WRAPPING_PLACEHOLDER;

  const totalStems = useMemo(
    () => selections.reduce((sum, s) => sum + s.count, 0),
    [selections]
  );
  const atLimit = totalStems >= MAX_FLOWERS;

  /** Posisi kipas dihitung ulang tiap pilihan bunga / wrapping berubah. */
  const stems = useMemo(
    () => buildBouquetLayout(selections, activeWrapping.anchor),
    [selections, activeWrapping]
  );

  const flowersSubtotal = useMemo(
    () =>
      selections.reduce((sum, s) => {
        const flower = FLOWER_OPTIONS.find((f) => f.id === s.id);
        return flower ? sum + flower.price * s.count : sum;
      }, 0),
    [selections]
  );

  const addOnsSubtotal = useMemo(
    () =>
      addOnIds.reduce((sum, id) => {
        const addOn = ADDON_OPTIONS.find((a) => a.id === id);
        return addOn ? sum + addOn.price : sum;
      }, 0),
    [addOnIds]
  );

  const deliveryCost = isDelivery ? DELIVERY_FEE : 0;
  const total = BASE_FEE + flowersSubtotal + activeWrapping.price + addOnsSubtotal + deliveryCost;

  const countOf = (id: string) => selections.find((s) => s.id === id)?.count ?? 0;

  /**
   * True kalau ada sesuatu yang bisa dikosongkan. Dipakai untuk menonaktifkan
   * tombol "Hapus Semua" saat halaman baru dibuka.
   */
  const hasAnythingToClear =
    totalStems > 0 || addOnIds.length > 0 || note.trim().length > 0 || wrappingId !== WRAPPING_PLACEHOLDER.id;

  /** Kembalikan seluruh halaman ke kondisi awal (semua pilihan dibuang). */
  const handleReset = () => {
    if (!hasAnythingToClear) return;
    const confirmed = window.confirm(
      'Hapus semua pilihan?\n\n' +
        'Semua bunga, tambahan, dan catatan akan dikosongkan. Tindakan ini tidak bisa dibatalkan.'
    );
    if (!confirmed) return;
    setSelections([]);
    setWrappingId(WRAPPING_PLACEHOLDER.id);
    setAddOnIds([]);
    setNote('');
    setIsDelivery(true);
  };

  const addFlower = (id: string) => {
    if (atLimit) return;
    setSelections((prev) => {
      const existing = prev.find((s) => s.id === id);
      if (existing) {
        return prev.map((s) => (s.id === id ? { ...s, count: s.count + 1 } : s));
      }
      return [...prev, { id, count: 1 }];
    });
  };

  const removeFlower = (id: string) => {
    setSelections((prev) =>
      prev
        .map((s) => (s.id === id ? { ...s, count: s.count - 1 } : s))
        .filter((s) => s.count > 0)
    );
  };

  const toggleAddOn = (id: string) => {
    setAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /**
   * Rincian biaya yang sama persis untuk "Tambah ke Keranjang" maupun
   * "Bayar Sekarang", supaya dua tombol itu tidak pernah menghasilkan data
   * yang berbeda.
   */
  const buildCartItem = (): Omit<CartItem, 'quantity'> => {
    const lines: CartItemLine[] = [
      { label: 'Biaya rangkai & kemasan', amount: BASE_FEE },
      { label: `Bunga (${totalStems} tangkai)`, amount: flowersSubtotal },
      { label: `Wrapping ${DOT} ${activeWrapping.name}`, amount: activeWrapping.price },
    ];
    for (const addOnId of addOnIds) {
      const addOn = ADDON_OPTIONS.find((a) => a.id === addOnId);
      if (addOn) lines.push({ label: addOn.name, amount: addOn.price });
    }

    return {
      id: `kustom-buket-${Date.now()}`,
      name: `Buket Kustom ${DOT} ${activeWrapping.name} ${DOT} ${totalStems} bunga`,
      // Ongkir sengaja TIDAK ikut dihitung di sini: metode kirim/ambil baru
      // dipilih di halaman checkout, jadi ongkir ditambahkan satu kali di sana.
      price: total - deliveryCost,
      image: activeWrapping.image,
      lines,
      note: note.trim() || undefined,
    };
  };

  const handleAddToCart = () => {
    if (totalStems === 0) return;
    addToCart(buildCartItem());
    navigate('/checkout');
  };

  /**
   * "Bayar Sekarang": langsung beli tanpa melewati keranjang. Kalau keranjang
   * sudah berisi produk lain, produk itu ikut dibawa agar ringkasan di
   * checkout tetap akurat.
   */
  const handleBuyNow = () => {
    if (totalStems === 0) return;
    buyNow(buildCartItem());
  };

  return (
    <div className="bg-[#fffbfe] min-h-screen">
      {/* ================= HEADER ================= */}
      <section className="pt-24 sm:pt-28 pb-8 sm:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 text-[#e74694] mb-3">
            <Sparkles className="w-4 h-4 fill-current" />
            <span className="text-xs font-bold uppercase tracking-wider">KUSTOM BUKET</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#e74694] tracking-tight">
            Rancang Buketmu Sendiri
          </h1>
          <p className="text-gray-500 text-sm sm:text-base lg:text-lg leading-relaxed mt-2.5 max-w-2xl">
            Pilih bunga, atur jumlahnya, lalu tentukan wrapping. Preview di samping
            berubah otomatis mengikuti setiap pilihanmu.
          </p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ============ KIRI: PREVIEW REAL-TIME (sticky) ============ */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 w-full">
              <BouquetPreview
                stems={stems}
                wrappingImage={activeWrapping.image}
                wrappingName={activeWrapping.name}
                totalStems={totalStems}
              />

              <div className="mt-5 bg-white rounded-2xl border-2 border-pink-500/10 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-gray-700">Total Sementara</span>
                  <span className="text-2xl font-extrabold text-[#e74694]">
                    {formatRupiahSpaced(total)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  Sudah termasuk biaya rangkai, {activeWrapping.name.toLowerCase()},{' '}
                  {totalStems} tangkai bunga
                  {addOnIds.length > 0 ? ', dan tambahan' : ''}
                  {isDelivery ? ', plus ongkos kirim' : ''}.
                </p>
              </div>

              {atLimit && (
                <p className="mt-3 flex items-start gap-2 text-xs font-medium text-[#e74694] bg-pink-50 border border-pink-200 rounded-xl px-3.5 py-2.5">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Sudah mencapai batas {MAX_FLOWERS} tangkai. Kurangi salah satu bunga
                    dulu kalau ingin menggantinya.
                  </span>
                </p>
              )}
            </div>

            {/* ============ KANAN: SEMUA SECTION PILIHAN ============ */}
            <div className="lg:col-span-7 w-full space-y-8 sm:space-y-10">
              {/* ---------- 1. PILIH JENIS BUNGA ---------- */}
              <section>
                <div className="flex items-end justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                      Pilih Jenis Bunga
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Klik kartu untuk menambah. Klik kanan atau tombol (&minus;) untuk
                      mengurangi.
                    </p>
                  </div>
                  <span className="shrink-0 px-3 py-1.5 bg-pink-50 text-[#e74694] border border-pink-200 rounded-full text-xs font-bold whitespace-nowrap">
                    Max: {MAX_FLOWERS}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {FLOWER_OPTIONS.map((flower) => {
                    const count = countOf(flower.id);
                    const isSelected = count > 0;
                    const blocked = atLimit && !isSelected;
                    return (
                      <div key={flower.id} className="relative pb-1">
                        <button
                          type="button"
                          onClick={() => addFlower(flower.id)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            removeFlower(flower.id);
                          }}
                          aria-disabled={blocked}
                          aria-label={`Tambah ${flower.name} ke buket`}
                          className={`w-full bg-white rounded-2xl border-2 p-3 text-left transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? 'border-[#e74694] shadow-md shadow-pink-200/60'
                              : 'border-pink-500/10 hover:border-[#e74694]/40 hover:shadow-sm'
                          } ${blocked ? 'opacity-45 cursor-not-allowed' : ''}`}
                        >
                          <div className="relative w-full aspect-square rounded-xl bg-pink-50/40 overflow-hidden mb-2.5">
                            <img
                              src={flower.image}
                              alt={flower.name}
                              loading="lazy"
                              draggable={false}
                              className="w-full h-full object-contain p-1.5 select-none"
                            />
                            {isSelected && (
                              <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#e74694] text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                                {count}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 leading-tight">
                            {flower.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatRupiahSpaced(flower.price)} / tangkai
                          </p>
                        </button>

                        {/* Kontrol +/- berada di luar <button> kartu utama agar
                            tidak ikut memicu event "tambah" lagi. */}
                        {isSelected && (
                          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-white border border-pink-200 rounded-full shadow-md px-1 py-0.5 z-10">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFlower(flower.id);
                              }}
                              aria-label={`Kurangi ${flower.name}`}
                              className="w-6 h-6 rounded-full text-[#e74694] hover:bg-pink-50 flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold text-gray-800 min-w-[1.25rem] text-center">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                addFlower(flower.id);
                              }}
                              disabled={atLimit}
                              aria-label={`Tambah ${flower.name}`}
                              className="w-6 h-6 rounded-full text-[#e74694] hover:bg-pink-50 flex items-center justify-center cursor-pointer transition-colors disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ---------- 2. PILIH TAMPILAN BUKET ---------- */}
              <section>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                  Pilih Tampilan Buket
                </h2>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                  Wrapping jadi base layer di preview, jadi perubahannya langsung
                  keliatan.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {WRAPPING_OPTIONS.map((wrapping) => {
                    const isActive = wrapping.id === activeWrapping.id;
                    return (
                      <button
                        key={wrapping.id}
                        type="button"
                        onClick={() => setWrappingId(wrapping.id)}
                        aria-pressed={isActive}
                        className={`bg-white rounded-2xl border-2 p-3 text-left transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'border-[#e74694] shadow-md shadow-pink-200/60'
                            : 'border-pink-500/10 hover:border-[#e74694]/40 hover:shadow-sm'
                        }`}
                      >
                        <div className="relative w-full aspect-square rounded-xl bg-pink-50/40 overflow-hidden mb-2.5">
                          <img
                            src={wrapping.image}
                            alt={wrapping.name}
                            loading="lazy"
                            draggable={false}
                            className="w-full h-full object-contain p-1.5 select-none"
                          />
                          {isActive && (
                            <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#e74694] text-white flex items-center justify-center shadow-sm">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                          {wrapping.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {wrapping.tagline} {DOT} {formatRupiahSpaced(wrapping.price)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* ---------- 3. BIAYA TAMBAHAN ---------- */}
              <section>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                  Biaya Tambahan
                </h2>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                  Opsional, bebas dikombinasikan.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {ADDON_OPTIONS.map((addOn) => {
                    const isActive = addOnIds.includes(addOn.id);
                    return (
                      <button
                        key={addOn.id}
                        type="button"
                        onClick={() => toggleAddOn(addOn.id)}
                        aria-pressed={isActive}
                        className={`bg-white rounded-2xl border-2 p-3 text-left transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'border-[#e74694] shadow-md shadow-pink-200/60'
                            : 'border-pink-500/10 hover:border-[#e74694]/40 hover:shadow-sm'
                        }`}
                      >
                        <div className="relative w-full aspect-square rounded-xl bg-pink-50/40 overflow-hidden mb-2.5">
                          <img
                            src={addOn.image}
                            alt={addOn.name}
                            loading="lazy"
                            draggable={false}
                            className="w-full h-full object-contain p-1.5 select-none"
                          />
                          {isActive && (
                            <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#e74694] text-white flex items-center justify-center shadow-sm">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                          {addOn.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatRupiahSpaced(addOn.price)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* ---------- 4. RINGKASAN BUKET + DETAIL PESANAN ---------- */}
              <section className="bg-white rounded-3xl border-2 border-pink-500/10 overflow-hidden">
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                      Ringkasan Buket
                    </h2>
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={!hasAnythingToClear}
                      title={
                        hasAnythingToClear
                          ? 'Kosongkan semua pilihan bunga, wrapping, tambahan, dan catatan'
                          : 'Tidak ada pilihan untuk dihapus'
                      }
                      className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 text-xs font-bold transition-all ${
                        hasAnythingToClear
                          ? 'border-[#e74694] text-[#e74694] hover:bg-pink-50 active:scale-95 cursor-pointer'
                          : 'border-gray-200 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus Semua
                    </button>
                  </div>

                  {totalStems === 0 ? (
                    <p className="mt-3 text-sm text-gray-500">
                      Belum ada bunga dipilih. Pilih minimal 1 tangkai untuk membuat
                      buket.
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-2.5">
                      {selections.map((selection) => {
                        const flower = FLOWER_OPTIONS.find((f) => f.id === selection.id);
                        if (!flower) return null;
                        return (
                          <li
                            key={selection.id}
                            className="flex items-center gap-3 bg-pink-50/50 rounded-xl px-3 py-2.5"
                          >
                            <img
                              src={flower.image}
                              alt=""
                              aria-hidden="true"
                              draggable={false}
                              className="w-9 h-9 object-contain shrink-0 select-none"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-gray-900 truncate">
                                {flower.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {selection.count} tangkai {TIMES}{' '}
                                {formatRupiahSpaced(flower.price)}
                              </p>
                            </div>
                            <span className="text-sm font-bold text-gray-900 shrink-0">
                              {formatRupiahSpaced(flower.price * selection.count)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* ---------- DETAIL PESANAN ---------- */}
                <div className="border-t border-pink-100 p-5 sm:p-6 space-y-2.5">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Detail Pesanan
                  </h3>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Biaya rangkai &amp; kemasan</span>
                    <span className="font-semibold text-gray-900">
                      {formatRupiahSpaced(BASE_FEE)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Bunga ({totalStems} tangkai)</span>
                    <span className="font-semibold text-gray-900">
                      {formatRupiahSpaced(flowersSubtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Wrapping {DOT} {activeWrapping.name}</span>
                    <span className="font-semibold text-gray-900">
                      {formatRupiahSpaced(activeWrapping.price)}
                    </span>
                  </div>
                  {addOnIds.length > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Biaya tambahan</span>
                      <span className="font-semibold text-gray-900">
                        {formatRupiahSpaced(addOnsSubtotal)}
                      </span>
                    </div>
                  )}

                  {/* Pilihan pengiriman */}
                  <div className="pt-1">
                    <p className="text-sm text-gray-600 mb-2">Pengiriman</p>
                    <div className="inline-flex items-center gap-1.5 bg-pink-100/70 p-1.5 rounded-full border border-pink-200/60">
                      <button
                        type="button"
                        onClick={() => setIsDelivery(true)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isDelivery
                            ? 'bg-[#e74694] text-white shadow-sm'
                            : 'text-gray-600 hover:text-[#e74694] hover:bg-white/60'
                        }`}
                      >
                        Kirim {DOT} {formatRupiahSpaced(DELIVERY_FEE)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDelivery(false)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          !isDelivery
                            ? 'bg-[#e74694] text-white shadow-sm'
                            : 'text-gray-600 hover:text-[#e74694] hover:bg-white/60'
                        }`}
                      >
                        Ambil di toko {DOT} Gratis
                      </button>
                    </div>
                  </div>

                  {/* Catatan */}
                  <div className="pt-1">
                    <label htmlFor="catatan" className="text-sm text-gray-600 mb-2 block">
                      Catatan untuk florist
                    </label>
                    <textarea
                      id="catatan"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      maxLength={200}
                      placeholder="Contoh: warna dominan merah, tambahkan pita cokelat..."
                      className="w-full rounded-xl border border-pink-200 bg-pink-50/40 px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#e74694] focus:bg-white transition-colors resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {note.length}/200
                    </p>
                  </div>
                </div>

                {/* ---------- TOTAL + TOMBOL ---------- */}
                <div className="bg-pink-50/60 border-t border-pink-100 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-base font-extrabold text-gray-900">Total</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#e74694]">
                      {formatRupiahSpaced(total)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={totalStems === 0}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all active:scale-95 cursor-pointer ${
                        totalStems === 0
                          ? 'bg-gray-300 text-gray-500 shadow-none cursor-not-allowed'
                          : 'bg-[#e74694] hover:bg-[#db2777] text-white shadow-lg shadow-pink-200'
                      }`}
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Tambah ke Keranjang
                    </button>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={totalStems === 0}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 font-bold text-sm sm:text-base transition-all active:scale-95 cursor-pointer ${
                        totalStems === 0
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-[#e74694] text-[#e74694] hover:bg-pink-50'
                      }`}
                    >
                      <MessageCircle className="w-5 h-5" />
                      Bayar Sekarang
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
