/** Normalize to 10-digit Indian mobile (storage) or E.164 for SMS (+91...) */
export function normalizeIndianPhone(phone) {
  let digits = String(phone).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length !== 10) return null;
  if (!/^[6-9]\d{9}$/.test(digits)) return null;
  return digits;
}

export function toE164Indian(phone10) {
  return `+91${phone10}`;
}
