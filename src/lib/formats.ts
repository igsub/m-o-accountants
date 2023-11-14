let USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export const Formats = {
  currency: (value: number) => USDollar.format(value),
  percentage: (value: number) => `%${value.toString()}`,
  date: (value: string) => new Date(value).toLocaleDateString("en-US", dateOptions)
}