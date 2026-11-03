export function estimateLoan({
  price,
  downPayment,
  months,
  annualRate,
}: {
  price: number;
  downPayment: number;
  months: number;
  annualRate: number;
}) {
  if (
    ![price, downPayment, months, annualRate].every(Number.isFinite) ||
    price <= 0 ||
    downPayment < 0 ||
    annualRate < 0 ||
    annualRate > 30 ||
    ![36, 48, 60].includes(months)
  )
    throw new Error('請填寫有效的試算條件。');
  if (downPayment > price) throw new Error('自備款不能高於車價，請調整。');
  const principal = (price - downPayment) * 10000;
  const rate = annualRate / 1200;
  const monthly = rate
    ? (principal * rate) / (1 - (1 + rate) ** -months)
    : principal / months;
  return {
    principal,
    monthly: Math.round(monthly),
    interest: Math.round(monthly * months - principal),
  };
}
