import type { VehicleDraft } from '../../models';
import type { ChangeEvent } from 'react';
import type { useDealer } from './useDealer';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../shared/i18n/I18nProvider';
import Modal from '../../shared/components/Modal';
import Feedback from '../../shared/components/Feedback';
import { statusLabels } from './useDealer';
import { downloadCsv } from '../../shared/lib/csv';
import { money } from '../../shared/lib/format';
const blank = (): VehicleDraft => ({
  name: '',
  year: new Date().getFullYear(),
  mileageKm: 0,
  price: 180,
  body: '房車',
  engine: '2.0 L',
  color: '銀色',
  feature: '',
  photo: 'sedan',
  status: 'available',
});
export default function Admin({
  dealer,
}: {
  dealer: ReturnType<typeof useDealer>;
}) {
  const { t, locale, language } = useI18n();
  const [tab, setTab] = useState('vehicles'),
    [edit, setEdit] = useState<VehicleDraft | null>(null),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [query, setQuery] = useState(''),
    [status, setStatus] = useState('all');
  const vehicles = dealer.cars.filter((c) =>
    `${c.name} ${c.id}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const inquiries = dealer.inquiries.filter(
    (r) => status === 'all' || r.status === status,
  );
  const update = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    if (edit) setEdit({ ...edit, [e.target.name]: e.target.value });
  };
  return (
    <div className="admin">
      <div className="admin-top flex items-center justify-between">
        <Link className="wordmark" to={'/?lang=' + language}>
          {t('好車選品')}<span>{t('車源管理')}</span>
        </Link>
        <Link className="outline-button" to={'/?lang=' + language}>
          {t('返回車源前台')} ↗
        </Link>
      </div>
      <div className="admin-intro">
        <span className="eyebrow">CONTROL ROOM / LOCAL WORKSPACE</span>
        <h1>{t('車源與詢問管理')}</h1>
        <p>
          {t('此管理頁供本機流程展示，無登入權限控管。資料僅存在目前瀏覽器。')}
        </p>
      </div>
      <div className="metrics grid grid-cols-4 gap-5 max-[760px]:grid-cols-2 max-[760px]:gap-[15px]">
        {(
          [
            ['車源總數', dealer.cars.length],
            [
              '可預約',
              dealer.cars.filter((c) => c.status === 'available').length,
            ],
            [
              '洽談中',
              dealer.cars.filter((c) => c.status === 'reserved').length,
            ],
            [
              '待處理詢問',
              dealer.inquiries.filter((r) => r.status === 'new').length,
            ],
          ] as const
        ).map(([k, v]) => (
          <div key={k}>
            <span>{t(k)}</span>
            <strong>{v.toString().padStart(2, '0')}</strong>
          </div>
        ))}
      </div>
      <div className="tabs">
        <button
          aria-pressed={tab === 'vehicles'}
          onClick={() => setTab('vehicles')}
        >
          {t('車源管理')}
        </button>
        <button
          aria-pressed={tab === 'inquiries'}
          onClick={() => setTab('inquiries')}
        >
          {t('詢問管理')} <span>{dealer.inquiries.length}</span>
        </button>
      </div>
      <Feedback
        message={error || dealer.error || message}
        error={!!(error || dealer.error)}
      />
      {tab === 'vehicles' ? (
        <section className="admin-panel">
          <div className="toolbar">
            <label>
              {t('搜尋車源')}
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('搜尋名稱或編號')}
              />
            </label>
            <button
              className="primary"
              onClick={() => {
                setEdit(blank());
                setError('');
              }}
            >
              {t('新增車源')} ＋
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {(
                    ['車輛', '年份／里程', '售價', '狀態', '操作'] as const
                  ).map((x) => (
                    <th key={x}>{t(x)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="admin-car flex items-center gap-[15px]">
                        <img src={'/vehicles/' + c.photo + '.png'} alt="" />
                        <div>
                          <strong>{t(c.name)}</strong>
                          <small>{c.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {c.year}
                      <br />
                      <small>{c.mileage}</small>
                    </td>
                    <td>{money(c.price * 10000, locale)}</td>
                    <td>
                      <span className={'status status-' + c.status}>
                        {t(statusLabels[c.status])}
                      </span>
                    </td>
                    <td>
                      <button
                        className="outline-button"
                        aria-label={t('編輯') + ' ' + t(c.name)}
                        onClick={() => {
                          setEdit({ ...c });
                          setError('');
                        }}
                      >
                        {t('編輯')} ↗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!vehicles.length && (
              <p className="empty">{t('沒有符合條件的車源')}</p>
            )}
          </div>
        </section>
      ) : (
        <section className="admin-panel">
          <div className="toolbar">
            <label>
              {t('處理狀態')}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {(['all', 'new', 'contacted', 'closed'] as const).map((s) => (
                  <option key={s} value={s}>
                    {t(s === 'all' ? '全部狀態' : statusLabels[s])}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="outline-button"
              disabled={!inquiries.length}
              onClick={() =>
                downloadCsv('goodcar-inquiries.csv', [
                  [
                    t('編號'),
                    t('車輛'),
                    t('稱呼'),
                    t('聯絡方式'),
                    t('需求'),
                    t('狀態'),
                    t('建立時間'),
                  ],
                  ...inquiries.map((r) => [
                    r.id,
                    r.carName,
                    r.name,
                    r.contact,
                    r.message,
                    t(statusLabels[r.status]),
                    r.createdAt,
                  ]),
                ])
              }
            >
              {t('匯出篩選結果')} CSV ↗
            </button>
          </div>
          {!inquiries.length ? (
            <p className="empty">
              {t('目前沒有詢問。請先到前台儲存一筆測試詢問。')}
            </p>
          ) : (
            <div className="inquiry-list grid grid-cols-2 gap-[25px] max-[760px]:grid-cols-1">
              {inquiries.map((r) => (
                <article key={r.id}>
                  <div className="inquiry-heading">
                    <div>
                      <span className="eyebrow">{r.carId}</span>
                      <h3>{t(r.carName)}</h3>
                    </div>
                    <span className={'status status-' + r.status}>
                      {t(statusLabels[r.status])}
                    </span>
                  </div>
                  <dl>
                    <div>
                      <dt>{t('稱呼')}</dt>
                      <dd>{r.name}</dd>
                    </div>
                    <div>
                      <dt>{t('聯絡方式')}</dt>
                      <dd>{r.contact}</dd>
                    </div>
                    <div>
                      <dt>{t('建立時間')}</dt>
                      <dd>{new Date(r.createdAt).toLocaleString(locale)}</dd>
                    </div>
                  </dl>
                  <p className="inquiry-message">{r.message || t('未填寫')}</p>
                  <details>
                    <summary>{t('處理紀錄')}</summary>
                    <ol>
                      {r.history.map((h, i) => (
                        <li key={i}>
                          {t(statusLabels[h.status])} ·{' '}
                          {new Date(h.at).toLocaleString(locale)}
                        </li>
                      ))}
                    </ol>
                  </details>
                  <div className="inquiry-actions mt-5 flex gap-[15px]">
                    {(r.status === 'new'
                      ? ['contacted', 'closed']
                      : r.status === 'contacted'
                        ? ['closed']
                        : []
                    ).map((next) => (
                      <button
                        className="outline-button"
                        key={next}
                        onClick={() => {
                          try {
                            if (dealer.changeInquiry(r.id, next)) {
                              setMessage('處理狀態已更新。');
                              setError('');
                            }
                          } catch (e) {
                            setError(
                              e instanceof Error ? e.message : String(e),
                            );
                          }
                        }}
                      >
                        {t(next === 'contacted' ? '標記已聯絡' : '結案')}
                      </button>
                    ))}
                    {r.status === 'closed' && (
                      <small>{t('已結案，狀態已鎖定。')}</small>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? '編輯車源' : '新增車源'}
      >
        {edit && (
          <form
            className="vehicle-form"
            onSubmit={(e) => {
              e.preventDefault();
              try {
                if (dealer.saveVehicle(edit)) {
                  setEdit(null);
                  setMessage('車源已儲存，前台同步更新。');
                  setError('');
                } else setError('無法儲存資料，請確認瀏覽器儲存空間後重試。');
              } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
              }
            }}
          >
            <div className="form-grid grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
              {(
                [
                  ['name', '車輛名稱', 'text'],
                  ['year', '年份', 'number'],
                  ['mileageKm', '里程（公里）', 'number'],
                  ['price', '售價（萬元）', 'number'],
                  ['engine', '排氣量', 'text'],
                  ['color', '顏色', 'text'],
                ] as const
              ).map(([key, label, type]) => (
                <label key={key}>
                  {t(label)}
                  <input
                    name={key}
                    type={type}
                    required
                    maxLength={80}
                    step={key === 'price' ? '0.1' : '1'}
                    min={key === 'year' ? 1980 : key === 'price' ? 0.1 : 0}
                    max={
                      key === 'year'
                        ? new Date().getFullYear()
                        : key === 'price'
                          ? 2000
                          : key === 'mileageKm'
                            ? 1000000
                            : undefined
                    }
                    value={edit[key]}
                    onChange={update}
                  />
                </label>
              ))}
              <label>
                {t('車型')}
                <select name="body" value={edit.body} onChange={update}>
                  {(['房車', '休旅', '雙門'] as const).map((v) => (
                    <option key={v} value={v}>
                      {t(v)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t('狀態')}
                <select name="status" value={edit.status} onChange={update}>
                  {(['available', 'reserved', 'sold'] as const).map((v) => (
                    <option key={v} value={v}>
                      {t(statusLabels[v])}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t('示意圖片')}
                <select name="photo" value={edit.photo} onChange={update}>
                  {(
                    [
                      ['sedan', '房車'],
                      ['suv', '休旅'],
                      ['coupe', '雙門'],
                    ] as const
                  ).map(([v, label]) => (
                    <option key={v} value={v}>
                      {t(label)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="full col-span-full max-[760px]:col-span-1">
                {t('車輛描述')}
                <textarea
                  name="feature"
                  required
                  maxLength={500}
                  rows={3}
                  value={edit.feature}
                  onChange={update}
                />
              </label>
            </div>
            <p className="note">{t('標記已售出的車輛將從前台隱藏。')}</p>
            <Feedback message={error || dealer.error} error />
            <button className="primary" type="submit">
              {t('儲存車源')} ↗
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
