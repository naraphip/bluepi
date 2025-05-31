import { MoneyUnit } from '@/app/interfaces/money';

export function calculateChange(
  changeAmount: number,
  availableUnits: MoneyUnit[]
): { change: MoneyUnit[]; success: boolean } {
  const sortedUnits = [...availableUnits].sort((a, b) => b.denomination - a.denomination);
  const change: MoneyUnit[] = [];

  for (const unit of sortedUnits) {
    let count = 0;
    while (
      changeAmount >= unit.denomination &&
      unit.quantity - count > 0
    ) {
      changeAmount -= unit.denomination;
      count++;
    }
    if (count > 0) {
      change.push({ ...unit, quantity: count });
    }
  }

  return {
    change,
    success: changeAmount === 0
  };
}
