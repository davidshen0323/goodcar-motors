import type { Vehicle } from '../../models';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useI18n } from '../../shared/i18n/I18nProvider';
import LanguageSwitcher from '../../shared/components/LanguageSwitcher';
import Modal from '../../shared/components/Modal';
import Feedback from '../../shared/components/Feedback';
import LoanCalculator from './components/LoanCalculator';
import { SellCarForm } from './components/InquiryForms';
import { useDealer, statusLabels } from './useDealer';
import { filterVehicles, toggleComparison } from './domain/inventory';
import Admin from './Admin';
import { money } from '../../shared/lib/format';
export function VehicleImage({
  car,
  className = '',
}: {
  car: Vehicle;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <img
      className={'vehicle-image ' + className}
      src={'/vehicles/' + car.photo + '.png'}
      alt={t(car.name)}
      loading="lazy"
      width="1536"
      height="1024"
    />
  );
}
export default function DealerPage() {
  const { t, locale, language } = useI18n();
  const { pathname } = useLocation();
  const dealer = useDealer();
  const [filters, setFilters] = useState({
    query: '',
    body: 'all',
    price: 'all',
    sort: 'featured',
    savedOnly: false,
  });
  const [detail, setDetail] = useState<string | null>(null),
    [compare, setCompare] = useState<string[]>([]),
    [notice, setNotice] = useState(''),
    [inquiryId, setInquiryId] = useState('');
  const [form, setForm] = useState({ name: '', contact: '', message: '' }),
    [submitted, setSubmitted] = useState(false),
    [formError, setFormError] = useState('');
  useEffect(() => {
    document.title = t('好車選品｜外匯車選品');
  }, [t]);
  const filtered = useMemo(
    () =>
      filterVehicles(dealer.cars, { ...filters, favorites: dealer.favorites }),
    [dealer.cars, dealer.favorites, filters],
  );
  const selected = dealer.cars.filter((c) => compare.includes(c.id));
  const setFilter = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K],
  ) => setFilters((f) => ({ ...f, [key]: value }));
  const goInquiry = (car: Vehicle) => {
    setInquiryId(car.id);
    setDetail(null);
    setSubmitted(false);
    setFormError('');
  };
  if (pathname === '/admin.html')
    return (
      <>
        <LanguageSwitcher />
        <Admin dealer={dealer} />
      </>
    );
  return (
    <>
      <LanguageSwitcher />
      <div className="site-strip">
        <span>INDEPENDENT AUTOMOTIVE COLLECTION</span>
        <Link to={'/admin.html?lang=' + language}>{t('車源管理')} ↗</Link>
      </div>
      <header>
        <a className="wordmark" href="#top">
          {t('好車選品')}<span>{t('外匯車選品')}</span>
        </a>
        <nav>
          <a href="#inventory">{t('精選車源')}</a>
          <a href="#compare">{t('車輛比較')}</a>
          <a href="#process">{t('購車流程')}</a>
        </nav>
        <a className="outline-button" href="#inquiry">
          {t('預約諮詢')} ↗
        </a>
      </header>
      <main id="top">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">CURATED IMPORTS / TAIPEI</span>
            <h1>
              {t('下一段旅程，')}
              <br />
              {t('從喜歡開始。')}
            </h1>
            <p>{t('有些車，是交通工具。有些車，讓你期待每一次出發。')}</p>
            <a className="primary" href="#inventory">
              {t('探索精選車源')} <span>↗</span>
            </a>
          </div>
          <div className="hero-bottom">
            <span>THE ART OF SELECTING YOUR NEXT DRIVE</span>
            <span>01 / THE COLLECTION</span>
          </div>
        </section>
        <section className="collection" id="inventory">
          <div className="section-heading mb-[35px] flex items-end justify-between gap-[35px] max-[760px]:block">
            <div>
              <span className="eyebrow">THE COLLECTION / 01</span>
              <h2>{t('值得停下來看的選擇。')}</h2>
            </div>
            <p>{t('精選示意車源，讓選車從清楚的資訊開始。')}</p>
          </div>
          <div className="filters flex items-end gap-[14px] max-[1050px]:flex-wrap max-[760px]:gap-3">
            <label className="search">
              {t('搜尋車源')}
              <input
                value={filters.query}
                onChange={(e) => setFilter('query', e.target.value)}
                placeholder={t('搜尋名稱、年份或編號')}
              />
            </label>
            <label>
              {t('車型')}
              <select
                value={filters.body}
                onChange={(e) => setFilter('body', e.target.value)}
              >
                {(['all', '房車', '休旅', '雙門'] as const).map((v) => (
                  <option key={v} value={v}>
                    {t(v === 'all' ? '全部車型' : v)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('預算')}
              <select
                value={filters.price}
                onChange={(e) => setFilter('price', e.target.value)}
              >
                <option value="all">{t('不限預算')}</option>
                {([200, 250, 300] as const).map((n) => (
                  <option key={n} value={n}>
                    {language === 'en'
                      ? `${money(n * 10000, locale)} or less`
                      : `${n} 萬以下`}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t('排序')}
              <select
                value={filters.sort}
                onChange={(e) => setFilter('sort', e.target.value)}
              >
                {(
                  [
                    ['featured', '精選排序'],
                    ['low', '價格由低到高'],
                    ['high', '價格由高到低'],
                    ['newest', '年份由新到舊'],
                  ] as const
                ).map(([v, s]) => (
                  <option key={v} value={v}>
                    {t(s)}
                  </option>
                ))}
              </select>
            </label>
            <button
              className={filters.savedOnly ? 'saved active' : 'saved'}
              aria-pressed={filters.savedOnly}
              onClick={() => setFilter('savedOnly', !filters.savedOnly)}
            >
              ♡ {t('收藏')} {dealer.favorites.length}
            </button>
          </div>
          <div className="result-line">
            <span>
              {filtered.length} {t('台車源')}
            </span>
            <button
              className="text-button"
              onClick={() =>
                setFilters({
                  query: '',
                  body: 'all',
                  price: 'all',
                  sort: 'featured',
                  savedOnly: false,
                })
              }
            >
              {t('清除篩選')} ↗
            </button>
          </div>
          <Feedback message={notice || dealer.error} error={!!dealer.error} />
          <div className="vehicle-grid grid grid-cols-1 gap-[22px] min-[451px]:grid-cols-2 min-[761px]:grid-cols-3 max-[1050px]:gap-[14px]">
            {filtered.map((car) => (
              <article className="vehicle-card min-w-0 bg-white" key={car.id}>
                <div className="vehicle-visual relative overflow-hidden">
                  <VehicleImage car={car} />
                  <span className="tag">{t(statusLabels[car.status])}</span>
                  <button
                    className="heart"
                    aria-label={t('收藏') + ' ' + t(car.name)}
                    aria-pressed={dealer.favorites.includes(car.id)}
                    onClick={() => dealer.toggleFavorite(car.id)}
                  >
                    {dealer.favorites.includes(car.id) ? '♥' : '♡'}
                  </button>
                </div>
                <div className="vehicle-copy">
                  <span className="eyebrow">{car.id} / SELECTED IMPORT</span>
                  <h3>{t(car.name)}</h3>
                  <div className="specs">
                    <span>{car.year}</span>
                    <span>{car.mileage}</span>
                    <span>{t(car.body)}</span>
                  </div>
                  <div className="card-bottom">
                    <strong>{money(car.price * 10000, locale)}</strong>
                    <button
                      className="text-button"
                      onClick={() => setDetail(car.id)}
                    >
                      {t('查看詳情')} ↗
                    </button>
                  </div>
                  <label className="compare-check">
                    <input
                      type="checkbox"
                      checked={compare.includes(car.id)}
                      onChange={() => {
                        try {
                          setCompare(toggleComparison(compare, car.id));
                          setNotice('');
                        } catch (e) {
                          setNotice(
                            t(e instanceof Error ? e.message : String(e)),
                          );
                        }
                      }}
                    />
                    {t('加入比較')}
                  </label>
                </div>
              </article>
            ))}
          </div>
          {!filtered.length && (
            <div className="empty">
              <h3>{t('沒有符合條件的車源')}</h3>
              <p>{t('調整條件或清除篩選，繼續探索其他選擇。')}</p>
            </div>
          )}
          <p className="note">
            {t(
              '本網站為概念作品。車輛圖片為 AI 示意圖，車況、規格與售價不代表實際在售車輛。',
            )}
          </p>
        </section>
        <section className="comparison section" id="compare">
          <div className="section-heading mb-[35px] flex items-end justify-between gap-[35px] max-[760px]:block">
            <div>
              <span className="eyebrow">SIDE BY SIDE / 02</span>
              <h2>{t('把喜歡，放在一起。')}</h2>
            </div>
            <p>{t('從車源卡片選擇兩至三台車進行比較。')}</p>
          </div>
          {selected.length > 0 && (
            <div className="comparison-tags mb-[25px] flex flex-wrap gap-[10px]">
              {selected.map((c) => (
                <button
                  key={c.id}
                  onClick={() =>
                    setCompare(compare.filter((id) => id !== c.id))
                  }
                >
                  {t(c.name)} ×
                </button>
              ))}
            </div>
          )}
          {selected.length < 2 ? (
            <p className="empty">{t('選擇至少兩台車，即可查看比較表。')}</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t('比較項目')}</th>
                    {selected.map((c) => (
                      <th key={c.id}>{t(c.name)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ['售價', (c: Vehicle) => money(c.price * 10000, locale)],
                      ['年份', (c: Vehicle) => c.year],
                      ['里程', (c: Vehicle) => c.mileage],
                      ['車型', (c: Vehicle) => t(c.body)],
                      ['排氣量', (c: Vehicle) => c.engine],
                      ['顏色', (c: Vehicle) => t(c.color)],
                      ['狀態', (c: Vehicle) => t(statusLabels[c.status])],
                    ] as const
                  ).map(([label, value]) => (
                    <tr key={label}>
                      <th>{t(label)}</th>
                      {selected.map((c) => (
                        <td key={c.id}>{value(c)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <section className="process section" id="process">
          <span className="eyebrow">A CLEARER JOURNEY / 03</span>
          <h2>{t('選車的每一步，都有方向。')}</h2>
          <div className="steps mt-[50px] grid grid-cols-3 gap-10 max-[760px]:grid-cols-1 max-[760px]:gap-[25px]">
            {(
              [
                ['篩選與比較', '從車型、預算到年份，整理你的選擇。'],
                ['確認車況', '實際交易前，核對里程、保養與進口文件。'],
                ['預約與諮詢', '先記下你的問題，再安排看車與試乘。'],
              ] as const
            ).map(([h, p], i) => (
              <article key={h}>
                <span>0{i + 1}</span>
                <h3>{t(h)}</h3>
                <p>{t(p)}</p>
              </article>
            ))}
          </div>
        </section>
        <LoanCalculator />
        <section
          className="inquiry section grid grid-cols-2 gap-[9vw] max-[760px]:grid-cols-1 max-[760px]:gap-[30px]"
          id="inquiry"
        >
          <div>
            <span className="eyebrow">LET'S TALK / 04</span>
            <h2>
              {t('你的下一台，')}
              <br />
              {t('我們一起想。')}
            </h2>
            <p>{t('選定車輛，整理你的問題與看車需求。')}</p>
            <p className="note">
              {t(
                '詢問僅保存在此瀏覽器，可至車源管理查看；不會傳送給車商。請使用測試聯絡資料。',
              )}
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFormError('');
              try {
                const ok = dealer.submitInquiry(form, inquiryId);
                if (ok) {
                  setSubmitted(true);
                  setForm({ name: '', contact: '', message: '' });
                } else
                  setFormError('無法儲存資料，請確認瀏覽器儲存空間後重試。');
              } catch (err) {
                setSubmitted(false);
                setFormError(err instanceof Error ? err.message : String(err));
              }
            }}
          >
            <label>
              {t('想詢問的車輛')}
              <select
                required
                value={inquiryId}
                onChange={(e) => {
                  setInquiryId(e.target.value);
                  setSubmitted(false);
                }}
              >
                <option value="">{t('請選擇車輛')}</option>
                {dealer.cars
                  .filter((c: Vehicle) => c.status !== 'sold')
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {t(c.name)} · {c.id}
                    </option>
                  ))}
              </select>
            </label>
            {(
              [
                ['name', '稱呼', 40],
                ['contact', '聯絡方式', 80],
              ] as const
            ).map(([key, label, max]) => (
              <label key={key}>
                {t(label)}
                <input
                  required
                  maxLength={max}
                  value={form[key]}
                  onChange={(e) => {
                    setForm({ ...form, [key]: e.target.value });
                    setSubmitted(false);
                  }}
                />
              </label>
            ))}
            <label>
              {t('想了解的內容')}
              <textarea
                rows={4}
                maxLength={500}
                value={form.message}
                onChange={(e) => {
                  setForm({ ...form, message: e.target.value });
                  setSubmitted(false);
                }}
              />
            </label>
            <button className="primary" type="submit">
              {t('儲存本機詢問')} ↗
            </button>
            <Feedback
              message={
                formError
                  ? t(formError)
                  : submitted
                    ? t('詢問已儲存，可至管理頁查看。')
                    : ''
              }
              error={!!formError}
            />
          </form>
        </section>
        <SellCarForm />
      </main>
      <footer>
        <a className="wordmark" href="#top">
          {t('好車選品')}<span>{t('外匯車選品')}</span>
        </a>
        <p>
          INDEPENDENT CONCEPT BY DAVID SHEN
          <br />
          {t('概念車源 · 本機互動 · 無實際交易')}
        </p>
        <Link to={'/admin.html?lang=' + language}>{t('車源管理')} ↗</Link>
      </footer>
      <Modal open={!!detail} onClose={() => setDetail(null)} title="車輛資訊">
        {(() => {
          const c = dealer.cars.find((c: Vehicle) => c.id === detail);
          return c ? (
            <div className="detail">
              <VehicleImage car={c} />
              <div className="detail-copy">
                <span className="eyebrow">
                  {c.id} · {t(statusLabels[c.status])}
                </span>
                <h2>{t(c.name)}</h2>
                <p>{t(c.feature)}</p>
                <dl>
                  {(
                    [
                      ['年份', c.year],
                      ['里程', c.mileage],
                      ['排氣量', c.engine],
                      ['顏色', t(c.color)],
                    ] as const
                  ).map(([k, v]) => (
                    <div key={k}>
                      <dt>{t(k)}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <strong className="detail-price">
                  {money(c.price * 10000, locale)}
                </strong>
                <p className="note">
                  {t(
                    '圖片及資料僅供概念展示，實際交易前請另行查驗車況與文件。',
                  )}
                </p>
                <a
                  className="primary"
                  href="#inquiry"
                  onClick={() => goInquiry(c)}
                >
                  {t('詢問這台車')} ↗
                </a>
              </div>
            </div>
          ) : null;
        })()}
      </Modal>
    </>
  );
}
