import { describe, it, expect } from 'vitest';
import {
  filterVehicles,
  validateVehicle,
  makeInquiry,
  transitionInquiry,
  toggleComparison,
} from '../src/features/dealer/domain/inventory';
import { estimateLoan } from '../src/features/dealer/domain/loan';
import { createCsv } from '../src/shared/lib/csv';
import seed from '../src/features/dealer/data/cars.json';
describe('Vehicle inventory rules', () => {
  it('combines saved, budget and body filters while hiding sold stock', () => {
    expect(
      filterVehicles([...seed, { ...seed[0], id: 'sold', status: 'sold' }], {
        body: '房車',
        price: 200,
        savedOnly: true,
        favorites: ['AS-101', 'sold'],
      }),
    ).toEqual([seed[0]]);
  });
  it('searches IDs and years, sorts price without mutating source', () => {
    expect(filterVehicles(seed, { query: 'AS-102' })).toEqual([seed[1]]);
    expect(filterVehicles(seed, { query: '2023' })).toEqual([seed[2]]);
    expect(filterVehicles(seed, { sort: 'high' })[0].id).toBe('AS-103');
    expect(seed[0].id).toBe('AS-101');
  });
  it('validates price, year and mileage and normalizes strings', () => {
    expect(
      validateVehicle({
        ...seed[0],
        price: '199.5',
        mileageKm: '20000',
        name: '  New car  ',
      }).mileage,
    ).toBe('20,000 km');
    for (const patch of [
      { price: 0 },
      { year: 2099 },
      { mileageKm: -1 },
      { mileageKm: 1.2 },
      { photo: 'evil' },
      { name: '  ' },
    ])
      expect(() => validateVehicle({ ...seed[0], ...patch })).toThrow();
  });
  it('limits comparison to three and permits removing an entry', () => {
    expect(() => toggleComparison(['a', 'b', 'c'], 'd')).toThrow();
    expect(toggleComparison(['a', 'b', 'c'], 'b')).toEqual(['a', 'c']);
  });
});
describe('Inquiry workflow', () => {
  const raw = {
    name: ' Test ',
    contact: 'test@example.com',
    message: 'A question',
  };
  it('keeps a vehicle snapshot even if inventory is edited', () => {
    const car = { ...seed[0] };
    const r = makeInquiry(raw, car, '2026-01-01T00:00:00Z');
    car.name = 'Changed';
    expect(r.carName).toBe(seed[0].name);
    expect(r.name).toBe('Test');
    expect(r.history).toHaveLength(1);
  });
  it('rejects sold vehicles, missing contacts and whitespace', () => {
    expect(() => makeInquiry(raw, { ...seed[0], status: 'sold' })).toThrow();
    expect(() => makeInquiry({ ...raw, contact: ' ' }, seed[0])).toThrow();
    expect(() => makeInquiry(raw, null)).toThrow();
  });
  it('records transitions and locks closed inquiries', () => {
    let r = makeInquiry(raw, seed[0]);
    r = transitionInquiry(r, 'contacted', '2026-01-02');
    r = transitionInquiry(r, 'closed', '2026-01-03');
    expect(r.history.map((h) => h.status)).toEqual([
      'new',
      'contacted',
      'closed',
    ]);
    expect(() => transitionInquiry(r, 'new')).toThrow();
  });
});
describe('Budget and exports', () => {
  it('calculates zero-interest and fully prepaid budgets', () => {
    expect(
      estimateLoan({ price: 180, downPayment: 0, months: 60, annualRate: 0 })
        .monthly,
    ).toBe(30000);
    expect(
      estimateLoan({ price: 180, downPayment: 180, months: 60, annualRate: 3 })
        .monthly,
    ).toBe(0);
  });
  it('rejects overpayments and invalid numbers', () => {
    expect(() =>
      estimateLoan({ price: 100, downPayment: 101, months: 60, annualRate: 3 }),
    ).toThrow();
    expect(() =>
      estimateLoan({ price: NaN, downPayment: 0, months: 60, annualRate: 3 }),
    ).toThrow();
  });
  it('escapes quotations, multiline content and CSV formulas', () => {
    const s = createCsv([[' =SUM(1,1)', 'a"b', 'a\nb']]);
    expect(s).toContain("' =SUM");
    expect(s).toContain('a""b');
    expect(s).toContain('"a\nb"');
  });
});
