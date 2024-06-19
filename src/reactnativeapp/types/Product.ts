export type Money = {
  currencyCode: string;
  units: number;
  nanos: number;
}

export type Product = {
  id: string;
  name: string;
  description: string;
  picture: string;
  priceUsd: Money;
  categories: string[];
}