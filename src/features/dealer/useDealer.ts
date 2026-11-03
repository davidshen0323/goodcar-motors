import type { Vehicle, VehicleDraft, Inquiry, InquiryForm } from '../../models';
import { createId } from '../../shared/lib/id';
import { useStoredState } from '../../shared/hooks/useStoredState';
import seed from './data/cars.json';
import {
  makeInquiry,
  transitionInquiry,
  validateVehicle,
} from './domain/inventory';
export const statusLabels: Record<string, string> = {
  available: '可預約',
  reserved: '洽談中',
  sold: '已售出',
  new: '新詢問',
  contacted: '已聯絡',
  closed: '已結案',
};
export function useDealer() {
  const [cars, setCars, carError] = useStoredState<Vehicle[]>(
    'atelier-vehicles-v1',
    seed,
  );
  const [favorites, setFavorites, favoriteError] = useStoredState<string[]>(
    'atelier-favorites-v1',
    [],
  );
  const [inquiries, setInquiries, inquiryError] = useStoredState<Inquiry[]>(
    'atelier-inquiries-v1',
    [],
  );
  function saveVehicle(raw: VehicleDraft) {
    const car = validateVehicle(raw);
    const saved: Vehicle = {
      ...car,
      id: raw.id || 'AS-' + createId().slice(0, 12).toUpperCase(),
    };
    return setCars((list) =>
      raw.id
        ? list.map((c) => (c.id === raw.id ? saved : c))
        : [saved, ...list],
    );
  }
  function submitInquiry(raw: InquiryForm, id: string) {
    const record = makeInquiry(
      raw,
      cars.find((c) => c.id === id),
    );
    return setInquiries((list) => [record, ...list]);
  }
  function changeInquiry(id: string, status: string) {
    return setInquiries((list) =>
      list.map((r) => (r.id === id ? transitionInquiry(r, status) : r)),
    );
  }
  return {
    cars,
    favorites,
    inquiries,
    saveVehicle,
    submitInquiry,
    changeInquiry,
    error: carError || favoriteError || inquiryError,
    toggleFavorite: (id: string) =>
      setFavorites((ids) =>
        ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
      ),
  };
}
