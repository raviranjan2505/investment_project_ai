export function formatCurrency(amount: string, currency: string): string {
  const numericAmount = Number(amount);

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

export function titleCase(value: string): string {
  return value
    .split(/[\s-]+/)
    .filter((segment) => segment.length > 0)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(' ');
}
