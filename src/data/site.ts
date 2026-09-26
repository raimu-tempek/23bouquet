/*
 * Konstanta bersama antar halaman.
 *
 * Karakter di sini sengaja ditulis sebagai escape ASCII, bukan byte UTF-8
 * langsung. File pernah tersimpan dengan middle-dot (U+00B7) ter-encode ganda
 * sehingga tampil sebagai "A-circumflex + middle-dot" di browser; escape
 * \uXXXX bebas dari masalah itu karena isinya murni ASCII.
 */

/** Separator titik tengah, mis. "Wrapping . Buket Hitam". */
export const DOT = '\u00b7';

/** Tanda kali, mis. "3 tangkai . Rp 15.000". */
export const TIMES = '\u00d7';