import { MoneyUnit } from '@/app/interfaces/money';

// export const MONEY_UNITS:MoneyUnit = [
export const MONEY_UNITS: MoneyUnit[] = [
  { denomination: 2000, type: 'banknote', quantity: 5 },
  { denomination: 1000, type: 'banknote', quantity: 5 },
  { denomination: 500, type: 'banknote', quantity: 5 },
  { denomination: 100, type: 'banknote', quantity: 10 },
  { denomination: 50, type: 'banknote', quantity: 10 },
  { denomination: 20, type: 'banknote', quantity: 10 },
  { denomination: 10, type: 'coin', quantity: 20 },
  { denomination: 5, type: 'coin', quantity: 20 },
  { denomination: 1, type: 'coin', quantity: 50 },
];
