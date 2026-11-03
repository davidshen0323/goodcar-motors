import type {
  Vehicle,
  VehicleDraft,
  Inquiry,
  InquiryForm,
  VehicleFilters,
} from '../../../models';
import { createId } from '../../../shared/lib/id';
export const vehicleStatuses = ['available', 'reserved', 'sold'];
export const inquiryStatuses = ['new', 'contacted', 'closed'];
export function filterVehicles(
  cars: Vehicle[],
  {
    query = '',
    body = 'all',
    price = 'all',
    sort = 'featured',
    savedOnly = false,
    favorites = [],
  }: VehicleFilters = {},
) {
  const q = query.trim().toLowerCase();
  return cars
    .filter(
      (c) =>
        c.status !== 'sold' &&
        (body === 'all' || c.body === body) &&
        (price === 'all' || c.price <= Number(price)) &&
        (!savedOnly || favorites.includes(c.id)) &&
        (!q ||
          `${c.id} ${c.name} ${c.photo} ${c.year}`.toLowerCase().includes(q)),
    )
    .sort((a, b) =>
      sort === 'low'
        ? a.price - b.price
        : sort === 'high'
          ? b.price - a.price
          : sort === 'newest'
            ? b.year - a.year
            : 0,
    );
}
export function validateVehicle(
  raw: VehicleDraft,
): Omit<Vehicle, 'id'> & { id?: string } {
  const name = String(raw.name ?? '').trim();
  const feature = String(raw.feature ?? '').trim();
  const v = {
    ...raw,
    name,
    feature,
    year: Number(raw.year),
    price: Number(raw.price),
    mileageKm: Number(raw.mileageKm),
  };
  if (
    !name ||
    name.length > 80 ||
    !feature ||
    feature.length > 500 ||
    !['房車', '休旅', '雙門'].includes(v.body) ||
    !vehicleStatuses.includes(v.status) ||
    !['sedan', 'suv', 'coupe'].includes(v.photo)
  )
    throw new Error('請確認車輛名稱、描述、車型與狀態。');
  if (
    !Number.isInteger(v.year) ||
    v.year < 1980 ||
    v.year > new Date().getFullYear() ||
    !Number.isFinite(v.price) ||
    v.price <= 0 ||
    v.price > 2000 ||
    !Number.isInteger(v.mileageKm) ||
    v.mileageKm < 0 ||
    v.mileageKm > 1000000
  )
    throw new Error('請填寫有效的年份、價格與里程。');
  if (!String(v.engine ?? '').trim() || !String(v.color ?? '').trim())
    throw new Error('請填寫排氣量與顏色。');
  return { ...v, mileage: `${v.mileageKm.toLocaleString('en-US')} km` };
}
export function makeInquiry(
  raw: InquiryForm,
  car: Vehicle | undefined,
  now = new Date().toISOString(),
): Inquiry {
  const name = String(raw.name ?? '').trim(),
    contact = String(raw.contact ?? '').trim(),
    message = String(raw.message ?? '').trim();
  if (!car || car.status === 'sold') throw new Error('請選擇可詢問的車輛。');
  if (
    !name ||
    name.length > 40 ||
    !contact ||
    contact.length > 80 ||
    message.length > 500
  )
    throw new Error('請填寫稱呼與聯絡方式。');
  return {
    id: createId(),
    carId: car.id,
    carName: car.name,
    price: car.price,
    name,
    contact,
    message,
    status: 'new',
    createdAt: now,
    history: [{ status: 'new', at: now }],
  };
}
export function transitionInquiry(
  record: Inquiry,
  next: string,
  now = new Date().toISOString(),
) {
  const allowed: Record<string, string[]> = {
    new: ['contacted', 'closed'],
    contacted: ['closed'],
    closed: [],
  };
  if (!allowed[record.status]?.includes(next))
    throw new Error('無法變更為此處理狀態。');
  return {
    ...record,
    status: next,
    history: [...record.history, { status: next, at: now }],
  };
}
export function toggleComparison(ids: string[], id: string) {
  if (ids.includes(id)) return ids.filter((x) => x !== id);
  if (ids.length >= 3) throw new Error('最多比較三台車，請先移除一台。');
  return [...ids, id];
}
