export const money = (amount: number, locale = 'zh-TW') =>
  `NT$ ${Number(amount).toLocaleString(locale)}`;
export function formatDate(
  value: string | number,
  locale = 'zh-TW',
  options = {},
) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString(locale, options);
}
export function toLocalDateTime(date: string | number | Date) {
  const value = new Date(date);
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
  return value.toISOString().slice(0, 16);
}
