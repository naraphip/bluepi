export interface MoneyUnit {
  denomination: number; // เช่น 1, 5, 10, 20, ...
  type: 'coin' | 'banknote';
  quantity: number;
}