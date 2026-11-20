/**
 * Normalizes Pakistani mobile numbers into standard international format without leading plus or spaces.
 * Example target: 923001234567
 * 
 * Supports input variants:
 * - 03001234567 -> 923001234567
 * - +923001234567 -> 923001234567
 * - 92-300-1234567 -> 923001234567
 * - 0300 1234567 -> 923001234567
 */
export function normalizePakistaniPhone(raw: string): {
  isValid: boolean;
  normalized: string;
  formattedDisplay: string;
  error?: string;
} {
  if (!raw || typeof raw !== 'string') {
    return { isValid: false, normalized: '', formattedDisplay: '', error: 'Phone number is required' };
  }

  // Remove whitespace, dashes, brackets, plus signs
  const cleaned = raw.replace(/[\s\-\(\)\+]/g, '');

  let normalized = '';

  if (/^03[0-9]{9}$/.test(cleaned)) {
    // 03001234567 -> 923001234567
    normalized = '92' + cleaned.substring(1);
  } else if (/^923[0-9]{9}$/.test(cleaned)) {
    // 923001234567
    normalized = cleaned;
  } else if (/^3[0-9]{9}$/.test(cleaned)) {
    // 3001234567 -> 923001234567
    normalized = '92' + cleaned;
  } else {
    return {
      isValid: false,
      normalized: cleaned,
      formattedDisplay: raw,
      error: 'Invalid Pakistani mobile number format. Expected 03XX XXXXXXX or +92 3XX XXXXXXX'
    };
  }

  // Format for display: +92 300 1234567
  const display = `+92 ${normalized.substring(2, 5)} ${normalized.substring(5)}`;

  return {
    isValid: true,
    normalized,
    formattedDisplay: display
  };
}
