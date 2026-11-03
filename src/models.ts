export interface Vehicle {
  id: string;
  name: string;
  body: string;
  year: number;
  mileage: string;
  mileageKm: number;
  price: number;
  engine: string;
  color: string;
  photo: string;
  feature: string;
  status: string;
}
export type VehicleDraft = Omit<
  Vehicle,
  'id' | 'year' | 'price' | 'mileageKm' | 'mileage'
> & {
  id?: string;
  year: number | string;
  price: number | string;
  mileageKm: number | string;
  mileage?: string;
};
export interface InquiryForm {
  name: string;
  contact: string;
  message: string;
}
export interface Inquiry {
  id: string;
  carId: string;
  carName: string;
  price: number;
  name: string;
  contact: string;
  message: string;
  status: string;
  createdAt: string;
  history: { status: string; at: string }[];
}
export interface VehicleFilters {
  query?: string;
  body?: string;
  price?: string;
  sort?: string;
  savedOnly?: boolean;
  favorites?: string[];
}
