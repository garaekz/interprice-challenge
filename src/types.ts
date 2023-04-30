
export interface Item {
  Id: string | null;
  DateSent: string | null;
  Company: string;
  Preferred: string;
  Quote: FormattedQuote | null;
}

export interface FormattedQuote {
  [key: string]: {
    [key: number]: {
      [key: string]: Quote;
    };
  };
}

export interface Quote {
  Amount: number
  Currency: string
  Years: number
  CouponType: string
  Spread: number
  Yield: number | null
  '3MLSpread': number | null
}

export type Field = "Spread" | "Yield" | "3MLSpread";
export type BondType = "FIX" | "FRN";
export interface MinValue {
  currency: string;
  year: string;
  field: Field;
  bondType: BondType;
  value: number;
}