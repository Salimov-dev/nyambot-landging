import {
  isForeignPhone,
  normalizePhone,
  ruSubscriberDigits,
} from "@/shared/phone-rules/phone-rules.shared";

/**
 * Маска телефона по мере ввода — как в СРМ (`crm-nyambot/src/utils/phone/
 * phone.utils.ts`): «+7 (900) 123-45-67». Правило «что считать одним и тем же
 * номером» — в общем модуле `phone-rules`, здесь только вид показа.
 *
 * Нероссийский номер не калечим: `+380…` остаётся как есть.
 */
export const formatRussianPhone = (value: string): string => {
  if (isForeignPhone(value)) return normalizePhone(value);

  const d = ruSubscriberDigits(value);

  if (d.length === 0) return "+7";
  if (d.length <= 3) return `+7 (${d}`;
  if (d.length <= 6) return `+7 (${d.slice(0, 3)}) ${d.slice(3)}`;
  if (d.length <= 8)
    return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
};

/** Длина «+7 (900) 123-45-67» — дальше маска не растёт. */
export const RU_PHONE_MASK_LENGTH = 18;

/**
 * Значение поля телефона после ввода: пусто и «одна семёрка/восьмёрка» —
 * пусто (человек стёр номер), иначе — маска. Как `PhoneInput` в СРМ.
 */
export const maskPhoneInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length === 1 && (digits === "7" || digits === "8")) return "";
  const formatted = formatRussianPhone(raw);
  return formatted === "+7" ? "" : formatted;
};
