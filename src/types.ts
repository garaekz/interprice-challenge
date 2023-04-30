
export interface Company {
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