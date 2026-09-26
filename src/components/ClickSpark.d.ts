import type { MouseEventHandler, ReactNode } from 'react';

/** Kurva easing yang didukung oleh ClickSpark. */
export type ClickSparkEasing = 'linear' | 'ease-in' | 'ease-in-out' | 'ease-out';

export interface ClickSparkProps {
  /** Warna garis percikan (hex/CSS color). Default: '#fff' */
  sparkColor?: string;
  /** Panjang garis percikan. Default: 10 */
  sparkSize?: number;
  /** Jangkauan percikan dari titik klik. Default: 15 */
  sparkRadius?: number;
  /** Jumlah garis percikan per klik. Default: 8 */
  sparkCount?: number;
  /** Durasi animasi dalam milidetik. Default: 400 */
  duration?: number;
  /** Fungsi easing animasi. Default: 'ease-out' */
  easing?: ClickSparkEasing;
  /** Skala tambahan untuk jangkauan. Default: 1.0 */
  extraScale?: number;
  /** Konten yang dibungkus (seluruh isi aplikasi). */
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

/**
 * Efek percikan garis kecil pada titik klik.
 * Implementasi JS-nya ada di `ClickSpark.jsx`; file ini hanya menyediakan
 * tipe agar `tsc` (yang jalan sebelum `vite build`) bisa memverifikasinya.
 */
declare function ClickSpark(props: ClickSparkProps): ReactNode;

export default ClickSpark;