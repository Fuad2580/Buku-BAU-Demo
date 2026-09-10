/**
 * Utility formatters for Indonesian number & currency presentation.
 * Separator ribuan: Titik (.) e.g. 1199 -> "1.199"
 */

/**
 * Format an integer or numeric string into Indonesian thousands separator notation.
 * e.g., 1199 -> "1.199", 2800 -> "2.800", 50000 -> "50.000", 399 -> "399"
 */
export const formatNumber = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'number' ? val : Number(String(val).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return String(val);
  return num.toLocaleString('id-ID');
};

/**
 * Format price in Ribuan with thousands separator and "RB" suffix.
 * e.g., 1199 -> "1.199 RB"
 */
export const formatPriceRb = (val: number | string | undefined | null): string => {
  return `${formatNumber(val)} RB`;
};

/**
 * Format full Indonesian Rupiah currency.
 * e.g., 50000 -> "Rp 50.000"
 */
export const formatRupiah = (val: number | string | undefined | null): string => {
  return `Rp ${formatNumber(val)}`;
};
