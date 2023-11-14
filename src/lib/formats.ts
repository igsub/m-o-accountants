let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const Formats = {
  currency: (value: number) => USDollar.format(value),
  percentage: (value: number) => `%${value.toString()}`
}