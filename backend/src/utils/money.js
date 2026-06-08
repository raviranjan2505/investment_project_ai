export function toMoney(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return NaN;
  return Math.round(number * 100) / 100;
}

export function addPercent(amount, rate) {
  return toMoney(Number(amount) + (Number(amount) * Number(rate)) / 100);
}
