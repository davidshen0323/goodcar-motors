import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/I18nProvider';
export function SellCarForm() {
  const { t, locale } = useI18n();
  const [form, setForm] = useState({
    model: '',
    year: '',
    mileage: '',
    notes: '',
  });
  const [preview, setPreview] = useState(false);
  const update = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <section
      className="sell grid grid-cols-2 gap-[9vw] max-[760px]:grid-cols-1 max-[760px]:gap-[30px]"
      id="sell"
    >
      <div>
        <span className="kicker">SELL YOUR CAR / 04</span>
        <h2>{t('想出售你的車？')}</h2>
        <p>
          {t(
            '提供車輛基本資訊，先整理一份估價需求摘要。正式網站可再串接車商的 CRM 或聯絡管道。',
          )}
        </p>
        <p className="note">
          {t('此表單僅供預覽需求，不提供估價或資料傳送。')}
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPreview(true);
        }}
      >
        <label>
          {t('車款或車型')}
          <input
            required
            name="model"
            value={form.model}
            onChange={update}
            maxLength={80}
          />
        </label>
        <div className="sell-two">
          <label>
            {t('出廠年份')}
            <input
              required
              name="year"
              type="number"
              min="1980"
              max={new Date().getFullYear()}
              value={form.year}
              onChange={update}
            />
          </label>
          <label>
            {t('目前里程（公里）')}
            <input
              required
              name="mileage"
              type="number"
              min="0"
              max="1000000"
              value={form.mileage}
              onChange={update}
            />
          </label>
        </div>
        <label>
          {t('車況補充')}
          <textarea
            name="notes"
            value={form.notes}
            onChange={update}
            maxLength={500}
            rows={3}
          />
        </label>
        <button type="submit">{t('預覽售車需求 ↗')}</button>
        {preview && (
          <pre className="request-preview" role="status">
            {[
              t('售車需求預覽（未送出）'),
              form.model,
              form.year,
              Number(form.mileage).toLocaleString(locale) + ' km',
              form.notes,
              t('網站不提供估價，資料也不會傳送給車商。'),
            ].join('\n')}
          </pre>
        )}
      </form>
    </section>
  );
}
