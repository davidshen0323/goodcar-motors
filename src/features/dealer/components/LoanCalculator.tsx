import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
import { estimateLoan } from '../domain/loan';
import { money } from '../../../shared/lib/format';
import Feedback from '../../../shared/components/Feedback';
export default function LoanCalculator() {
  const { t, locale } = useI18n();
  const [form, setForm] = useState({
    price: 188,
    downPayment: 60,
    months: 60,
    annualRate: 3,
  });
  const [result, setResult] = useState<ReturnType<typeof estimateLoan> | null>(
    null,
  );
  const [error, setError] = useState('');
  const update = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  return (
    <section className="portfolio-extra loan-section">
      <div>
        <span className="kicker">PLAN YOUR BUDGET</span>
        <h2>{t('先估算每月負擔。')}</h2>
        <p>
          {t(
            '依等額本息公式計算。結果不含手續費、保險或其他費用，不是正式貸款報價。',
          )}
        </p>
      </div>
      <form
        className="loan-form"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            setResult(estimateLoan(form));
            setError('');
          } catch (error) {
            setResult(null);
            setError(error instanceof Error ? error.message : String(error));
          }
        }}
      >
        {(
          [
            ['price', '車價（萬元）', 1, 2000],
            ['downPayment', '自備款（萬元）', 0, 2000],
            ['annualRate', '年利率（%）', 0, 30],
          ] as const
        ).map(([key, label, min, max]) => (
          <label key={key}>
            {t(label)}
            <input
              name={key}
              type="number"
              min={min}
              max={max}
              step="0.1"
              required
              value={form[key]}
              onChange={update}
            />
          </label>
        ))}
        <label>
          {t('期數')}
          <select name="months" value={form.months} onChange={update}>
            {([36, 48, 60] as const).map((n) => (
              <option key={n} value={n}>
                {t(`${n} 期`)}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">{t('計算參考月付')}</button>
        <Feedback message={error} error />
        {result && (
          <p role="status">
            {t('參考月付')} {money(result.monthly, locale)}
            <br />
            {t('貸款本金')} {money(result.principal, locale)}
            <br />
            {t('估算利息總額')} {money(result.interest, locale)}
          </p>
        )}
      </form>
    </section>
  );
}
